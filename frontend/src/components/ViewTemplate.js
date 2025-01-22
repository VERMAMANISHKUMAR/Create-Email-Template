import React, { useState, useEffect } from "react";
import "../components/ViewTemplate.css"; // Import the CSS for styling

const EmailTemplateView = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [viewMode, setViewMode] = useState("desktop"); // State to track the view mode
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current template index

  // Fetch templates data from API
  useEffect(() => {
    fetch("http://localhost:5000/templates")
      .then((response) => response.json())
      .then((json) => {
        setTemplates(json);
        setFilteredTemplates(json); // Initially show all templates
      })
      .catch((error) => console.error("Network Error:", error));
  }, []);

  // Filter templates based on header
  const handleFilter = (input) => {
    const filtered = templates.filter((template) =>
      template.header.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredTemplates(filtered);
    setCurrentIndex(0); // Reset the index to the first template
  };

  // Generate HTML for download
  const handleDownload = (template) => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${template.header}</title>
</head>
<body>
  <div style="text-align: center;">
    <img src="${template.logo}" alt="Logo" style="width: 150px; height: auto;" />
    <h1>${template.header}</h1>
    <p>${template.body}</p>
    <footer>${template.footer}</footer>
  </div>
</body>
</html>
`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${template.header}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Handle navigation to the previous template
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Handle navigation to the next template
  const handleNext = () => {
    if (currentIndex < filteredTemplates.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className={`template-view ${viewMode}`}>
      <h1>Template Viewer</h1>

      {/* First div: Buttons and search input */}
      <div className="view-options">
        <div className="view-buttons">
          <button onClick={() => setViewMode("mobile")}>Mobile View</button>
          <button onClick={() => setViewMode("tablet")}>Tablet View</button>
          <button onClick={() => setViewMode("desktop")}>Desktop View</button>
        </div>

        <input
          type="text"
          placeholder="Search by Header"
          onChange={(e) => handleFilter(e.target.value)}
        />
      </div>

      {/* Second div: Display fetched templates */}
      <div className="template-display">
        {filteredTemplates.length > 0 ? (
          <div>
            <div className="template-card">
              <img
                src={filteredTemplates[currentIndex].logo}
                alt="Logo"
                className="template-logo"
              />
              <h2>{filteredTemplates[currentIndex].header}</h2>
              <p>{filteredTemplates[currentIndex].body}</p>
              <footer>{filteredTemplates[currentIndex].footer}</footer>
              <button onClick={() => handleDownload(filteredTemplates[currentIndex])}>
                Download Template
              </button>
            </div>

            {/* Navigation buttons */}
            <div className="navigation-buttons">
              <button onClick={handlePrev} disabled={currentIndex === 0}>
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === filteredTemplates.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p>No templates found.</p>
        )}
      </div>
    </div>
  );
};

export default EmailTemplateView;
