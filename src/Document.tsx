import * as React from "react";
import styled, { css } from "react-emotion";
import { ofValues } from "ix/iterable/ofvalues";
import * as Ix from "ix";
import { Line, getConnectedLine } from "./Line";
import { Note } from "./Note";
import { RenderProps } from "./Auth";
import { app } from "./firebase-init";
import * as R from "ramda";
import { HotKeys } from "react-hotkeys";
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
    UpdateNoteSize: (
      p: {
        id: string;
        h: number;
        w: number;
      },
    ) => void;
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
  };
  localBoxById: { [id: string]: { h: number; w: number; isNew: boolean } };
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
        localBox1={this.props.localBoxById[line.b1] || { h: 0, w: 0 }}
        localBox2={this.props.localBoxById[line.b2] || { h: 0, w: 0 }}
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
        localBox={{ ...this.props.localBoxById[todo.id] }}
        actions={{
          UpdateNoteSize: this.props.actions.UpdateNoteSize,
          CreateNote: this.props.actions.CreateNote,
          RemoveNote: this.props.actions.RemoveNote,
          UpdateNoteText: this.props.actions.UpdateNoteText,
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
      <HotKeys
        keyMap={{ remove: "del", shiftie: "shift+return" }}
        {...{
          className: css({ flex: 1, display: "flex" }),
        } as any}
      >
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
      </HotKeys>
    );
  }
}
type fbDocument = {
  todos: { [id: string]: TodoType };
  lines: { [id: string]: LineType };
};
type fbState = {
  document: fbDocument;
  localBoxById: { [id: string]: { w: number; h: number; isNew: boolean } };
  selected: string;
};
type $FbDocuments = { docId: string } & RenderProps<
  fbDocument & {
    localBoxById: { [id: string]: { w: number; h: number; isNew: boolean } };
    selected: string;
    UpdateNoteSize: (p: { id: string; h: number; w: number }) => void;
    CreateNote: (p: { id: string; x: number; y: number }) => void;
    SelectNote: (p: { id: string }) => void;
    MoveDelta: (p: { id: string; dx: number; dy: number }) => void;
    ConnectNote: (p: { b1: string; b2: string }) => void;
    DisconnectLine: (p: { lineId: string; noteId: string }) => void;
    MoveNote: (
      p: { id: string; x: number; y: number; dx: number; dy: number },
    ) => void;
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
  }
>;
class FbDocuments extends React.Component<$FbDocuments, fbState> {
  state = {
    document: {
      lines: null,
      todos: null,
    },
    localBoxById: {},
    selected: "",
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
  UpdateNoteSize = ({ id, h, w }) => {
    this.setState((s) => ({
      ...s,
      localBoxById: { ...s.localBoxById, [id]: { h, w } },
    }));
  };
  CreateNote: (p: { id: string; x: number; y: number }) => void = ({
    id,
    x,
    y,
  }) => {
    this.setState((s) =>
      R.mergeDeepRight(s, {
        selected: id,
        localBoxById: {
          [id]: {
            isNew: true,
          },
        },
      }),
    );
    app
      .database()
      .ref(`${this.props.docId}/todos/${id}`)
      .set({
        id,
        name: "new note",
        x,
        y,
        dx: 0,
        dy: 0,
      });
  };
  MoveDelta = ({ id, dx, dy }) => {
    app
      .database()
      .ref(`${this.props.docId}/todos/${id}`)
      .update({
        dx,
        dy,
      });
  };
  MoveNote = ({ id, x, y, dx, dy }) => {
    app
      .database()
      .ref(`${this.props.docId}/todos/${id}`)
      .update({
        x: x + dx,
        y: y + dy,
        dx: 0,
        dy: 0,
      });
  };
  ConnectNote = ({ b1, b2 }) => {
    let newLine = { id: cuid(), b1, b2 };
    app
      .database()
      .ref(`${this.props.docId}/lines/${newLine.id}`)
      .set(newLine);
    app
      .database()
      .ref(`${this.props.docId}/todos/${b2}`)
      .update({ dx: 0, dy: 0 });
  };
  DisconnectLine = ({ lineId, noteId }) => {
    app
      .database()
      .ref(`${this.props.docId}/lines/${lineId}`)
      .remove();
    app
      .database()
      .ref(`${this.props.docId}/todos/${noteId}`)
      .update({ dx: 0, dy: 0 });
  };
  RemoveNote = ({ id: noteId }) => {
    let lines: { [id: string]: LineType } = this.state.document.lines;
    Ix.Iterable.from(ofValues(lines))
      .filter((line) => line.b1 === noteId || line.b2 === noteId)
      .forEach((line) => {
        app
          .database()
          .ref(`${this.props.docId}/lines/${line.id}`)
          .remove();
      });
    app
      .database()
      .ref(`${this.props.docId}/todos/${noteId}`)
      .remove();
  };
  UpdateNoteText = ({ name, id }) => {
    app
      .database()
      .ref(`${this.props.docId}/todos/${id}`)
      .update({ name });
    this.setState((s) =>
      R.mergeDeepRight(s, {
        localBoxById: {
          [id]: {
            isNew: false,
          },
        },
      }),
    );
  };
  SelectNote = ({ id }) => {
    this.setState({ selected: id });
  };
  render() {
    return this.props.children({
      ...this.state.document,
      selected: this.state.selected,
      localBoxById: this.state.localBoxById,
      UpdateNoteSize: this.UpdateNoteSize,
      SelectNote: this.SelectNote,
      CreateNote: this.CreateNote,
      MoveDelta: this.MoveDelta,
      MoveNote: this.MoveNote,
      ConnectNote: this.ConnectNote,
      DisconnectLine: this.DisconnectLine,
      RemoveNote: this.RemoveNote,
      UpdateNoteText: this.UpdateNoteText,
    });
  }
}
export const Document = (p: { id: string }) => (
  <FbDocuments docId={p.id}>
    {({
      lines,
      todos,
      localBoxById,
      UpdateNoteSize,
      CreateNote,
      SelectNote,
      selected,
      MoveDelta,
      MoveNote,
      ConnectNote,
      DisconnectLine,
      RemoveNote,
      UpdateNoteText,
    }) =>
      !!lines && !!todos ? (
        <Document2
          selected={selected}
          id={p.id}
          localBoxById={localBoxById}
          actions={{
            ConnectNote,
            CreateNote,
            DisconnectLine,
            MoveDelta,
            MoveNote,
            SelectNote,
            UpdateNoteSize,
            RemoveNote,
            UpdateNoteText,
          }}
          linesRaw={lines}
          todosRaw={todos}
        />
      ) : null
    }
  </FbDocuments>
);
