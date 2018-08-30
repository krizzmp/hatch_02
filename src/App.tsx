import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import firebase from "firebase";
import { Auth } from "./Auth";
import { Toolbar } from "./Toolbar";
import { UserMenu } from "./UserMenu";
import { Document } from "./Document";
import { State, Value } from "react-powerplug";
import styled from "react-emotion";
import "./globalStyles";
import { Documents } from "./Documents";
import Storybook from "./storybook";
const Input = styled("input")`
  height: 64px;
  width: 100%;
  border: none;
  color: white;
  font-size: 32px;
  padding-left: 16px;
  border-bottom: 1px solid transparent;
  outline: none;
  background: #2c4cc1;
  &:focus {
    border-bottom-color: #506fe2;
  }
`;
interface $Home {
  user: firebase.User;
  signOut: () => void;
}
const Home = ({ user, signOut }: $Home) => (
  <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
    <Toolbar
      left={<span>logo</span>}
      middle={<span>{user.displayName}</span>}
      right={<UserMenu user={user} signOut={signOut} />}
    />
    <Route exact path="/" component={() => <Documents user={user} />} />
    <Route
      path="/documents/:id"
      component={(p) => <Document id={p.match.params.id} />}
    />
  </div>
);

const SignIn = ({ signIn }: { signIn: () => void }) => (
  <div>
    you are not logged in
    <button onClick={signIn}>sign in with Google</button>
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
            {({ loggedIn, user, signIn, signOut }) =>
              loggedIn ? (
                <Home user={user} signOut={signOut} />
              ) : (
                <SignIn signIn={signIn} />
              )
            }
          </Auth>
        )}
      />
    </Switch>
  </BrowserRouter>
);

export default App;
