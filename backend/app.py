import os
import pandas as pd
import numpy as np
import google.generativeai as genai
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity
import logging
import time
import pickle
from ai_chat_service import AIChatService

# --- INITIAL SETUP ---
load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:5173"]}})
logging.basicConfig(level=logging.INFO)

# --- CONFIGURE GEMINI API ---
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        # Use the provided API key as fallback
        api_key = "AIzaSyDOo8pbzZ-TcRfQJqMLBn0NCMJSUr7O9Jw"
        logging.warning("Using fallback API key. Please set GEMINI_API_KEY in .env file for production.")
    
    genai.configure(api_key=api_key)
    logging.info("Gemini API configured successfully.")
    
    # Initialize AI Chat Service
    ai_chat_service = AIChatService(api_key)
    logging.info("AI Chat Service initialized successfully.")
except Exception as e:
    logging.error(f"Error configuring Gemini API: {e}")
    ai_chat_service = None

embedding_cache = {}

def get_embedding(text, model="models/text-embedding-004"):
    if not isinstance(text, str) or not text.strip():
        return None
    if text in embedding_cache:
        return embedding_cache[text]
    try:
        # Adding a small delay to respect API rate limits
        time.sleep(0.1) 
        result = genai.embed_content(
            model=model,
            content=text,
            task_type="RETRIEVAL_DOCUMENT"
        )
        embedding_cache[text] = result['embedding']
        return result['embedding']
    except Exception as e:
        logging.error(f"Error generating embedding: {e}")
        return None

def save_embeddings_to_file(talent_df, filename='talent_embeddings.pkl'):
    """Save talent data with embeddings to a pickle file"""
    try:
        with open(filename, 'wb') as f:
            pickle.dump(talent_df, f)
        logging.info(f"Embeddings saved to {filename}")
        return True
    except Exception as e:
        logging.error(f"Error saving embeddings: {e}")
        return False

def load_embeddings_from_file(filename='talent_embeddings.pkl'):
    """Load talent data with embeddings from a pickle file"""
    try:
        with open(filename, 'rb') as f:
            talent_df = pickle.load(f)
        logging.info(f"Embeddings loaded from {filename}")
        return talent_df
    except Exception as e:
        logging.error(f"Error loading embeddings: {e}")
        return None

# --- LOAD AND PREPARE DATA ---
EMBEDDINGS_FILE = 'talent_embeddings.pkl'

# Try to load existing embeddings first
talent_df = load_embeddings_from_file(EMBEDDINGS_FILE)

if talent_df is None:
    # If no saved embeddings, generate them
    try:
        logging.info("No saved embeddings found. Generating new embeddings...")
        talent_df = pd.read_csv('Talent Profiles - talent_samples.csv')
        talent_df.fillna('', inplace=True)
        talent_df['name'] = talent_df['First Name'] + ' ' + talent_df['Last Name']
        talent_df['location'] = talent_df['City'] + ', ' + talent_df['Country']
        talent_df['combined_features'] = talent_df.apply(
            lambda row: f"Bio: {row['Profile Description']}. Skills: {row['Skills']}. Niche: {row['Content Verticals']}. Past Work: {row['Past Creators']}",
            axis=1
        )

        # Generate embeddings with progress indicator
        logging.info("Starting to generate embeddings for talent profiles. This may take a few minutes...")
        embeddings = []
        total_profiles = len(talent_df)
        for index, row in talent_df.iterrows():
            embedding = get_embedding(row['combined_features'])
            embeddings.append(embedding)
            # Print progress every 25 profiles
            if (index + 1) % 25 == 0:
                logging.info(f"  Processed {index + 1} of {total_profiles} profiles...")
        
        talent_df['embedding'] = embeddings
        talent_df.dropna(subset=['embedding'], inplace=True)
        
        # Save embeddings for future use
        if save_embeddings_to_file(talent_df, EMBEDDINGS_FILE):
            logging.info(f"Successfully generated and saved embeddings for {len(talent_df)} talent profiles.")
        else:
            logging.warning("Generated embeddings but failed to save them.")
            
    except FileNotFoundError:
        logging.error("'Talent Profiles - talent_samples.csv' not found.")
        talent_df = pd.DataFrame()
    except KeyError as e:
        logging.error(f"A column was not found in the CSV: {e}.")
        talent_df = pd.DataFrame()
    except Exception as e:
        logging.error(f"An error occurred during data loading: {e}")
        talent_df = pd.DataFrame()
