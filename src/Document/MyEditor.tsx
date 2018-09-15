import { css } from "emotion";
import { HotKeys } from "react-hotkeys";
import Plain from "slate-plain-serializer";
import { Editor, RenderMarkProps, RenderNodeProps } from "slate-react";
import * as slate from "slate";
import { BoxProps } from "./Note";
import * as React from "react";
import styled from "react-emotion";
import { colors } from "../colors";
type MeProps = {
  selected: boolean;
  name: string;
  id: string;
  onClick: any;
  createNoteBeneath: () => void;
  select: (id?: string) => void;
};
const DefaultText = styled("div")(
  {
    paddingRight: "1.5ch",
  },
  ({ field, h1 }: { field: boolean; h1: boolean }) => ({
    paddingLeft: field || h1 ? "0.5ch" : "1.5ch",
    fontWeight: h1 ? 700 : 400,
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
    height: 0,
    width: "100%",
    top: "50%",
    display: "block",
    position: "absolute",
    margin: 0,
    padding: 0,
  },
  ({ dashed }: { dashed: boolean }) => ({
    borderTop: `1px ${dashed ? "dashed" : "solid"} ${colors.noteBorder}`,
  }),
);
export class MyEditor extends React.Component<MeProps & BoxProps> {
  editor?: Editor;
  state = {
    value: Plain.deserialize(this.props.name),
    editing: false,
  };
  handlers = {
    remove: () => {
      if (!this.state.editing) {
        this.props.actions.RemoveNote({
          id: this.props.id,
        });
      }
    },
    shiftie: () => {
      this.props.select("");
      this.onBlur();
      this.props.createNoteBeneath();
    },
    esc: () => {
      this.props.select("");
      this.onBlur();
    },
  };
  componentDidMount() {
    if (this.props.localBox.isNew) {
      this.setState({ editing: true }, () => {
        setTimeout(() => {
          this.editor!.change((c) => c.moveToRangeOfDocument().focus());
        }, 0);
      });
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
    const { selected, localBox } = this.props;
    const readOnly = !(selected || (localBox && localBox.isNew));
    return (
      <HotKeys handlers={this.handlers}>
        <Editor
          value={this.state.value}
          onChange={this.onChange}
          renderNode={renderNode}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          readOnly={readOnly}
          onClick={this.props.onClick}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.shiftKey && e.key === "Enter") {
              event.preventDefault();
            }
          }}
          ref={(ref: any) => (this.editor = ref)}
          className={css({
            fontSize: "13px",
            paddingTop: "1.3ch",
            paddingBottom: "1.2ch",
            fontFamily: "roboto,'Roboto Mono', monospace",
            zIndex: -1,
          })}
          renderMark={renderMark}
          decorateNode={decorateNode}
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
    });
    this.setState({ editing: false });
  };
  onFocus = () => {
    this.setState({ editing: true });
  };
}
function renderNode(p: RenderNodeProps) {
  let { node, attributes, children, isSelected } = p;
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
}
function decorateNode(node: slate.Node): slate.RangeType[] {
  let ft = node.getTexts().toArray()[0];
  if (ft.text[0] === "#" || ft.text[0] === "-" || ft.text[0] === "+")
    return [
      new slate.Decoration({
        anchor: { key: ft.key, offset: 0 },
        focus: { key: ft.key, offset: 1 },
        mark: new slate.Mark({ type: "abc" }),
      }),
    ];
  return [];
}
function renderMark({ children, attributes }: RenderMarkProps) {
  return (
    <span
      {...attributes}
      style={{
        opacity: 0.5,
        width: "1ch",
        display: "inline-block",
        transform: "scale(0.8, 0.8)",
      }}
    >
      {children}
    </span>
  );
}
