import styled from "react-emotion";
import { colors } from "../colors";
import tinycolor from "tinycolor2";
const umbraMap = {
  "0": "0px 0px 0px 0px",
  "1": "0px 2px 1px -1px",
  "2": "0px 3px 1px -2px",
  "3": "0px 3px 3px -2px",
  "4": "0px 2px 4px -1px",
  "5": "0px 3px 5px -1px",
  "6": "0px 3px 5px -1px",
  "7": "0px 4px 5px -2px",
  "8": "0px 5px 5px -3px",
  "9": "0px 5px 6px -3px",
  "10": "0px 6px 6px -3px",
  "11": "0px 6px 7px -4px",
  "12": "0px 7px 8px -4px",
  "13": "0px 7px 8px -4px",
  "14": "0px 7px 9px -4px",
  "15": "0px 8px 9px -5px",
  "16": "0px 8px 10px -5px",
  "17": "0px 8px 11px -5px",
  "18": "0px 9px 11px -5px",
  "19": "0px 9px 12px -6px",
  "20": "0px 10px 13px -6px",
  "21": "0px 10px 13px -6px",
  "22": "0px 10px 14px -6px",
  "23": "0px 11px 14px -7px",
  "24": "0px 11px 15px -7px",
};
const penumbraMap = {
  "0": "0px 0px 0px 0px",
  "1": "0px 1px 1px 0px",
  "2": "0px 2px 2px 0px",
  "3": "0px 3px 4px 0px",
  "4": "0px 4px 5px 0px",
  "5": "0px 5px 8px 0px",
  "6": "0px 6px 10px 0px",
  "7": "0px 7px 10px 1px",
  "8": "0px 8px 10px 1px",
  "9": "0px 9px 12px 1px",
  "10": "0px 10px 14px 1px",
  "11": "0px 11px 15px 1px",
  "12": "0px 12px 17px 2px",
  "13": "0px 13px 19px 2px",
  "14": "0px 14px 21px 2px",
  "15": "0px 15px 22px 2px",
  "16": "0px 16px 24px 2px",
  "17": "0px 17px 26px 2px",
  "18": "0px 18px 28px 2px",
  "19": "0px 19px 29px 2px",
  "20": "0px 20px 31px 3px",
  "21": "0px 21px 33px 3px",
  "22": "0px 22px 35px 3px",
  "23": "0px 23px 36px 3px",
  "24": "0px 24px 38px 3px",
};
const ambientMap = {
  "0": "0px 0px 0px 0px",
  "1": "0px 1px 3px 0px",
  "2": "0px 1px 5px 0px",
  "3": "0px 1px 8px 0px",
  "4": "0px 1px 10px 0px",
  "5": "0px 1px 14px 0px",
  "6": "0px 1px 18px 0px",
  "7": "0px 2px 16px 1px",
  "8": "0px 3px 14px 2px",
  "9": "0px 3px 16px 2px",
  "10": "0px 4px 18px 3px",
  "11": "0px 4px 20px 3px",
  "12": "0px 5px 22px 4px",
  "13": "0px 5px 24px 4px",
  "14": "0px 5px 26px 4px",
  "15": "0px 6px 28px 5px",
  "16": "0px 6px 30px 5px",
  "17": "0px 6px 32px 5px",
  "18": "0px 7px 34px 6px",
  "19": "0px 7px 36px 6px",
  "20": "0px 8px 38px 7px",
  "21": "0px 8px 40px 7px",
  "22": "0px 8px 42px 7px",
  "23": "0px 9px 44px 8px",
  "24": "0px 9px 46px 8px",
};
const umbraOpacity = 0.2;
const penumbraOpacity = 0.14;
const ambientOpacity = 0.12;
export default function elevate(
  zValue: number,
  color: string = "black",
  opacityBoost: number = 0,
) {
  const umbraZValue = umbraMap[zValue];
  const penumbraZValue = penumbraMap[zValue];
  const ambientZValue = ambientMap[zValue];
  const shadowColor = tinycolor(color);
  const umbraColor = shadowColor
    .setAlpha(umbraOpacity + opacityBoost)
    .toRgbString();
  const penumbraColor = shadowColor
    .setAlpha(penumbraOpacity + opacityBoost)
    .toRgbString();
  const ambientColor = shadowColor
    .setAlpha(ambientOpacity + opacityBoost)
    .toRgbString();
  return `${umbraZValue} ${umbraColor}, ${penumbraZValue} ${penumbraColor}, ${ambientZValue} ${ambientColor}`;
}
export const TodoStyle = styled("div")(
  {
    position: "absolute",
    display: "inline-block",
    background: colors.noteBg,
    padding: 0,
    borderRadius: 4,
    // paddingTop: 8,
    // paddingBottom: 8,
    userSelect: "none",
    color: colors.noteText,
    fontSize: "16px",
    fontFamily: "Roboto",
    fontWeight: 300,
  },
  ({ x, y, dx, dy, dragging, selected }: any) => ({
    border: selected ? "1px solid blue" : "1px solid " + colors.noteBorder,
    left: x + dx,
    top: y + dy,
    pointerEvents: dragging ? "none" : "auto",
    boxShadow: dragging ? elevate(4) : "none",
  }),
);
