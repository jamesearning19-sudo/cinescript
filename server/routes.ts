import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only TXT, PDF, DOC, and DOCX files are allowed."));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {app.use(express.json());
  // === SCRIPT FORMATTER ENDPOINT ===
app.post("/api/format", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No text provided" });
    }

    // TEMP BASIC FORMAT CLEANUP (we will upgrade later)
    const formatted = text
      .replace(/\r/g, "")
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "")
      .join("\n");

    return res.json({ formatted });
  } catch (err) {
    console.error("Format Error:", err);
    return res.status(500).json({ error: "Formatting failed" });
  }
});app.post("/api/upload", (req, res) => {
    upload.single("file")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const fileMetadata = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          uploadedAt: new Date().toISOString(),
        };

        await storage.saveFileMetadata(fileMetadata);

        res.json({
          message: "File uploaded successfully",
          file: fileMetadata,
        });
      } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Failed to upload file" });
      }
    });
  });

  app.get("/api/files", async (_req, res) => {
    try {
      const files = await storage.getAllFiles();
      res.json(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ error: "Failed to fetch files" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
