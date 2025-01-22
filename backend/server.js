const express = require("express");
const cors = require("cors"); // Import the cors package
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// We are Create MongoDB Connection
const MONGO_URI = "mongodb://localhost:27017/MyEmailTemplates"; 
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// We are Create Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// -------------------Multer setup for image uploads--------------
const upload = multer({ dest: "uploads/" });



// ------------------MongoDB Schema and Model-------------------
const emailTemplateSchema = new mongoose.Schema({
  logo: String,
  header: String,
  body: String,
  footer: String,
  createdAt: { type: Date, default: Date.now },
});

const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);

// ---------------------API: Get layout HTML--------------------------------
app.get("/getEmailLayout", (req, res) => {
  const layoutPath = path.join(__dirname, "public", "layout.html");
  fs.readFile(layoutPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading layout file." });
    }
    res.send(data);
  });
});

// -------------------------------API: Upload Image-------------------------
app.post("/uploadImage", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ message: "Image uploaded successfully.", imageUrl });
});

// ------------------------------API: Save Email Template---------------------
app.post("/saveTemplate", async (req, res) => {
  const { logo, header, body, footer } = req.body;

  if (!logo || !header || !body || !footer) {
    return res.status(400).json({ message: "Incomplete template data." });
  }
  try {
    const template = new EmailTemplate({ logo, header, body, footer });
    await template.save();
    res.status(200).json({ message: "Template saved successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving template." });
  }
});


// ------------------------------API: Get All Templates--------------------------
app.get("/templates", async (req, res) => {
  try {
    const templates = await EmailTemplate.find();
    res.status(200).json(templates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching templates." });
  }
});

//------------API: Render and Download Template with Improvements--------------
app.post("/renderAndDownloadTemplate", async (req, res) => {
  const { logo, header, body, footer } = req.body;

  // Improved error handling
  if (!logo || !header || !body || !footer) {
    console.error("Missing required fields for template rendering.");
    return res.status(400).json({ message: "Incomplete template data." });
  }

  try {
    const layoutPath = path.join(__dirname, "public", "layout.html");
    const layoutHtml = await fs.promises.readFile(layoutPath, "utf8");

    // Replace placeholders with provided data
    const renderedHtml = layoutHtml
      .replace("{{logo}}", logo)
      .replace("{{header}}", header)
      .replace("{{body}}", body)
      .replace("{{footer}}", footer);

    const outputPath = path.join(__dirname, "output.html");

    // Write the rendered HTML to an output file
    await fs.promises.writeFile(outputPath, renderedHtml);
    console.log("Template generated successfully. Sending the download...");

    // Send the generated HTML file as a download
    res.download(outputPath, "output.html", (err) => {
      if (err) {
        console.error("Error sending file:", err);
        return res.status(500).json({ message: "Error sending the file." });
      }
      console.log("File download initiated.");
    });
  } catch (err) {
    console.error("Error generating output HTML:", err);
    res.status(500).json({ message: "Error generating output HTML." });
  }
});
//---------------------------------------------------------------------------------
// --------------------------Start the my server-----------------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// API Endpoints:
// Get Layout: http://localhost:5000/getEmailLayout
// Save Template: http://localhost:5000/saveTemplate (POST)
// Render and Download Template: http://localhost:5000/renderAndDownloadTemplate (POST)
// Upload Image: http://localhost:5000/uploadImage (POST)
