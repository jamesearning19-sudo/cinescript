import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formattedText, setFormattedText] = useState<string>("");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: `File "${data.file.originalName}" uploaded successfully`,
      });
      setFile(null);
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-semibold text-foreground">Script Formatter</h1>
          <p className="text-muted-foreground mt-2">
            Upload and format your scripts professionally
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Upload Script</h2>
          
          <div className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-12 text-center hover-elevate">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload DOC, PDF, or TXT files (max 10MB)
              </p>
              <input
                id="file-input"
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                data-testid="input-file"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("file-input")?.click()}
                data-testid="button-select-file"
              >
                Select File
              </Button>
              {file && (
                <p className="mt-4 text-sm text-foreground" data-testid="text-selected-file">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full"
              data-testid="button-upload"
            >
              {uploading ? "Uploading..." : "Upload Script"}
            </Button>
          </div>
        </Card>
{/* === SCRIPT FORMATTER SECTION === */}
<Card className="p-4 mt-8">
  <h2 className="text-xl font-semibold mb-3">Script Formatter</h2>

  <label htmlFor="formatType" className="block text-sm font-medium mb-2">
    Format Type
  </label>
  <select
    id="formatType"
    className="w-full p-2 border rounded mb-4"
    data-testid="select-format-type"
  >
    <option value="screenplay">Screenplay</option>
    <option value="musicvideo">Music Video</option>
    <option value="psa">PSA</option>
    <option value="storyboard">Storyboard</option>
  </select>

  <textarea
    id="scriptInput"
    placeholder="Paste your script, lyrics, narration, or scene breakdown here..."
    className="w-full h-48 p-2 border rounded mb-4"
    data-testid="textarea-script-input"
  />

  <Button
    onClick={async () => {
      const text = (document.getElementById("scriptInput") as HTMLTextAreaElement).value;
      const formatType = (document.getElementById("formatType") as HTMLSelectElement).value;

      if (!text.trim()) {
        toast({
          title: "No text found",
          description: "Paste something to format",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, formatType }),
      });

      const data = await response.json();
      const outputBox = document.getElementById("formattedOutput") as HTMLDivElement;

      // Clear previous output
      outputBox.innerHTML = "";

      if (formatType === "screenplay") {
        // Display plaintext in a <pre>
        const pre = document.createElement("pre");
        pre.textContent = data.formatted;
        pre.className = "w-full p-2 whitespace-pre-wrap";
        outputBox.appendChild(pre);
        setFormattedText(data.formatted);
      } else if (formatType === "musicvideo" || formatType === "psa") {
        // Display two-column table
        const table = document.createElement("table");
        table.className = "w-full border-collapse border";
        
        // Headers
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        data.headers.forEach((header: string) => {
          const th = document.createElement("th");
          th.textContent = header;
          th.className = "border p-2 bg-muted font-semibold text-left";
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Rows
        const tbody = document.createElement("tbody");
        data.rows.forEach((row: string[]) => {
          const tr = document.createElement("tr");
          row.forEach((cell: string) => {
            const td = document.createElement("td");
            td.textContent = cell;
            td.className = "border p-2";
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        outputBox.appendChild(table);
        
        // Convert table to text format for PDF export
        let textFormat = data.headers.join(" | ") + "\n";
        textFormat += "=".repeat(60) + "\n";
        data.rows.forEach((row: string[]) => {
          textFormat += row.join(" | ") + "\n";
        });
        setFormattedText(textFormat);
      } else if (formatType === "storyboard") {
        // Display four frame boxes in a 2x2 grid
        const grid = document.createElement("div");
        grid.className = "grid grid-cols-2 gap-4";
        
        data.frames.forEach((frame: { number: number; description: string }) => {
          const frameBox = document.createElement("div");
          frameBox.className = "border rounded p-4";
          
          const frameLabel = document.createElement("div");
          frameLabel.textContent = `Frame ${frame.number}`;
          frameLabel.className = "font-semibold mb-2";
          
          const frameDesc = document.createElement("div");
          frameDesc.textContent = frame.description;
          frameDesc.className = "text-sm";
          
          frameBox.appendChild(frameLabel);
          frameBox.appendChild(frameDesc);
          grid.appendChild(frameBox);
        });
        
        outputBox.appendChild(grid);
        
        // Convert storyboard to text format for PDF export
        let textFormat = "STORYBOARD\n\n";
        data.frames.forEach((frame: { number: number; description: string }) => {
          textFormat += `Frame ${frame.number}:\n${frame.description}\n\n`;
        });
        setFormattedText(textFormat);
      }
    }}
    data-testid="button-format"
  >
    Format Script
  </Button>

  <Button
    onClick={async () => {
      const formattedText = document.getElementById("formattedOutput")?.innerText || "";
      if (!formattedText.trim()) {
        alert("Format the script first before exporting.");
        return;
      }

      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: formattedText }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "script.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }}
    variant="outline"
    className="mt-4"
    data-testid="button-download-pdf"
  >
    Download PDF
  </Button>

  <div
    id="formattedOutput"
    className="w-full min-h-48 p-2 border mt-4 rounded overflow-auto bg-muted/30"
    data-testid="output-formatted"
  ></div>
</Card>
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">About This Tool</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              This web application helps you upload and manage scripts in various formats.
              You can upload DOC, PDF, or plain text files and prepare them for formatting
              into professional script layouts including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li>Screenplay format (industry standard)</li>
              <li>Double-column music video script format</li>
              <li>PSA (Public Service Announcement) format</li>
              <li>Storyboard frame layouts</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
