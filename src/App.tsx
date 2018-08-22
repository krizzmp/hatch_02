import * as React from "react";
import "./App.css";
import { BrowserRouter, Route, Link } from "react-router-dom";
import firebase from "firebase";
import { app } from "./firebase-init";
var provider = new firebase.auth.GoogleAuthProvider();
interface RenderProps<T> {
  children: ((props: T) => React.ReactNode);
}
type $Auth = RenderProps<{ loggedIn: boolean; user?: firebase.User }>;
class Auth extends React.Component<
  $Auth,
  { user: firebase.User; loggedIn: boolean }
> {
  state = {
    user: null,
    loggedIn: false,
  };
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user, loggedIn: true });
        // ...
      } else {
        // User is signed out.
        // ...
        this.setState({ user: null, loggedIn: false });
      }
    });
  }
  signIn() {
    app
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // The signed-in user info.
        var user = result.user;
        // ...

        this.setState({ user, loggedIn: true });
      })
      .catch(function(error) {});
  }
  render() {
    return this.props.children({
      loggedIn: this.state.loggedIn,
      user: this.state.user,
    });
  }
}

const Home = ({ user }: { user: firebase.User }) => (
  <div>hello {user.displayName}</div>
);
const Dash = () => (
  <div>
    <Auth>
      {({ loggedIn, user }) =>
        loggedIn ? <Home user={user} /> : <div>not hello</div>
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
