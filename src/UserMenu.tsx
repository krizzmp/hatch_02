import * as React from "react";
import { Toggle } from "react-powerplug";
import styled from "react-emotion";
const styles = {
  PopOver: styled("div")`
    position: absolute;
    top: 64px;
    right: 0;
    background: #a6a6a6;
    padding: 16px;
    z-index: 10;
    margin: 4px;
    border-radius: 4px;
  `,
  img: styled("img")`
    border-radius: 48px;
    height: 48px;
    width: 48px;
    margin: 8px;
  `,
  signOut: styled("button")`
    height: 32px;
    width: 128px;
  `,
};
export const UserMenu = ({ user, signOut }) => {
  return (
    <Toggle initial={false}>
      {({ on, toggle }) => (
        <React.Fragment>
          <styles.img onClick={toggle} src={user.photoURL} />
          {on ? (
            <styles.PopOver>
              <styles.signOut onClick={signOut}>sign out</styles.signOut>
            </styles.PopOver>
          ) : null}
        </React.Fragment>
      )}
    </Toggle>
  );
};
