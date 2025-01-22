import React from "react";
import RichTextEditor from "./RichTextEditor";

const BodyEditor = ({ initialValue, onValueChange }) => (
  <div className="editor-section">
    <h3>Content</h3>
    <RichTextEditor initialValue={initialValue} getValue={onValueChange} />
  </div>
);

export default BodyEditor;
