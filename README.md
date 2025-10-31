# Tyre Data Analyzer

A modern, responsive React + TypeScript web application for processing PDF reports related to tyre experiments and performing data analysis operations.

## 🌐 Project Overview

This web application provides two main functionalities:

- **Convert data from PDF → Excel file**: Extract key experiment data (temperature, weight, day readings) from PDF reports and export to Excel
- **Run prediction analysis**: Use AI to predict tyre performance based on experiment data

## ⚙️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router DOM
- **API Calls**: Axios
- **Animations**: Framer Motion
- **State Management**: React hooks (useState, useEffect)
- **Backend**: Python Flask (separate project)

## 🚀 Features

### 📄 Landing Page

- Professional landing page with smooth animations
- Clear description of the project capabilities
- Navigation to main features
- Responsive design for all devices

### 📊 Convert to Excel Page

- File upload support (PDF, DOCX, CSV)
- Multiple conversion approaches (Text Extraction, Table Parsing, OCR)
- Optional folder selection for output
- Progress indicators and loading states
- Download functionality for converted files

### 🧠 Prediction Dashboard

- Dual input methods: file upload or manual parameter entry
- AI-powered predictions for tyre performance
- Confidence scoring and recommendations
- Downloadable prediction reports

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tyre-data-analyzer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   └── Footer.tsx      # Footer component
├── pages/              # Main application pages
│   ├── LandingPage.tsx # Home page
│   ├── ConvertPage.tsx # PDF to Excel conversion
│   └── PredictionPage.tsx # AI prediction dashboard
├── services/           # API services
│   └── api.ts         # Backend integration
├── lib/               # Utility functions
│   └── utils.ts       # Helper functions
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## 🌐 API Integration

The frontend communicates with a Python Flask backend through REST APIs:

### Endpoints

- `POST /api/convert` - Convert PDF/DOCX to Excel
- `POST /api/predict` - Get AI predictions
- `GET /api/health` - Health check

### Environment Configuration

Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:5000/api"; // Change to your backend URL
```

## 🎨 UI Components

Built with shadcn/ui components for a modern, accessible design:

- Button, Card, Input, Select components
- Responsive grid layouts
- Smooth animations with Framer Motion
- Dark/light theme support

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure redirects for SPA routing

## 🔒 File Upload Support

The application supports multiple file formats:

- **PDF**: `.pdf`
- **Microsoft Word**: `.docx`
- **CSV**: `.csv`
- **Excel**: `.xlsx`
- **JSON**: `.json`

## 📊 Features in Detail

### Conversion Approaches

1. **Text Extraction**: Extract text content from documents
2. **Table Parsing**: Identify and parse tabular data
3. **OCR Processing**: Optical Character Recognition for scanned documents

### Prediction Parameters

- Temperature (°C)
- Weight (kg)
- Pressure (PSI)
- Day of Week (1-7)
- Humidity (%)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

© 2025 Tyre Data Analyzer | Powered by Jk Tyres

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.


some installations and also the requirements
1) Create a Vite + React + TypeScript app
npm create vite@latest tyre-data-analyzer -- --template react-ts
cd tyre-data-analyzer

# 2) Install runtime dependencies
npm i react-router-dom axios framer-motion lucide-react clsx tailwind-merge @radix-ui/react-slot @radix-ui/react-select class-variance-authority tailwindcss-animate

# 3) Install dev dependencies (matching your versions)
npm i -D @vitejs/plugin-react@^4.1.1 typescript@^5.2.2 vite@^5.0.0 tailwindcss@^3.3.5 postcss@^8.4.31 autoprefixer@^10.4.16 eslint@^8.53.0 @typescript-eslint/parser@^6.10.0 @typescript-eslint/eslint-plugin@^6.10.0 eslint-plugin-react-hooks@^4.6.0 eslint-plugin-react-refresh@^0.4.4 @types/react@^18.2.37 @types/react-dom@^18.2.15

# 4) Initialize Tailwind (creates tailwind.config.js and postcss.config.js)
npx tailwindcss init -p


