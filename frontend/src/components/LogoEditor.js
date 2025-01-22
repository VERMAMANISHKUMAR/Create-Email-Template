import React from "react";
import RichTextEditor from "./RichTextEditor";

const LogoEditor = ({ initialValue, onValueChange }) => (
  <div className="editor-section">
    <h3>Create Logo</h3>
    <RichTextEditor initialValue={initialValue} getValue={onValueChange} />
  </div>
);

export default LogoEditor;
