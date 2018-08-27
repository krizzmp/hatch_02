import * as React from "react";
import styled from "react-emotion";
import { ofValues } from "ix/iterable/ofvalues";
import { LineType, TodoType } from "./Document";
import * as Ix from "ix";
import { colors } from "./colors";

export function getConnectedLine(
  lines: {
    [id: string]: LineType;
  },
  b1: string,
  b2: string,
) {
  let isConnected = (line: LineType) =>
    (line.b1 === b1 && line.b2 === b2) || (line.b1 === b2 && line.b2 === b1);
  let g = Ix.Iterable.from(ofValues(lines))
    .filter(isConnected)
    .first();
  return g;
}
interface $Line {
  b1: TodoType;
  b2: TodoType;
  id: string;
  linesRaw: {
    [id: string]: LineType;
  };
  todosRaw: {
    [id: string]: TodoType;
  };
  localBox1: {
    w: number;
    h: number;
  };
  localBox2: {
    w: number;
    h: number;
  };
}
class Vector2d {
  y: number;
  x: number;
  constructor(a: point, b: point) {
    this.x = b.x - a.x;
    this.y = b.y - a.y;
  }
  magnitude() {
    // noinspection JSSuspiciousNameCombination
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  angle() {
    return (Math.atan2(this.y, this.x) * 180) / Math.PI;
  }
}
type point = {
  x: number;
  y: number;
};
const vec = (pos1: point, pos2: point): Vector2d => {
  return new Vector2d(pos1, pos2);
};
let centerPos = (
  b: TodoType,
  lb: {
    w: number;
    h: number;
  },
) => ({
  ...b,
  x: b.x + b.dx + (lb.w ? lb.w / 2 : 0),
  y: b.y + b.dy + (lb.h ? lb.h / 2 : 0),
  ...lb,
});
function srty<
  T extends {
    y: number;
  }
>(a: T, b: T): [T, T] {
  if (a.y < b.y) {
    return [b, a];
  } else {
    return [a, b];
  }
}
function srtx<
  T extends {
    x: number;
  }
>(a: T, b: T): [T, T] {
  if (a.x < b.x) {
    return [b, a];
  } else {
    return [a, b];
  }
}
function notNull<T>(cat: T): cat is Exclude<typeof cat, undefined | null> {
  return cat !== null && cat !== undefined;
}
// const Line = (p: $Line) => <div />;
export class Line extends React.Component<$Line> {
  private gap = 8;
  private getBoxes = () => {
    let b1 = centerPos(this.props.b1, this.props.localBox1);
    let b2 = centerPos(this.props.b2, this.props.localBox2);
    let b1i = this.getConnectedBoxes(b1, b2);
    let b2i = this.getConnectedBoxes(b2, b1);
    let n1 = { i: b1i, ...b1 };
    let n2 = { i: b2i, ...b2 };
    let [r, l] = srtx(n1, n2);
    let [b, t] = srty(n1, n2);
    let left = {
      x: l.x + l.i * this.gap,
      y: t.y + t.h / 2,
    };
    let right = {
      x: r.x + r.i * this.gap,
      y: b.y - b.h / 2,
    };
    let bottom = {
      x: b.x + b.i * this.gap,
      y: b.y - b.h / 2,
    };
    let top = {
      x: t.x + t.i * this.gap,
      y: t.y + t.h / 2,
    };
    return { left, right, bottom, top };
  };
  private getConnectedBoxes = (box: TodoType, otherBox: TodoType) => {
    let el = Ix.Iterable.from(ofValues(this.props.linesRaw))
      .map((l) => (l.b1 === box.id ? l.b2 : l.b2 === box.id ? l.b1 : null))
      .filter(notNull)
      .map((id) => this.props.todosRaw[id])
      .partition((b) => b.y < box.y)
      .map((o) =>
        o
          .map((p) => {
            let ang = vec(p, box).angle();
            return {
              angle: ang > 0 ? ang : ang * -1,
              box: p,
            };
          })
          .orderBy((a) => a.angle)
          .map((x, i) => ({
            index: i,
            el: x.box,
            count: o.count(),
          }))
          .find((x) => x.el.id === otherBox.id),
      )
      .filter(notNull)[0];
    return el.index - (el.count - 1) / 2;
  };
  render() {
    return (
      <React.Fragment>
        <this.UpperLine />
        <this.LowerLine />
        <this.MiddleLine />
      </React.Fragment>
    );
  }
  UpperLine = styled("div")(() => {
    let { top, bottom } = this.getBoxes();
    return {
      borderLeft: "1px dashed " + colors.noteBorder,
      height: (bottom.y - top.y) / 2,
      left: top.x,
      top: top.y,
      position: "absolute",
      display: "inline-block",
      width: 1,
    };
  });
  MiddleLine = styled("div")(() => {
    let { left, right, top, bottom } = this.getBoxes();
    return {
      borderTop: "1px dashed " + colors.noteBorder,
      height: 1,
      left: left.x,
      top: top.y + (bottom.y - top.y) / 2,
      position: "absolute",
      display: "inline-block",
      width: right.x - left.x,
    };
  });
  LowerLine = styled("div")(() => {
    let { top, bottom } = this.getBoxes();
    return {
      borderLeft: "1px dashed " + colors.noteBorder,
      height: (bottom.y - top.y) / 2,
      left: bottom.x,
      top: top.y + (bottom.y - top.y) / 2,
      position: "absolute",
      display: "inline-block",
      width: 1,
    };
  });
}
