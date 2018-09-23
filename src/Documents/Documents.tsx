import * as React from "react";
import { Route } from "react-router-dom";
import { FbDocuments } from "./FbDocuments";
import styled from "react-emotion";
import { Files } from "./Files";
import { SideBar } from "./SideBar";
export interface DocumentProps {
  user: firebase.User;
}
export class Documents extends React.Component<DocumentProps, any> {
  public render() {
    return (
      <FbDocuments userId={this.props.user.uid}>
        {({ documents, createDoc }) => (
          <Route
            exact
            path="/"
            component={() => (
              <this.Page>
                <SideBar createDoc={createDoc} />
                <Files documents={documents} />
              </this.Page>
            )}
          />
        )}
      </FbDocuments>
    );
  }
  Page = styled("div")`
    display: flex;
    flex: 1;
    background: #fafafa;
  `;
}
