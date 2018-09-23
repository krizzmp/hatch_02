import * as React from "react";
import { Link } from "react-router-dom";
import { css } from "react-emotion";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  Toolbar,
  Typography,
  Tooltip,
  TableSortLabel,
} from "@material-ui/core";
interface FilesProps {
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
        <Toolbar>
          <Typography variant="title">Files</Typography>
        </Toolbar>
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
                  <TableCell scope="row">
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
