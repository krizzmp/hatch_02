import styled, { css } from "react-emotion";
import Modal from "react-modal";
import { Toggle, Value } from "react-powerplug";
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
import * as React from "react";
Modal.setAppElement("#root");
interface SideBarProps {
  createDoc: (
    p: {
      name: string;
    },
  ) => void;
}
export class SideBar extends React.Component<SideBarProps, any> {
  Sidebar = styled("div")({
    paddingTop: 38,
    width: 56,
    paddingLeft: 28,
    marginRight: 24,
    background: "#eee",
  });
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
              className={css({ margin: 0 })}
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
