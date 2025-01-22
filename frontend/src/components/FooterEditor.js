import React from "react";
import RichTextEditor from "./RichTextEditor";

const FooterEditor = ({ initialValue, onValueChange }) => (
  <div className="editor-section">
    <h3>Footer</h3>
    <RichTextEditor initialValue={initialValue} getValue={onValueChange} />
  </div>
);

export default FooterEditor;
