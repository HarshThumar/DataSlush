import os
import json
import logging
from typing import List, Dict, Any
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd

class AIChatService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        genai.configure(api_key=api_key)
        
        # Initialize LangChain components
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            google_api_key=api_key,
            temperature=0.7,
            max_output_tokens=2048
        )
        
        # Load saved embeddings and talent data
        self.talent_data = self.load_talent_data()
        
        # Initialize conversation memory
        self.conversation_memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        # Define system prompts
        self.system_prompt = """You are an AI Talent Assistant specializing in helping recruiters find the perfect candidates for their job openings. 

Your capabilities:
- Analyze job requirements and match them with candidate profiles
- Provide detailed insights about candidate skills and experience
- Suggest follow-up questions to refine searches
- Give contextual recommendations based on company culture and requirements

Always be helpful, professional, and provide specific, actionable insights about candidates."""

    def load_talent_data(self) -> pd.DataFrame:
        """Load saved talent data with embeddings"""
        try:
            import pickle
            with open('talent_embeddings.pkl', 'rb') as f:
                talent_df = pickle.load(f)
            logging.info(f"Loaded {len(talent_df)} talent profiles with embeddings")
            return talent_df
        except Exception as e:
            logging.error(f"Error loading talent data: {e}")
            return pd.DataFrame()

    def get_candidate_embeddings(self) -> np.ndarray:
        """Get candidate embeddings as numpy array"""
        if self.talent_data.empty:
            return np.array([])
        
        embeddings = []
        for embedding in self.talent_data['embedding']:
            if embedding is not None:
                embeddings.append(embedding)
            else:
                embeddings.append([0] * 768)  # Default embedding size
        
        return np.array(embeddings)

    def find_relevant_candidates(self, query: str, top_k: int = 5) -> List[Dict]:
        """Find relevant candidates using semantic search"""
        if self.talent_data.empty:
            return []
        
        # Generate embedding for the query
        query_embedding = self.generate_query_embedding(query)
        if query_embedding is None:
            return []
        
        # Get candidate embeddings
        candidate_embeddings = self.get_candidate_embeddings()
        if len(candidate_embeddings) == 0:
            return []
        
        # Calculate similarities
        query_embedding_reshaped = np.array(query_embedding).reshape(1, -1)
        similarities = cosine_similarity(query_embedding_reshaped, candidate_embeddings)
        
        # Get top candidates
        top_indices = similarities[0].argsort()[-top_k:][::-1]
        
        candidates = []
        for idx in top_indices:
            candidate = self.talent_data.iloc[idx]
            candidates.append({
                'name': candidate['name'],
                'location': candidate['location'],
                'skills': candidate['Skills'],
                'bio': candidate['Profile Description'],
                'score': float(similarities[0][idx]),
                'rank': len(candidates) + 1
            })
        
        return candidates

    def generate_query_embedding(self, query: str) -> List[float]:
        """Generate embedding for user query"""
        try:
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=query,
                task_type="RETRIEVAL_QUERY"
            )
            return result['embedding']
        except Exception as e:
            logging.error(f"Error generating query embedding: {e}")
            return None

    def analyze_job_requirements(self, query: str) -> Dict[str, Any]:
        """Analyze job requirements using LangChain"""
        analysis_prompt = ChatPromptTemplate.from_messages([
            ("system", """Analyze the job requirements and extract key information. Return a JSON with the following structure:
            {
                "job_type": "video_editor|tiktok_creator|operations_manager|other",
                "experience_level": "entry|mid|senior|executive",
                "work_type": "full_time|part_time|contract|freelance",
                "location_preference": "remote|onsite|hybrid|any",
                "urgency": "low|medium|high",
                "key_skills": ["skill1", "skill2", "skill3"],
                "company_culture": "startup|corporate|creative|traditional",
                "confidence": 0.0-1.0
            }"""),
            ("human", "Analyze this job requirement: {query}")
        ])
        
        chain = LLMChain(llm=self.llm, prompt=analysis_prompt)
        
        try:
            result = chain.run(query=query)
            # Parse JSON from result
            if isinstance(result, str):
                # Try to extract JSON from the response
                start_idx = result.find('{')
                end_idx = result.rfind('}') + 1
                if start_idx != -1 and end_idx != 0:
                    json_str = result[start_idx:end_idx]
                    return json.loads(json_str)
            return result
        except Exception as e:
            logging.error(f"Error analyzing job requirements: {e}")
            return {
                "job_type": "other",
                "experience_level": "mid",
                "work_type": "full_time",
                "location_preference": "any",
                "urgency": "medium",
                "key_skills": [],
                "company_culture": "traditional",
                "confidence": 0.5
            }

    def generate_chat_response(self, query: str, candidates: List[Dict]) -> str:
        """Generate contextual chat response using LangChain"""
        
        # Analyze job requirements
        analysis = self.analyze_job_requirements(query)
        
        # Prepare candidate information
        candidate_info = ""
        for candidate in candidates[:3]:  # Top 3 candidates
            candidate_info += f"""
            Candidate #{candidate['rank']}: {candidate['name']}
            Location: {candidate['location']}
            Skills: {candidate['skills']}
            Match Score: {candidate['score']:.1%}
            Bio: {candidate['bio'][:200]}...
            """
        
        # Create response prompt
        response_prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", """Based on the user's query and the candidate information, provide a helpful, contextual response.

