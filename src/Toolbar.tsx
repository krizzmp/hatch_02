import * as React from "react";
import styled from "react-emotion";
const styles = {
  Toolbar: styled("div")`
    background: turquoise;
    display: flex;
    height: 64px;
  `,
  Right: styled("div")`
    display: flex;
    align-items: center;
  `,
  Left: styled("div")`
    display: flex;
    align-items: center;
    margin: 8px;
  `,
  Middle: styled("div")`
    display: flex;
    flex: 1;
    align-items: center;
    margin: 8px;
  `,
};
interface $Toolbar {
  left?: React.ReactNode;
  middle?: React.ReactNode;
  right?: React.ReactNode;
}
export const Toolbar = ({ left, middle, right }: $Toolbar) => (
  <styles.Toolbar>
    <styles.Left>{left}</styles.Left>
    <styles.Middle>{middle}</styles.Middle>
    <styles.Right>{right}</styles.Right>
  </styles.Toolbar>
);
