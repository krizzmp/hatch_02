import * as React from "react";
import "./App.css";
import { BrowserRouter, Route, Link } from "react-router-dom";
import firebase from "firebase";
import { app } from "./firebase-init";
var provider = new firebase.auth.GoogleAuthProvider();
interface RenderProps<T> {
  children: ((props: T) => React.ReactNode);
}
type $Auth = RenderProps<{
  loggedIn: boolean;
  user?: firebase.User;
  signIn: () => void;
  signOut: () => void;
}>;

class Auth extends React.Component<
  $Auth,
  { user: firebase.User; loggedIn: boolean }
> {
  state = {
    user: null,
    loggedIn: false,
  };
  unsub: firebase.Unsubscribe;
  componentDidMount() {
    this.unsub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user, loggedIn: true });
      } else {
        this.setState({ user: null, loggedIn: false });
      }
    });
  }
  componentWillUnmount() {
    this.unsub();
  }

  signIn() {
    app.auth().signInWithPopup(provider);
  }
  signOut() {
    app.auth().signOut();
  }
  render() {
    return this.props.children({
      loggedIn: this.state.loggedIn,
      user: this.state.user,
      signIn: this.signIn,
      signOut: this.signOut,
    });
  }
}

const Home = ({
  user,
  signOut,
}: {
  user: firebase.User;
  signOut: () => void;
}) => (
  <div>
    hello {user.displayName} <button onClick={signOut}>sign out</button>
  </div>
);

const SignIn = ({ signIn }: { signIn: () => void }) => (
  <div>
    you are not logged in
    <button onClick={signIn}>sign in with Google</button>
  </div>
);
const Dash = () => (
  <div>
    <Auth>
      {({ loggedIn, user, signIn, signOut }) =>
        loggedIn ? (
          <Home user={user} signOut={signOut} />
        ) : (
          <SignIn signIn={signIn} />
        )
      }
    </Auth>
  </div>
);
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/" component={Dash} />
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
