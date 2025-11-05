import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";

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

function formatScreenplay(text: string) {
  const lines = text.replace(/\r/g, "").split("\n");
  const isScene = (l: string) => /^(INT\.|EXT\.|INT\/EXT\.)\s/.test(l.trim());
  const isParenthetical = (l: string) => /^\(.*\)$/.test(l.trim());
  const isCharacter = (l: string) => /^[A-Z0-9 .'-]{2,}$/.test(l.trim()) && l.trim().length <= 30 && !isScene(l.trim());
  const out: string[] = [];
  let lastWasCharacter = false;
  for (let raw of lines) {
    const l = raw.trim();
    if (!l) { out.push(""); lastWasCharacter = false; continue; }
    if (isScene(l)) { out.push(l.toUpperCase()); out.push(""); lastWasCharacter = false; continue; }
    if (isCharacter(l)) { out.push("          " + l.toUpperCase()); lastWasCharacter = true; continue; }
    if (isParenthetical(l) && lastWasCharacter) { out.push("        " + l); continue; }
    if (lastWasCharacter) out.push("        " + l);
    else out.push(l);
  }
  return out.join("\n");
}

function formatMusicVideo(text: string) {
  return {
    headers: ["VIDEO (Visuals / Shots)", "AUDIO (Lyrics / Vocals)"],
    rows: text.replace(/\r/g, "").split("\n").map(l => l.trim()).map(l =>
      /^VIS:/i.test(l) ? [l.replace(/^VIS:\s*/i, ""), ""] :
      /^AUD:/i.test(l) ? ["", l.replace(/^AUD:\s*/i, "")] :
      ["(Describe shot here)", l]
    )
  };
}

function formatPSA(text: string) {
  return {
    headers: ["NARRATION (VO / Dialogue)", "CAMERA (Shots / Direction)"],
    rows: text.replace(/\r/g, "").split("\n").map(l => l.trim()).map(l =>
      /^CAM:/i.test(l) ? ["", l.replace(/^CAM:\s*/i, "")] :
      /^NAR:/i.test(l) ? [l.replace(/^NAR:\s*/i, ""), ""] :
      [l, ""]
    )
  };
}

function formatStoryboard(text: string) {
  const blocks = text.replace(/\r/g, "").split(/\n\s*\n/).filter(Boolean).slice(0,4);
  const frames = blocks.map((b, i) => ({ number: i+1, description: b.trim() }));
  while (frames.length < 4) frames.push({ number: frames.length+1, description: "(Empty)" });
  return { frames };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());
  
  // === SCRIPT FORMATTER ENDPOINT ===
  app.post("/api/format", async (req, res) => {
    try {
      const { text, formatType } = req.body;

      if (!text || text.trim() === "") {
        return res.status(400).json({ error: "No text provided" });
      }

      let payload;
      switch (formatType) {
        case "screenplay": payload = { formatted: formatScreenplay(text) }; break;
        case "musicvideo": payload = formatMusicVideo(text); break;
        case "psa": payload = formatPSA(text); break;
        case "storyboard": payload = formatStoryboard(text); break;
        default: payload = { formatted: text };
      }
      return res.json(payload);
    } catch (err) {
      console.error("Format Error:", err);
      return res.status(500).json({ error: "Formatting failed" });
    }
  });

  app.post("/api/export/pdf", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || text.trim() === "") {
        return res.status(400).json({ error: "No text provided" });
      }

      const doc = new PDFDocument({ margin: 40 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=script.pdf");

      doc.pipe(res);
      doc.font("Times-Roman").fontSize(12).text(text, { lineGap: 6 });
      doc.end();
    } catch (err) {
      console.error("PDF Export Error:", err);
      return res.status(500).json({ error: "PDF export failed" });
    }
  });

  app.post("/api/upload", (req, res) => {
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
