import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { MemoryRouter, Link } from "react-router-dom";
import styled from "react-emotion";

const documents = [
  { key: "1", value: { name: "test 1" } },
  { key: "2", value: { name: "test 2" } },
  { key: "3", value: { name: "test 3" } },
];
const S_List = styled("div")`
  border: 1px solid #000;
`;
storiesOf("Documents", module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
  ))
  .add("test", () => (
    <S_List>
      <div>
        <input type="text" placeholder="create new document" />
        <button onClick={action("create document")}>+</button>
      </div>

      {documents.map(({ key, value: { name } }) => (
        <div key={key}>
          <Link to={`/documents/${key}`}>{name}</Link>
        </div>
      ))}
    </S_List>
  ));
