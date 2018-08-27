import { css } from "emotion";
import * as R from "ramda";
import * as React from "react";
import { HotKeys } from "react-hotkeys";
import Plain from "slate-plain-serializer";
import { Editor } from "slate-react";
import { TodoType } from "./Document";
// import { DefaultText, InnerDivider, OuterDivider } from "../styles/EditorStyle";
import { TodoStyle } from "./TodoStyles";
import * as ReactDOM from "react-dom";
import styled from "react-emotion";
import { colors } from "./colors";

let cuid = require("cuid");
const DefaultText = styled("div")(
  {
    paddingRight: "1.5ch",
    // background: 'red'
  },
  ({ field, h1 }: { field: boolean; h1: boolean }) => ({
    paddingLeft: field || h1 ? "0.5ch" : "1.5ch",
    fontWeight: h1 ? 400 : 300,
  }),
);
const OuterDivider = styled("div")({
  position: "relative",
  color: "#f0f0f0",
  margin: 0,
  padding: 0,
});
const InnerDivider = styled("div")(
  {
    // background: colors.noteBorder,
    height: 0,
    width: "100%",
    top: "40%",
    display: "block",
    position: "absolute",
    margin: 0,
    padding: 0,
  },
  ({ dashed }: { dashed: boolean }) => ({
    borderTop: `1px ${dashed ? "dashed" : "solid"} ${colors.noteBorder}`,
  }),
);
export type TodoProps = {
  todo: TodoType;
  onDragStart: (e: any, todo: TodoType) => void;
  dragging: boolean;
  select: (id: string) => void;
  selected: boolean;
};
const renderNode = ({ node, attributes, children, isSelected }: any) => {
  if (
    (node.text.startsWith("--") || node.text.startsWith("- - -")) &&
    !isSelected
  ) {
    return (
      <OuterDivider {...attributes}>
        <InnerDivider dashed={node.text.startsWith("- - -")} />
        {children}
      </OuterDivider>
    );
  } else {
    return (
      <DefaultText
        {...attributes}
        field={node.text.startsWith("-") || node.text.startsWith("+")}
        h1={node.text.startsWith("#")}
      >
        {children}
      </DefaultText>
    );
  }
};
type LocalNote = {
  w: number;
  h: number;
  isNew: boolean;
};
type BoxProps = {
  localBox?: LocalNote;
  actions: {
    UpdateNoteText: (
      p: {
        id: string;
        name: string;
        projectId: string;
      },
    ) => void;
    RemoveNote: (
      p: {
        id: string;
        projectId: string;
      },
    ) => void;
    CreateNote: (
      p: {
        id: string;
        x: number;
        y: number;
        projectId: string;
      },
    ) => void;
    UpdateNoteSize: (
      p: {
        id: string;
        h: number;
        w: number;
      },
    ) => void;
  };
  projectId: string;
};

type MeProps = {
  selected: boolean;
  name: string;
  id: string;
  onClick: any;
  createNoteBeneath: () => void;
  select: (id?: string) => void;
};

class MyEditor extends React.Component<MeProps & BoxProps> {
  editor?: typeof Editor;
  state = {
    value: Plain.deserialize(this.props.name),
    editing: false,
  };
  handlers = {
    remove: () => {
      if (!this.state.editing) {
        this.props.actions.RemoveNote({
          id: this.props.id,
          projectId: this.props.projectId,
        });
      }
    },
    shiftie: () => {
      this.onBlur();
      this.props.createNoteBeneath();
    },
    esc: () => {
      this.props.select("");
      this.editor!.blur();
    },
  };

  componentDidMount() {
    if (this.props.localBox) {
      this.editor!.focus();
      setTimeout(() => {
        let htmlElement = ReactDOM.findDOMNode(this
          .editor! as any) as HTMLElement;
        htmlElement.focus();
        this.editor!.change((c) => c.deselect().flip());
      }, 5);
    }
  }

