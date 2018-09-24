import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Auth } from "./Auth";
import { Document } from "./Document/FbDocument";
import { css } from "react-emotion";
import "./globalStyles";
import { Documents } from "./Documents/Documents";
import Storybook from "./storybook";
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { SignIn } from "./SignIn";
import { UserAvatar } from "./UserAvatar";
interface $Home {
  user: firebase.User;
  signOut: () => void;
}
const Home = ({ user, signOut }: $Home) => (
  <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
    <Route
      render={() => {
        return (
          <AppBar position="static">
            <Toolbar>
              <IconButton
                style={{
                  marginLeft: -20,
                  marginRight: 20,
                }}
                color="inherit"
                aria-label="Menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="title"
                color="inherit"
                className={css({ flexGrow: 1 })}
              >
                Hatch
              </Typography>
              <UserAvatar user={user} signOut={signOut} />
            </Toolbar>
          </AppBar>
        );
      }}
    />
    <Documents user={user} />
    <Route
      path="/documents/:id"
      component={(p) => <Document id={p.match.params.id} />}
    />
  </div>
);
const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/storybook" component={Storybook} />
      <Route
        path="/"
        component={() => (
          <Auth>
            {({ loggedIn, user, signOut }) =>
              loggedIn ? <Home user={user} signOut={signOut} /> : <SignIn />
            }
          </Auth>
        )}
      />
    </Switch>
  </BrowserRouter>
);
export default App;