else:
    logging.info(f"Successfully loaded {len(talent_df)} talent profiles with pre-computed embeddings.")



# --- API ENDPOINTS ---


@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        if not data or 'job_description' not in data:
            return jsonify({"error": "job_description is required in request body"}), 400
        
        job_description = data['job_description']
        top_k = data.get('top_k', 10)
        
        if talent_df.empty:
            return jsonify({"error": "Talent data not loaded"}), 500

        job_embedding = get_embedding(job_description)
        
        if not job_embedding:
            return jsonify({"error": "Could not generate embedding for job description"}), 500

        candidate_embeddings = np.array(talent_df['embedding'].tolist())
        job_embedding_reshaped = np.array(job_embedding).reshape(1, -1)
        similarities = cosine_similarity(job_embedding_reshaped, candidate_embeddings)
        
        ranked_df = talent_df.copy()
        ranked_df['score'] = similarities[0]
        
        top_candidates = ranked_df.sort_values(by='score', ascending=False).head(top_k)
        
        # Prepare results with full data structure
        results = []
        for _, row in top_candidates.iterrows():
            candidate_data = row.to_dict()
            # Add similarity and final_score fields
            candidate_data['similarity'] = float(row['score'])
            candidate_data['final_score'] = float(row['score'])  # You can implement custom scoring logic here
            # Remove the embedding field as it's not needed in response
            if 'embedding' in candidate_data:
                del candidate_data['embedding']
            if 'combined_features' in candidate_data:
                del candidate_data['combined_features']
            results.append(candidate_data)

        return jsonify({
            "strategy": "basic",
            "top_k": top_k,
            "results": results
        })
        
    except Exception as e:
        logging.error(f"Error in recommend endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/recommend/weighted', methods=['POST'])
def recommend_weighted():
    try:
        data = request.get_json()
        if not data or 'job_description' not in data:
            return jsonify({"error": "job_description is required in request body"}), 400
        
        job_description = data['job_description']
        top_k = data.get('top_k', 10)
        weights = data.get('weights', {})
        
        if talent_df.empty:
            return jsonify({"error": "Talent data not loaded"}), 500

        job_embedding = get_embedding(job_description)
        
        if not job_embedding:
            return jsonify({"error": "Could not generate embedding for job description"}), 500

        candidate_embeddings = np.array(talent_df['embedding'].tolist())
        job_embedding_reshaped = np.array(job_embedding).reshape(1, -1)
        similarities = cosine_similarity(job_embedding_reshaped, candidate_embeddings)
        
        ranked_df = talent_df.copy()
        ranked_df['score'] = similarities[0]
        
        # Apply weights if provided
        if weights:
            # You can implement custom weighting logic here
            # For now, we'll use the same similarity scoring
            logging.info(f"Using weights: {weights}")
        
        top_candidates = ranked_df.sort_values(by='score', ascending=False).head(top_k)
        
        # Prepare results with full data structure
        results = []
        for _, row in top_candidates.iterrows():
            candidate_data = row.to_dict()
            # Add similarity and final_score fields
            candidate_data['similarity'] = float(row['score'])
            candidate_data['final_score'] = float(row['score'])  # You can implement custom scoring logic here
            # Remove the embedding field as it's not needed in response
            if 'embedding' in candidate_data:
                del candidate_data['embedding']
            if 'combined_features' in candidate_data:
                del candidate_data['combined_features']
            results.append(candidate_data)

        return jsonify({
            "strategy": "weighted",
            "top_k": top_k,
            "results": results
        })
        
    except Exception as e:
        logging.error(f"Error in weighted recommend endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500




@app.route('/chat', methods=['POST'])
def chat():
    """AI Chat endpoint using LangChain"""
    if not ai_chat_service:
        return jsonify({"error": "AI Chat Service not available"}), 500
    
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "Message is required"}), 400
        
        user_message = data['message']
        
        # Process the message using AI Chat Service
        response = ai_chat_service.process_chat_message(user_message)
        
        return jsonify(response)
        
    except Exception as e:
        logging.error(f"Error in chat endpoint: {e}")
        return jsonify({
            "message": "I'm sorry, I encountered an error. Please try again.",
            "candidates": [],
            "success": False
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "talent_profiles_loaded": len(talent_df),
        "ai_chat_available": ai_chat_service is not None,
        "embeddings_loaded": not talent_df.empty
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
