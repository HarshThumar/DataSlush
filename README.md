#  DataSlush Talent AI - AI-Powered Talent Matching Platform

A modern, AI-powered talent recommendation system that uses Google's Gemini AI to match job requirements with candidate profiles. Features a beautiful chat interface, interactive dashboard, and intelligent candidate matching.

# DataSlush - Quick Setup Guide

A simple step-by-step guide to run the **DataSlush** platform locally.

---

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- A valid Google Gemini API key

---

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd DataSlush
```

---

## Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate the virtual environment (Windows)
.env\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt
```

### Create a `.env` File

Create a file named `.env` in the `backend` folder and add the following:

```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Run the Backend Server

```bash
python app.py
```

---

## Step 3: Frontend Setup

🔹 Open a **new terminal window/tab** and run:

```bash
cd DataSlush/frontend

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

---

## Step 4: Access the Application

- **Dashboard**: http://localhost:5173
- **Chat Interface**: Click "AI Chat" in the top navigation
- **Original View**: Click "Original View" in the top navigation

---

##  Features

###  AI Chat Interface
- **Natural Language Processing**: Describe job requirements in plain English
- **Smart Matching**: AI automatically determines the best job category
- **Real-time Responses**: Instant candidate recommendations with match scores
- **Quick Suggestions**: Pre-built templates for common job types
- **Interactive Cards**: Beautiful candidate previews with hover effects

###  Modern Dashboard
- **Analytics Overview**: Real-time statistics and insights
- **Interactive Job Selection**: Visual job type cards with animations
- **Candidate Grid**: Responsive card layout with detailed profiles
- **Recent Matches**: Track latest recommendations
- **Loading States**: Smooth animations and progress indicators

###  Technical Innovations
- **Embedding Caching**: Fast startup with pre-computed embeddings
- **Modular Architecture**: Clean component separation
- **Responsive Design**: Works perfectly on all devices
- **Modern UI/UX**: Glassmorphism effects and smooth animations
- **Real-time Updates**: Live data fetching and state management

##  Technology Stack

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


