import * as React from "react";
import { Link, Route } from "react-router-dom";
import { FbDocuments } from "./FbDocuments";
import styled, { css } from "react-emotion";
import Modal from "react-modal";
import { Toggle, Value } from "react-powerplug";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core/";
import Add from "@material-ui/icons/Add";
Modal.setAppElement("#root");
export interface FilesProps {
  documents: { key; value: { name: string } }[];
}
export class Files extends React.Component<FilesProps, any> {
  public render() {
    const { documents } = this.props;
    return (
      <Paper
        elevation={2}
        className={css({ flex: 1, margin: 16, marginTop: 32 })}
      >
        <Table title="test">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Last modified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => {
              return (
                <TableRow key={doc.key} hover>
                  <TableCell component="th" scope="row">
                    <Link
                      className={css({
                        outline: "none",
                        textDecoration: "none",
                        color: "unset",
                      })}
                      to={`/documents/${doc.key}`}
                    >
                      {doc.value.name}
                    </Link>
                  </TableCell>
                  <TableCell>Kristoffer Petersen</TableCell>
                  <TableCell>Yesterday</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}
interface SideBarProps {
  createDoc: (p: { name: string }) => void;
}
class SideBar extends React.Component<SideBarProps, any> {
  Sidebar = styled("div")`
    padding-top: 38px;
  `;
  public render() {
    const { createDoc } = this.props;
    return (
      <Toggle>
        {({ on, set }) => (
          <this.Sidebar>
            <Button
              variant="fab"
              color="secondary"
              aria-label="Delete"
              onClick={() => set(true)}
              className={css({ margin: 8 })}
            >
              <Add />
            </Button>
            <Value initial="">
              {({ value, set: setVal }) => (
                <Dialog
                  open={on}
                  onClose={() => set(false)}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogTitle id="form-dialog-title">
                    Create New Document
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To create a new document, enter the desired name below and
                      press create.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Name"
                      type="text"
                      onChange={(e) => setVal(e.target.value)}
                      value={value}
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => set(false)} color="primary">
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        createDoc({ name: value });
                        set(false);
                      }}
                      color="primary"
                    >
                      Create
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            </Value>
          </this.Sidebar>
        )}
      </Toggle>
    );
  }
}
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
                <this.Bg />
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
  Bg = styled("div")({
    width: 64,
    background: "#EEEEEE",
    marginRight: -28,
  });
}
