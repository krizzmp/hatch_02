import * as React from "react";
import { Link } from "react-router-dom";
import { Toggle } from "react-powerplug";
import { FbDocuments } from "./FbDocuments";
import styled, { css } from "react-emotion";
const bdColor = "#bfbfbf";
const SListItem = styled("div")`
  height: 32px;
  border-bottom: 1px solid ${bdColor};
  &:last-of-type {
    border-bottom: none;
  }
  padding-left: 8px;
  display: flex;
  align-items: center;
`;
const SList = styled("div")`
  border: 1px solid ${bdColor};
  margin: 8px;
  /* border-radius: 4px; */
`;
const SLink = styled(Link)`
  font-size: 14px;
  flex: 1;
  padding-left: 8px;
  border: none;
  outline: none;
  color: #000;
  text-decoration: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;
const SLanc = SLink.withComponent("div");
const SLunq = SLink.withComponent("input");
const SCheckBox = styled("div")`
  font-size: 14px;
  margin: 0;
  border-right: 1px solid ${bdColor};
  align-self: stretch;
  display: flex;
  padding-right: 8px;
  align-items: center;
  span,
  input {
    width: 12px;
    text-align: center;
    margin: 0;
  }
`;
const create = css({
  color: "#bfbfbf",
});
export const Documents = ({ user }) => (
  <FbDocuments userId={user.uid}>
    {({ documents }) => (
      <div>
        <SList>
          <SListItem className={create}>
            <SCheckBox>
              <span>+</span>
            </SCheckBox>
            <SLunq type="text" placeholder="create new document" />
          </SListItem>

          {documents.map(({ key, value: { name } }) => (
            <SListItem key={key}>
              <SCheckBox>
                <input type="checkbox" />
              </SCheckBox>
              <SLink to={`/documents/${key}`}>{name}</SLink>
            </SListItem>
          ))}
        </SList>
      </div>
    )}
  </FbDocuments>
);
