import firebase from "firebase/app";
import { app } from "./firebase-init";
import React from "react";
var provider = new firebase.auth.GoogleAuthProvider();
export interface RenderProps<T> {
  children: ((props: T) => React.ReactNode);
}
type $Auth = RenderProps<{
  loggedIn: boolean;
  user?: firebase.User;
  signIn: () => void;
  signOut: () => void;
}>;
export class Auth extends React.Component<
  $Auth,
  {
    user: firebase.User;
    loggedIn: boolean;
  }
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
