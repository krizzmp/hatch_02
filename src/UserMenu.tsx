import * as React from "react";
import { Toggle } from "react-powerplug";
import styled from "react-emotion";
const styles = {
  PopOver: styled("div")`
    position: absolute;
    top: 64px;
    right: 0;
    background: #c0ffee;
    padding: 8px;
  `,
  img: styled("img")`
    border-radius: 48px;
    height: 48px;
    width: 48px;
    margin: 8px;
  `,
};
export const UserMenu = ({ user, signOut }) => {
  return (
    <Toggle initial={true}>
      {({ on, toggle }) => (
        <React.Fragment>
          <styles.img onClick={toggle} src={user.photoURL} />
          {on ? (
            <styles.PopOver>
              <button onClick={signOut}>sign out</button>
            </styles.PopOver>
          ) : null}
        </React.Fragment>
      )}
    </Toggle>
  );
};
