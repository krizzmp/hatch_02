import * as React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import firebase from "firebase";
import { Auth } from "./Auth";
import { Toolbar } from "./Toolbar";
import { UserMenu } from "./UserMenu";
interface $Home {
  user: firebase.User;
  signOut: () => void;
}
const Home = ({ user, signOut }: $Home) => (
  <div>
    <Toolbar
      left={<span>logo</span>}
      middle={<span>hello {user.displayName}</span>}
      right={<UserMenu user={user} signOut={signOut} />}
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
    <Auth>
      {({ loggedIn, user, signIn, signOut }) =>
        loggedIn ? (
          <Home user={user} signOut={signOut} />
        ) : (
          <SignIn signIn={signIn} />
        )
      }
    </Auth>
  </BrowserRouter>
);

export default App;
