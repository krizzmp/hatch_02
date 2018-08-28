import * as React from "react";
import firebase from "firebase";
import { RenderProps } from "./Auth";
import { app } from "./firebase-init";
type $FbDocuments = {
  userId: string;
} & RenderProps<{
  documentsObj: {
    [id: string]: {
      name: string;
    };
  };
  documents: {
    key: string;
    value: {
      name: string;
    };
  }[];
}>;
export class FbDocuments extends React.Component<$FbDocuments> {
  state = { documents: {} };
  t: firebase.database.Reference;
  componentWillMount = () => {
    this.t = app.database().ref(`users/${this.props.userId}/documents`);
    this.t.on("value", (snap) => {
      this.setState({ documents: snap.val() });
    });
  };
  componentWillUnmount = () => {
    this.t.off();
  };
  render() {
    return this.props.children({
      documentsObj: this.state.documents,
      documents: Object.keys(this.state.documents).map((k) => ({
        key: k,
        value: this.state.documents[k],
      })),
    });
  }
}