  componentWillReceiveProps(nextProps: MeProps) {
    if (this.props.name === nextProps.name && this.state.editing) {
      return;
    }
    this.setState({ value: Plain.deserialize(nextProps.name) });
  }

  shouldComponentUpdate(np: this["props"], ns: this["state"]) {
    let pp = this.props;
    return (
      np.id !== pp.id ||
      np.name !== pp.name ||
      np.selected !== pp.selected ||
      ns.editing ||
      (np.localBox && np.localBox.isNew) !== (pp.localBox && pp.localBox.isNew)
    );
  }

  render() {
    return (
      <HotKeys handlers={this.handlers}>
        <Editor
          value={this.state.value}
          onChange={this.onChange}
          renderNode={renderNode}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          readOnly={
            !this.props.selected &&
            !(this.props.localBox && this.props.localBox.isNew)
          }
          onClick={this.props.onClick}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
            e.shiftKey && e.key === "Enter" ? false : null
          }
          ref={(ref: any) => (this.editor = ref)}
          className={css({
            paddingTop: "1.3ch",
            paddingBottom: "1.2ch",
          })}
        />
      </HotKeys>
    );
  }

  onChange = ({ value }: any) => {
    this.setState({ value });
  };

  onBlur = () => {
    let name = Plain.serialize(this.state.value);
    this.props.actions.UpdateNoteText({
      id: this.props.id,
      name,
      projectId: this.props.projectId,
    });
    this.setState({ editing: false });
  };

  onFocus = () => {
    this.setState({ editing: true });
  };
}

export class Note extends React.Component<BoxProps & TodoProps> {
  bs?: Element;

  componentDidMount() {
    this.updateSize();
  }

  componentDidUpdate() {
    this.updateSize();
  }

  shouldComponentUpdate(np: BoxProps & TodoProps, ns: any) {
    let pp = this.props;
    return !(
      np.todo.id === pp.todo.id &&
      np.todo.name === pp.todo.name &&
      np.todo.x === pp.todo.x &&
      np.todo.y === pp.todo.y &&
      np.todo.dx === pp.todo.dx &&
      np.todo.dy === pp.todo.dy &&
      np.dragging === pp.dragging &&
      np.selected === pp.selected
    );
  }

  render() {
    return (
      <TodoStyle
        {...this.props.todo}
        onDragStart={this.onDragStart}
        draggable="true"
        data-box-id={this.props.todo.id}
        dragging={this.props.dragging}
        selected={this.props.selected}
        innerRef={(ref: Element) => (this.bs = ref)}
        onDoubleClick={(e: any) => e.stopPropagation()}
      >
        <MyEditor
          onClick={this.onClick}
          selected={this.props.selected}
          name={this.props.todo.name}
          id={this.props.todo.id}
          actions={this.props.actions}
          createNoteBeneath={this.createNoteBeneath}
          localBox={this.props.localBox}
          select={(id = this.props.todo.id) => this.props.select(id)}
          projectId={this.props.projectId}
        />
      </TodoStyle>
    );
  }

  createNoteBeneath = () => {
    let margin = 8;
    let projectId = this.props.projectId;

    this.props.actions.CreateNote({
      id: cuid(),
      x: this.props.todo.x,
      y: this.props.todo.y + this.props.localBox!.h + margin,
      projectId,
    });
  };

  onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    this.props.select(this.props.todo.id);
  };

  updateSize = () => {
    const { width, height } = this.bs!.getBoundingClientRect();
    const shouldUpdateSize = R.anyPass([
      R.complement(R.pathEq(["localBox", "w"], width)),
      R.complement(R.pathEq(["localBox", "h"], width)),
    ])(this.props);

    if (shouldUpdateSize) {
      this.props.actions.UpdateNoteSize({
        id: this.props.todo.id,
        h: height,
        w: width,
      });
    }
  };

  onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    this.props.onDragStart(e, this.props.todo);
  };
}
