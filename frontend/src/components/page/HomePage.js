import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../components/page/styles.css";
import LogoEditor from "../../components/LogoEditor";
import HeaderEditor from "../../components/HeaderEditor";
import BodyEditor from "../../components/BodyEditor";
import FooterEditor from "../../components/FooterEditor";
import { Link } from "react-router-dom";


export default function HomePage() {
// Here Store the data
  const [logoContent, setLogoContent] = useState("");
  const [headerContent, setHeaderContent] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [footerContent, setFooterContent] = useState("");
// This function use True: The string is valid Base64. False: The string is not valid Base64.
  const isBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };
// --------------------------------downloadContent---------------------------------------------

// This function use to download the HTML Code Template
  const downloadContent = () => {
    const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
  </head>
  <body>
    <header>
      ${logoContent}
    </header>
    <h2>  
    ${headerContent}
    </h2>
    <main>
      ${bodyContent}
    </main>
    
    <footer>
      ${footerContent}
    </footer>
  </body>
  </html>
    `;
  
    const blob = new Blob([htmlContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "content.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

// -------------------------------------viewTemplate-------------------------------------------
//   const viewTemplate = () => {
//     const template = `${logoContent}\n\n${headerContent}\n\n${bodyContent}\n\n${footerContent}`;
//     const newWindow = window.open();
//     newWindow.document.write(template);
//     newWindow.document.close();
//   };
// -------------------------------------Download View----------------------------------------
//This function use to download the Template
const downloadViewFile = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Template Preview</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        h3 { color: #333; }
        hr { margin: 20px 0; }
      </style>
    </head>
    <body>
      
      <div>${logoContent}</div>
  
      <div>${headerContent}</div>
    
      <div>${bodyContent}</div>
     
      <div>${footerContent}</div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "template-preview.html";
  link.click();
  URL.revokeObjectURL(link.href);
};

// -------------------------------------handlePost the Data-------------------------------------------
// This function use to handle the post data
const handlePost = async () => {
          const payload = {
            logo: logoContent,
            header: headerContent,
            body: bodyContent,
            footer: footerContent,
          };
        
          try {
            const response = await fetch("http://localhost:5000/saveTemplate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });
        
            if (response.ok) {
              const result = await response.json();
              toast.success("Template saved successfully!");
              console.log(result); // Log the response from the server
            } else {
              console.error("Failed to save template", response.status);
              toast.error("Failed to save template!");
            }
          } catch (error) {
            console.error("Error while saving template:", error);
            toast.error("Error while saving template!");
          }
        };
        
// -----------------------------------all Retuen Part------------------------------------------
  return (
    <div className="app-container">
    
    <button
        onClick={() => {
          setLogoContent("");
          setHeaderContent("");
          setBodyContent("");
          setFooterContent("");
        }}
        className="clear-btn"
      >
        Clear
      </button>
   
    <label>
    <h1 className="Main-Header">Create Email Template</h1>
    </label>
    
      <div className="layout">
        <div className="preview">
          <div className="preview-content">
          
            <div dangerouslySetInnerHTML={{ __html: logoContent }} />
        
            <div dangerouslySetInnerHTML={{ __html: headerContent }} />
           
            <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
           
            <div dangerouslySetInnerHTML={{ __html: footerContent }} />
          </div>
          <div className="button-group">
            <button onClick={downloadContent} className="download-btn">
              Download HTML Code
            </button>
            <button onClick={downloadViewFile} className="view-btn">
              View Download
            </button>
             <button onClick={handlePost} className="view-btn">
              Save Template
            </button>
            <Link to="/view-template">
           <button className="view-btn">View Template</button>
           </Link>
           
          </div>
        </div>

        <div className="editor">
          <LogoEditor
            initialValue={logoContent}
            onValueChange={(value) => {
              if (isBase64(value)) toast.warning("Logo Clear Successfully! ");
              setLogoContent(value);
            }}
          />
          <hr />
          <HeaderEditor
            initialValue={headerContent}
            onValueChange={(value) => {
              if (isBase64(value)) toast.warning("Header Clear Successfully!");
              setHeaderContent(value);
            }}
          />
          <hr />
          <BodyEditor
            initialValue={bodyContent}
            onValueChange={(value) => {
              if (isBase64(value)) toast.warning("Body Clear Successfully!");
              setBodyContent(value);
            }}
          />
          <hr />
          <FooterEditor
            initialValue={footerContent}
            onValueChange={(value) => {
              if (isBase64(value)) toast.warning("Footer Clear Successfully!");
              setFooterContent(value);
            }}
          />
        </div>
      </div>
      {/* Add the Toast Container  it use to Notification*/}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover 
      />
    
    </div>
  );
}
