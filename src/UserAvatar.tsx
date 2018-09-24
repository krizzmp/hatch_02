import * as React from "react";
import { Avatar, Menu, MenuItem } from "@material-ui/core";
import { Value } from "react-powerplug";
import PersonIcon from "@material-ui/icons/Person";
export const UserAvatar = ({ user, signOut }) => (
  <Value initial={null}>
    {({ value: anchorEl, set }) => (
      <div>
        {user.photoURL ? (
          <Avatar
            src={user.photoURL}
            onClick={(e) => set(e.currentTarget)}
            aria-owns={open ? "user-menu" : null}
            aria-haspopup="true"
          />
        ) : (
          <Avatar
            onClick={(e) => set(e.currentTarget)}
            aria-owns={open ? "user-menu" : null}
            aria-haspopup="true"
          >
            <PersonIcon />
          </Avatar>
        )}
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => set(null)}
        >
          <MenuItem
            onClick={() => {
              signOut();
              set(null);
            }}
          >
            sign out
          </MenuItem>
        </Menu>
      </div>
    )}
  </Value>
);
