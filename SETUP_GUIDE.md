# Complete Setup Guide - Frontend & Backend Connection

This guide will help you set up and connect the frontend and backend for the file conversion system.

## Prerequisites

- **Python 3.8 or higher** (for backend)
- **pip** (Python package manager, comes with Python)
- **Node.js (v16 or higher)** (for frontend)
- **npm** (comes with Node.js)

## Step 1: Install Backend Dependencies (Python)

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

## Step 2: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Step 3: Start the Backend Server (Python/Flask)

Open a terminal and run:

```bash
cd backend

# Activate virtual environment if not already activated
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

# Start the Flask server
python app.py
```

You should see:
```
🚀 Server is running on http://localhost:5000
📁 Upload directory: [path]
📁 Output directory: [path]
```

## Step 4: Start the Frontend Development Server

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

The frontend will typically start on `http://localhost:5173` (or another port if 5173 is busy).

## Step 5: Test the Connection

1. Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`)
2. Navigate to the Convert page
3. Select one or more files (PDF, DOCX, CSV, or TXT)
4. Choose a conversion method
5. Click "Convert"
6. The files will be sent to the backend, converted to Excel, and you can download the result

## API Connection

The frontend is configured to connect to the backend at:
- Default: `http://localhost:5000`
- You can customize this by creating a `.env` file in the `frontend` directory:
  ```
  VITE_API_URL=http://localhost:5000
  ```

## Troubleshooting

### Backend won't start
- Make sure port 5000 is not in use
- Change the port by setting the `PORT` environment variable:
  ```bash
  # Windows
  set PORT=3000
  python app.py
  
  # Linux/Mac
  PORT=3000 python app.py
  ```
- Then update the frontend `.env` file accordingly
- Make sure your virtual environment is activated
- Ensure all dependencies are installed: `pip install -r requirements.txt`

### Frontend can't connect to backend
- Verify the backend is running and shows the "Server is running" message
- Check that the `VITE_API_URL` in frontend matches the backend URL
- Check browser console for CORS errors (CORS should be enabled by default)

### Files not converting
- Check backend console for error messages
- Ensure files are in supported formats: PDF, DOCX, CSV, TXT
- Check file size (max 50MB per file)

## Development Mode

For development:

**Backend (Python):**
```bash
cd backend
# Activate venv first
python app.py
# Flask runs in debug mode by default, which auto-reloads on file changes
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/convert` - Convert files to Excel
  - Body: `multipart/form-data`
  - Fields:
    - `files`: Array of files
    - `conversionMethod`: `text-extraction` | `table-parsing` | `ocr`

## Project Structure

```
jktyres/
├── backend/
│   ├── app.py                 # Flask server (Python)
│   ├── converter.py           # Conversion logic (Python)
│   ├── requirements.txt       # Python dependencies
│   ├── README_PYTHON.md       # Python backend documentation
│   ├── uploads/               # Temporary upload directory
│   └── output/                # Temporary output directory
├── frontend/
│   ├── src/
│   │   └── pages/
│   │       └── ConvertPage.tsx  # Frontend conversion UI
│   └── package.json
└── SETUP_GUIDE.md
```

## Next Steps

1. Both servers should be running
2. Open the frontend in your browser
3. Upload files and convert them to Excel!
4. Check the backend console for processing logs

Happy converting! 🚀

