import * as React from "react";
import { Toggle } from "react-powerplug";
import styled from "react-emotion";
const styles = {
  PopOver: styled("div")`
    position: absolute;
    top: 64px;
  `,
};
export const UserMenu = ({ user, signOut }) => {
  return (
    <Toggle initial={true}>
      {({ on, toggle }) => (
        <React.Fragment>
          <img
            onClick={toggle}
            height={48}
            width={48}
            style={{ borderRadius: 48 }}
            src={user.photoURL}
          />
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
