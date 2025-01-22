import React from "react";
import RichTextEditor from "./RichTextEditor";

const HeaderEditor = ({ initialValue, onValueChange }) => (
  <div className="editor-section">
    <h3>Title</h3>
    <RichTextEditor initialValue={initialValue} getValue={onValueChange} />
  </div>
);

export default HeaderEditor;
