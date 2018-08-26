import * as React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import firebase from "firebase";
import { Auth, RenderProps } from "./Auth";
import { Toolbar } from "./Toolbar";
import { UserMenu } from "./UserMenu";
import { app } from "./firebase-init";
import { injectGlobal } from "emotion";

injectGlobal`
  * {
    box-sizing: border-box;
  }
  body{
    margin: 0;
    padding: 0;
  }
`;
type $FbDocuments = { userId: string } & RenderProps<{
  documentsObj: { [id: string]: { name: string } };
  documents: { key: string; value: { name: string } }[];
}>;
class FbDocuments extends React.Component<$FbDocuments> {
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

interface $Home {
  user: firebase.User;
  signOut: () => void;
}
const Home = ({ user, signOut }: $Home) => (
  <div>
    <Toolbar
      left={<span>logo</span>}
      middle={<span>{user.displayName}</span>}
      right={<UserMenu user={user} signOut={signOut} />}
    />
    <Route
      exact
      path="/"
      component={() => (
        <FbDocuments userId={user.uid}>
          {({ documents }) =>
            documents.map(({ key, value: { name } }) => (
              <div>
                <Link to={`/documents/${key}`}>{name}</Link>
              </div>
            ))
          }
        </FbDocuments>
      )}
    />
    <Route
      path="/documents/:id"
      component={(p) => <div>{p.match.params.id}</div>}
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
