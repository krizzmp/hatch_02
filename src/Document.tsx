import * as React from "react";
import styled from "react-emotion";
import { ofValues } from "ix/iterable/ofvalues";
import * as Ix from "ix";
import { Line, getConnectedLine } from "./Line";
import { Note } from "./Note";
import { RenderProps } from "./Auth";
import { app } from "./firebase-init";
let cuid = require("cuid");
const styles = {
  Canvas: styled("div")`
    overflow: hidden;
    padding: 1px;
    position: relative;
    flex: 1;
    background-color: #eeeeee;
  `,
  Center: styled("div")`
    left: 50%;
    top: 50%;
    position: relative;
    transform: ${({ dx, dy }: { dx: number; dy: number }) =>
      `translate(${dx}px, ${dy}px) scale(1, 1)`};
  `,
};

export interface TodoType {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  name: string;
}
export interface LineType {
  id: string;
  b1: string;
  b2: string;
}

interface $Document {
  id: string;
  linesRaw: { [id: string]: LineType };
  todosRaw: { [id: string]: TodoType };
  selected: string;
  actions: {
    DisconnectLine: (
      p: {
        lineId: string;
        noteId: string;
        projectId: string;
      },
    ) => void;
    ConnectNote: (
      p: {
        b1: string;
        b2: string;
        projectId: string;
      },
    ) => void;
    MoveNote: (
      p: {
        id: string;
        x: number;
        y: number;
        dx: number;
        dy: number;
        projectId: string;
      },
    ) => void;
    SelectNote: (p: { id: string }) => void;
    CreateNote: (
      p: { id: string; x: number; y: number; projectId: string },
    ) => void;
    MoveDelta: (
      p: { id: string; dx: number; dy: number; projectId: string },
    ) => void;
  };
}
export class Document2 extends React.Component<$Document> {
  state = {
    dx: 0,
    dy: 0,
    dragging: undefined as TodoType | undefined,
    draggingInitPos: undefined as { x: number; y: number } | undefined,
  };
  $center?: Element;
  Lines = () => {
    return Ix.Iterable.from(ofValues(this.props.linesRaw)).map((line) => (
      <Line
        key={line.id}
        id={line.id}
        b1={this.props.todosRaw[line.b1]}
        b2={this.props.todosRaw[line.b2]}
        linesRaw={this.props.linesRaw}
        todosRaw={this.props.todosRaw}
        localBox1={{ h: 30, w: 150 }}
        localBox2={{ h: 30, w: 150 }}
      />
    ));
  };
  Notes = () => {
    return Ix.Iterable.from(ofValues(this.props.todosRaw)).map((todo) => (
      <Note
        key={todo.id}
        todo={todo}
        onDragStart={this.dragStart}
        dragging={!!this.state.dragging && todo.id === this.state.dragging.id}
        selected={this.props.selected === todo.id}
        select={this.select}
        projectId={this.props.id}
        localBox={{ h: 30, w: 128, isNew: false }}
        actions={{
          UpdateNoteSize: () => {},
          CreateNote: () => {},
          RemoveNote: () => {},
          UpdateNoteText: () => {},
        }}
      />
    ));
  };

  dragStart = (e: React.DragEvent<HTMLDivElement>, todo: TodoType) => {
    this.setState({
      dragging: todo,
      draggingInitPos: { x: e.clientX, y: e.clientY },
    });
  };

  onDragEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!this.state.dragging) {
      return;
    }
    let projectId = this.props.id;
    let todo: TodoType = this.props.todosRaw[this.state.dragging.id];
    let el = document.querySelector("[data-box-id]:hover");
    if (el) {
      let b1 = el.getAttribute("data-box-id")!;
      let b2 = todo.id;

      let connectedLine = getConnectedLine(this.props.linesRaw, b1, b2);
      if (connectedLine) {
        this.props.actions.DisconnectLine({
          lineId: connectedLine.id,
          noteId: b2,
          projectId,
        });
      } else {
        this.props.actions.ConnectNote({ b1, b2, projectId });
      }
    } else {
      const { id, x, y, dx, dy } = todo;
      this.props.actions.MoveNote({ id, x, y, dx, dy, projectId });
    }
    this.setState({ dragging: undefined, draggingInitPos: undefined });
  };

  select = (id: string) => {
    this.props.actions.SelectNote({ id });
  };
  createTodo = (e: React.MouseEvent<HTMLDivElement>) => {
    let bcr = this.$center.getBoundingClientRect();
    const x = e.clientX - bcr.left;
    const y = e.clientY - bcr.top;
    let projectId = this.props.id;

    this.props.actions.CreateNote({ id: cuid(), x, y, projectId });
  };
  onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!!this.state.dragging && !!this.state.draggingInitPos) {
      const id = this.state.dragging.id;
      const dx = e.clientX - this.state.draggingInitPos.x;
      const dy = e.clientY - this.state.draggingInitPos.y;
      let projectId = this.props.id;
      this.props.actions.MoveDelta({ id, dx, dy, projectId });
    }
  };
  pan = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.ctrlKey) {
      e.stopPropagation();
    }
    this.setState({
      dy: this.state.dy + e.deltaY * -1,
      dx: this.state.dx + e.deltaX * -1,
    });
  };
  render() {
    return (
      <styles.Canvas
        onWheel={this.pan}
        onMouseMove={this.onMouseMove}
        onDoubleClick={this.createTodo}
        onClick={() => this.select("")}
        onMouseUp={this.onDragEnd}
      >
        <styles.Center
          innerRef={(ref) => (this.$center = ref)}
          dy={this.state.dy}
          dx={this.state.dx}
        >
          {this.Lines()}
          {this.Notes()}
        </styles.Center>
      </styles.Canvas>
    );
  }
}
type fbDocument = {
  todos: { [id: string]: TodoType };
  lines: { [id: string]: LineType };
};
type fbState = {
  document: fbDocument;
};
type $FbDocuments = { docId: string } & RenderProps<fbDocument>;
class FbDocuments extends React.Component<$FbDocuments> {
  state: fbState = {
    document: {
      lines: null,
      todos: null,
    },
  };
  t: firebase.database.Reference;
  componentWillMount = () => {
    this.t = app.database().ref(`${this.props.docId}`);
    this.t.on("value", (snap) => {
      this.setState({ document: snap.val() });
    });
  };

  componentWillUnmount = () => {
    this.t.off();
  };

  render() {
    return this.props.children(this.state.document);
  }
}
export const Document = (p) => (
  <FbDocuments docId={p.id}>
    {({ lines, todos }) =>
      !!lines && !!todos ? (
        <Document2 {...p} linesRaw={lines} todosRaw={todos} />
      ) : null
    }
  </FbDocuments>
);
