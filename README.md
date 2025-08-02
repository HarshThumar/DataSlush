# 🎯 DataSlush Talent AI - AI-Powered Talent Matching Platform

A modern, AI-powered talent recommendation system that uses Google's Gemini AI to match job requirements with candidate profiles. Features a beautiful chat interface, interactive dashboard, and intelligent candidate matching.

## ✨ Features

### 🤖 AI Chat Interface
- **Natural Language Processing**: Describe job requirements in plain English
- **Smart Matching**: AI automatically determines the best job category
- **Real-time Responses**: Instant candidate recommendations with match scores
- **Quick Suggestions**: Pre-built templates for common job types
- **Interactive Cards**: Beautiful candidate previews with hover effects

### 📊 Modern Dashboard
- **Analytics Overview**: Real-time statistics and insights
- **Interactive Job Selection**: Visual job type cards with animations
- **Candidate Grid**: Responsive card layout with detailed profiles
- **Recent Matches**: Track latest recommendations
- **Loading States**: Smooth animations and progress indicators

### 🚀 Technical Innovations
- **Embedding Caching**: Fast startup with pre-computed embeddings
- **Modular Architecture**: Clean component separation
- **Responsive Design**: Works perfectly on all devices
- **Modern UI/UX**: Glassmorphism effects and smooth animations
- **Real-time Updates**: Live data fetching and state management

## 🛠️ Technology Stack

### Backend
- **Flask**: Python web framework
- **Google Gemini AI**: Advanced language model for embeddings
- **LangChain**: AI framework for intelligent chat responses
- **Pandas**: Data processing and analysis
- **Scikit-learn**: Cosine similarity for matching
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: Modern UI framework
- **Vite**: Fast build tool and dev server
- **CSS3**: Advanced styling with animations
- **Responsive Design**: Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Google Gemini API key

### 1. Clone and Setup
```bash
git clone <repository-url>
cd DataSlush
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt


# Run the backend
python app.py
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- **Dashboard**: http://localhost:5173 (default view)
- **Chat Interface**: Click "AI Chat" in navigation
- **Original View**: Click "Original View" in navigation

## 🎨 Interface Overview

### Dashboard View
- **Statistics Cards**: Total candidates, active jobs, average match scores
- **Job Selector**: Interactive cards for different job types
- **Candidate Grid**: Detailed candidate profiles with actions
- **Recent Matches**: Quick overview of latest recommendations

### Chat Interface
- **AI Assistant**: Natural language job description input
- **Smart Responses**: Contextual AI-generated responses using LangChain
- **Candidate Previews**: Top 3 candidates with match scores
- **Quick Suggestions**: Pre-built job description templates

### Original View
- **Traditional Interface**: Dropdown-based job selection
- **Table Results**: Detailed candidate information in table format
- **Match Scores**: Percentage-based matching scores

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory (optional):
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

**Note**: A fallback API key is provided in the code for testing purposes.

### API Endpoints
- `GET /recommend/{job_id}`: Get candidate recommendations for job type
  - `job_id=1`: Video Editor for Entertainment/Lifestyle
  - `job_id=2`: Producer/Video Editor for TikTok
  - `job_id=3`: Chief Operation Officer for Productivity
- `POST /chat`: AI chat endpoint using LangChain
- `GET /health`: Health check endpoint

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with all components
- **Tablet**: Adaptive layout with touch-friendly interactions
- **Mobile**: Streamlined interface with optimized navigation

## 🎯 Key Features

### AI-Powered Matching
- Uses Google Gemini AI for semantic understanding
- LangChain framework for intelligent chat responses
- Cosine similarity for accurate candidate matching
- Intelligent job categorization based on natural language input

### Performance Optimizations
- **Embedding Caching**: Saves computed embeddings to disk
- **Fast Startup**: Loads pre-computed embeddings on subsequent runs
- **Efficient API Calls**: Minimizes API usage with smart caching

### User Experience
- **Smooth Animations**: CSS transitions and keyframe animations
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Graceful error messages and fallbacks
- **Accessibility**: Keyboard navigation and screen reader support

## 🔮 Future Enhancements

- **Advanced Filtering**: Skills, location, experience level filters
- **Candidate Profiles**: Detailed individual candidate pages
- **Interview Scheduling**: Integrated calendar and scheduling
- **Analytics Dashboard**: Advanced metrics and insights
- **Multi-language Support**: Internationalization features
- **Real-time Notifications**: WebSocket-based updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for advanced language processing
- LangChain framework for intelligent AI responses
- React community for excellent documentation
- Flask framework for robust backend development
- Modern CSS techniques for beautiful UI design

---

**Built with ❤️ for the DataSlush community** 