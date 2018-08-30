import * as React from "react";
import styled from "react-emotion";
import { MemoryRouter, Link } from "react-router-dom";
const documents = [
  { key: "1", value: { name: "test 1" } },
  { key: "2", value: { name: "test 2" } },
  { key: "app", value: { name: "test 3" } },
];
const S_List = styled("div")`
  border: 1px solid #000;
`;
export default class storybook extends React.Component {
  render() {
    return (
      <div>
        <S_List>
          <div>
            <input type="text" placeholder="create new document" />
            <button onClick={() => {}}>+</button>
          </div>

          {documents.map(({ key, value: { name } }) => (
            <div key={key}>
              <Link to={`/documents/${key}`}>{name}</Link>
            </div>
          ))}
        </S_List>
      </div>
    );
  }
}
