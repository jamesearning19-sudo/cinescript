import { z } from "zod";

export const uploadedFileSchema = z.object({
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  uploadedAt: z.string(),
});

export type UploadedFile = z.infer<typeof uploadedFileSchema>;
