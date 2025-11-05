import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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
