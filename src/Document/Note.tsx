import * as R from "ramda";
import * as React from "react";
import { TodoType } from "./FbDocument";
import { TodoStyle } from "./TodoStyles";
import cuid from "cuid";
import { MyEditor } from "./MyEditor";
type LocalNote = {
  w: number;
  h: number;
  isNew: boolean;
};
type TodoProps = {
  todo: TodoType;
  onDragStart: (e: any, todo: TodoType) => void;
  dragging: boolean;
  select: (id: string) => void;
  selected: boolean;
};
export type BoxProps = {
  localBox?: LocalNote;
  actions: {
    UpdateNoteText: (
      p: {
        id: string;
        name: string;
      },
    ) => void;
    RemoveNote: (
      p: {
        id: string;
      },
    ) => void;
    CreateNote: (
      p: {
        id: string;
        x: number;
        y: number;
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
};
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
        />
      </TodoStyle>
    );
  }
  createNoteBeneath = () => {
    let margin = 8;
    this.props.actions.CreateNote({
      id: cuid(),
      x: this.props.todo.x,
      y: this.props.todo.y + this.props.localBox!.h + margin,
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
