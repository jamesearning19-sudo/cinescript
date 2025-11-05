# Script Formatter Web Application

## Overview
A basic Node.js + Express web server foundation for a script formatting application. This provides a clean starting point for building script processing features.

## Current Features
- Express server with basic routing
- File upload capability (supports DOC, PDF, TXT files up to 10MB)
- Simple HTML/CSS interface built with React
- In-memory storage for file metadata
- Clean project structure ready for expansion

## Tech Stack
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI
- **File Handling**: Multer for file uploads
- **Storage**: In-memory storage (MemStorage)

## Project Structure
```
├── client/               # Frontend React application
│   └── src/
│       ├── pages/       # Page components
│       └── components/  # Reusable UI components
├── server/              # Backend Express server
│   ├── routes.ts       # API endpoints
│   └── storage.ts      # Data storage interface
├── shared/             # Shared types and schemas
│   └── schema.ts       # TypeScript types
└── uploads/            # Uploaded files directory
```

## API Endpoints
- `POST /api/upload` - Upload a script file (TXT, PDF, DOC, DOCX)
- `GET /api/files` - Get list of all uploaded files

## Running the Application
The application runs automatically on Replit. The Express server and Vite dev server start together on the same port.

## Next Steps (For You to Build)
This is a foundation ready for you to add:
1. Script parsing logic (PDF, DOC, TXT extraction)
2. Format conversion functions (screenplay, music video, PSA formats)
3. Storyboard layout generation (4 frames per section)
4. PDF generation for formatted output
5. Enhanced UI for format selection and preview
6. Download functionality for formatted scripts

## File Upload Configuration
- Supported formats: `.txt`, `.pdf`, `.doc`, `.docx`
- Maximum file size: 10MB
- Files are stored in the `uploads/` directory
- Metadata is tracked in memory (replace with database for production)

## Architecture Notes
- Uses in-memory storage (MemStorage) - suitable for development
- For production, consider implementing PostgreSQL database
- File uploads are handled server-side with proper validation
- Frontend uses React with TypeScript for type safety
- Shadcn UI components for consistent design
