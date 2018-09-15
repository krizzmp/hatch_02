import * as React from "react";
import { ofValues } from "ix/iterable/ofvalues";
import * as Ix from "ix";
import { RenderProps } from "../Auth";
import { app } from "../firebase-init";
import * as R from "ramda";
import cuid from "cuid";
import { Document2 } from "./Document";
import { css } from "emotion";
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
type fbDocument = {
  todos: { [id: string]: TodoType };
  lines: { [id: string]: LineType };
  localBoxById: { [id: string]: { w: number; h: number; isNew: boolean } };
  selected: string;
  loading: boolean;
};
export type FbDocActions = {
  UpdateNoteSize: (p: { id: string; h: number; w: number }) => void;
  CreateNote: (p: { id: string; x: number; y: number }) => void;
  SelectNote: (p: { id: string }) => void;
  MoveDelta: (p: { id: string; dx: number; dy: number }) => void;
  ConnectNote: (p: { b1: string; b2: string }) => void;
  DisconnectLine: (p: { lineId: string; noteId: string }) => void;
  MoveNote: (
    p: { id: string; x: number; y: number; dx: number; dy: number },
  ) => void;
  UpdateNoteText: (p: { id: string; name: string; projectId: string }) => void;
  RemoveNote: (p: { id: string; projectId: string }) => void;
};
type $FbDocuments = { docId: string } & RenderProps<fbDocument & FbDocActions>;
class FbDocument extends React.Component<$FbDocuments, fbDocument> {
  state = {
    lines: null,
    todos: null,
    localBoxById: {},
    selected: "",
    loading: true,
  };
  docRef: firebase.database.Reference;
  componentWillMount = () => {
    this.docRef = app.database().ref(`documents/${this.props.docId}`);
    this.docRef.on("value", (snap) => {
      this.setState({
        lines: snap.val().lines,
        todos: snap.val().todos,
        loading: false,
      });
    });
  };
  componentWillUnmount = () => {
    this.docRef.off();
  };
  UpdateNoteSize = ({ id, h, w }) => {
    this.setState((s) => ({
      ...s,
      localBoxById: { ...s.localBoxById, [id]: { h, w } },
    }));
  };
  CreateNote = ({ id, x, y }) => {
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
    this.docRef.child(`todos/${id}`).set({
      id,
      name: "new note",
      x,
      y,
      dx: 0,
      dy: 0,
    });
  };
  MoveDelta = ({ id, dx, dy }) => {
    this.docRef.child(`todos/${id}`).update({
      dx,
      dy,
    });
  };
  MoveNote = ({ id, x, y, dx, dy }) => {
    this.docRef.child(`todos/${id}`).update({
      x: x + dx,
      y: y + dy,
      dx: 0,
      dy: 0,
    });
  };
  ConnectNote = ({ b1, b2 }) => {
    let newLine = { id: cuid(), b1, b2 };
    this.docRef.child(`lines/${newLine.id}`).set(newLine);
    this.docRef.child(`todos/${b2}`).update({ dx: 0, dy: 0 });
  };
  DisconnectLine = ({ lineId, noteId }) => {
    this.docRef.child(`lines/${lineId}`).remove();
    this.docRef.child(`todos/${noteId}`).update({ dx: 0, dy: 0 });
  };
  RemoveNote = ({ id: noteId }) => {
    let lines: { [id: string]: LineType } = this.state.lines;
    Ix.Iterable.from(ofValues(lines || {}))
      .filter((line) => line.b1 === noteId || line.b2 === noteId)
      .forEach((line) => {
        this.docRef.child(`lines/${line.id}`).remove();
      });
    this.docRef.child(`todos/${noteId}`).remove();
  };
  UpdateNoteText = ({ name, id }) => {
    this.docRef.child(`todos/${id}`).update({ name });
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
      lines: this.state.lines,
      todos: this.state.todos,
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
      loading: this.state.loading,
    });
  }
}
export const Document = (p: { id: string }) => (
  <FbDocument docId={p.id}>
    {({ lines, todos, localBoxById, selected, loading, ...actions }) =>
      !loading ? (
        <Document2
          selected={selected}
          localBoxById={localBoxById}
          actions={actions}
          linesRaw={lines || {}}
          todosRaw={todos || {}}
        />
      ) : (
        <div className={css({ background: "#eeeeee", flex: 1 })}>loading</div>
      )
    }
  </FbDocument>
);
