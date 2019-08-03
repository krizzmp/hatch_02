import * as React from "react";
import { css } from "react-emotion";
import { ofValues } from "ix/iterable/ofvalues";
import { Line, getConnectedLine } from "./Line";
import { Note } from "./Note";
import { HotKeys } from "react-hotkeys";
import cuid = require('cuid');
import { TodoType, LineType, FbDocActions } from "./FbDocument";
import styled from "react-emotion";
import Ix from "ix";
import * as R from "ramda";

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
  `
};
interface $Document {
  linesRaw: { [id: string]: LineType };
  todosRaw: { [id: string]: TodoType };
  selected: string;
  actions: FbDocActions;
  localBoxById: { [id: string]: { h: number; w: number; isNew: boolean } };
}

type $state = {
  draggingInitPos: { x: number; y: number } | undefined;
  dragging: TodoType | undefined;
  dx: number;
  dy: number;
};

export class Document2 extends React.Component<$Document, $state> {
  state: $state = {
    dx: 0,
    dy: 0,
    dragging: undefined,
    draggingInitPos: undefined
  };
  $center?: HTMLDivElement;
  Lines = () => {
    return Ix.Iterable.from(ofValues(this.props.linesRaw)).map(line => (
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
    return Ix.Iterable.from(ofValues(this.props.todosRaw)).map(todo => (
      <Note
        key={todo.id}
        todo={todo}
        onDragStart={this.dragStart}
        dragging={!!this.state.dragging && todo.id === this.state.dragging.id}
        selected={this.props.selected === todo.id}
        select={this.select}
        localBox={{ ...this.props.localBoxById[todo.id] }}
        actions={{
          UpdateNoteSize: this.props.actions.UpdateNoteSize,
          CreateNote: this.props.actions.CreateNote,
          RemoveNote: this.props.actions.RemoveNote,
          UpdateNoteText: this.props.actions.UpdateNoteText
        }}
      />
    ));
  };
  dragStart = (e: React.DragEvent<HTMLDivElement>, todo: TodoType) => {
    this.setState({
      dragging: todo,
      draggingInitPos: { x: e.clientX, y: e.clientY }
    });
  };
  onDragEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!this.state.dragging) {
      return;
    }
    let todo = this.props.todosRaw[this.state.dragging.id];
    let el = document.querySelector("[data-box-id]:hover");
    if (el) {
      let b1 = el.getAttribute("data-box-id")!;
      let b2 = todo.id;
      let connectedLine = getConnectedLine(this.props.linesRaw, b1, b2);
      if (connectedLine) {
        this.props.actions.DisconnectLine({
          lineId: connectedLine.id,
          noteId: b2
        });
      } else {
        this.props.actions.ConnectNote({ b1, b2 });
      }
    } else {
      const { id, x, y, dx, dy } = todo;
      this.props.actions.MoveNote({ id, x, y, dx, dy });
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
    this.props.actions.CreateNote({ id: cuid(), x, y });
  };
  onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!!this.state.dragging && !!this.state.draggingInitPos) {
      const id = this.state.dragging.id;
      const dx = e.clientX - this.state.draggingInitPos.x;
      const dy = e.clientY - this.state.draggingInitPos.y;
      this.props.actions.MoveDelta({ id, dx, dy });
    }
  };
  pan = (e: React.WheelEvent<HTMLDivElement>) => {
    this.setState(
      {
        dy: this.state.dy + e.deltaY * -1,
        dx: this.state.dx + e.deltaX * -1
      },
      () => {
        this.$center.style.transform = `translate(${this.state.dx}px, ${
          this.state.dy
        }px) scale(1, 1)`;
      }
    );
  };
  shouldComponentUpdate(
    nextProps: Readonly<$Document>,
    nextState: Readonly<$state>,
    nextContext: any
  ): boolean {
    if (nextProps != this.props) {
      return true;
    }
    if (
      this.state.dragging != nextState.dragging ||
      this.state.draggingInitPos != nextState.draggingInitPos
    ) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <HotKeys
        keyMap={{
          remove: ["del", "command+backspace"],
          shiftie: "shift+return"
        }}
        className={css({ flex: 1, display: "flex" })}
      >
        <styles.Canvas
          onWheel={this.pan}
          onMouseMove={this.onMouseMove}
          onDoubleClick={this.createTodo}
          onClick={() => this.select("")}
          onMouseUp={this.onDragEnd}
        >
          {R.isEmpty(this.props.todosRaw) ? (
            <div
              className={css({
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                position: "absolute",
                userSelect: "none",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              })}
            >
              <div
                className={css({
                  userSelect: "none",
                  fontSize: "10px",
                  color: "#000000DF",
                  fontFamily: "roboto"
                })}
              >
                Double click on this canvas to create a note.
                <br /> Drag one note on top of another to create a link between
                them.
              </div>
            </div>
          ) : null}
          <styles.Center innerRef={ref => (this.$center = ref)}>
            {this.Lines()}
            {this.Notes()}
          </styles.Center>
        </styles.Canvas>
      </HotKeys>
    );
  }
}
