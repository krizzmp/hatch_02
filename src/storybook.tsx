import * as React from "react";
import { MyEditor } from "./Document/MyEditor";
export default class storybook extends React.Component {
  render() {
    return (
      <MyEditor
        actions={{
          CreateNote: () => {},
          RemoveNote: () => {},
          UpdateNoteSize: () => {},
          UpdateNoteText: () => {},
        }}
        createNoteBeneath={() => {}}
        id=""
        name={`#test\ng`}
        select={() => {}}
        selected={true}
        onClick={() => {}}
        localBox={{ isNew: false, h: 0, w: 0 }}
      />
    );
  }
}