User Query: {query}

Job Analysis:
- Job Type: {job_type}
- Experience Level: {experience_level}
- Work Type: {work_type}
- Location Preference: {location_preference}
- Urgency: {urgency}
- Key Skills: {key_skills}
- Company Culture: {company_culture}

Top Candidates:
{candidate_info}

Provide a natural, conversational response that:
1. Acknowledges their specific requirements
2. Highlights the best candidates with relevant details
3. Suggests follow-up questions or refinements
4. Uses appropriate emojis and formatting
5. Shows understanding of their context and urgency

Keep the response engaging and helpful, around 2-3 sentences for the main response plus candidate highlights.""")
        ])
        
        chain = LLMChain(llm=self.llm, prompt=response_prompt)
        
        try:
            response = chain.run(
                query=query,
                job_type=analysis.get('job_type', 'other'),
                experience_level=analysis.get('experience_level', 'mid'),
                work_type=analysis.get('work_type', 'full_time'),
                location_preference=analysis.get('location_preference', 'any'),
                urgency=analysis.get('urgency', 'medium'),
                key_skills=', '.join(analysis.get('key_skills', [])),
                company_culture=analysis.get('company_culture', 'traditional'),
                candidate_info=candidate_info
            )
            return response.strip()
        except Exception as e:
            logging.error(f"Error generating chat response: {e}")
            return self.generate_fallback_response(query, candidates)

    def generate_fallback_response(self, query: str, candidates: List[Dict]) -> str:
        """Generate a fallback response if LangChain fails"""
        if not candidates:
            return "I'm sorry, I couldn't find any suitable candidates for your requirements. Could you please try rephrasing your request or provide more specific details about the role you're looking for?"
        
        top_candidate = candidates[0]
        return f"Based on your request for '{query}', I found {top_candidate['name']} as your top match with a {top_candidate['score']:.1%} match score. They're located in {top_candidate['location']} and have experience in {top_candidate['skills']}. Would you like me to provide more details about their background or help you refine your search criteria?"

    def process_chat_message(self, message: str) -> Dict[str, Any]:
        """Process a chat message and return response with candidates"""
        try:
            logging.info(f"Processing chat message: {message}")
            
            # Find relevant candidates
            candidates = self.find_relevant_candidates(message, top_k=5)
            logging.info(f"Found {len(candidates)} relevant candidates")
            
            # Generate AI response
            ai_response = self.generate_chat_response(message, candidates)
            logging.info(f"Generated AI response: {ai_response[:100]}...")
            
            return {
                'message': ai_response,
                'candidates': candidates,
                'success': True
            }
        except Exception as e:
            logging.error(f"Error processing chat message: {e}")
            return {
                'message': f"I'm sorry, I encountered an error processing your request: {str(e)}. Please try again.",
                'candidates': [],
                'success': False
            } 