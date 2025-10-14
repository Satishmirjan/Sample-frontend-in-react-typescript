# Installation and Setup Guide

## Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:5173`

## What's Included

✅ **Complete React + TypeScript + Vite setup**
✅ **Tailwind CSS + shadcn/ui components**
✅ **React Router DOM for navigation**
✅ **Framer Motion for animations**
✅ **Axios for API calls**
✅ **Responsive design**
✅ **File upload support**
✅ **Modern UI components**

## Pages

- **Landing Page** (`/`) - Professional homepage with animations
- **Convert to Excel** (`/convert`) - PDF/DOCX to Excel conversion
- **Prediction** (`/prediction`) - AI-powered predictions

## Backend Integration

The frontend is ready to connect to your Python Flask backend. Update the API URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:5000/api"; // Your backend URL
```

## File Support

- **Upload**: PDF, DOCX, CSV, XLSX, JSON
- **Conversion**: Text Extraction, Table Parsing, OCR
- **Download**: Excel files, prediction reports

## Features

- 🎨 Modern, clean UI design
- 📱 Fully responsive (desktop, tablet, mobile)
- ⚡ Smooth animations and transitions
- 🔄 Loading states and error handling
- 📊 Progress indicators
- 💾 File download functionality
- 🧠 AI prediction dashboard

## Ready to Use!

Your tyre data analyzer web app is complete and ready for development!

