import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import JobDescriptionForm from './components/JobDescriptionForm';
import RecommendationsList from './components/RecommendationsList';
import Footer from './components/Footer';
import ChatInterface from './components/ChatInterface';
import { recommendationAPI } from './services/api';

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const scrollToRecommendation = () => {
    const element = document.getElementById('recommendation');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleSubmit = async (requestData) => {
    setLoading(true);
    setCurrentRequest(requestData);

    try {
      let response;
      
      if (requestData.useWeighted) {
        response = await recommendationAPI.getWeightedRecommendation(
          requestData.jobDescription,
          requestData.weights,
          requestData.topK
        );
      } else {
        response = await recommendationAPI.getBasicRecommendation(
          requestData.jobDescription,
          requestData.topK
        );
      }

      setRecommendations(response.results || []);
      
      toast.success(
        `Found ${response.results?.length || 0} talent matches!`,
        {
          duration: 4000,
          position: 'top-right',
        }
      );
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      
      toast.error(
        error.response?.data?.detail || 'Failed to fetch recommendations. Please try again.',
        {
          duration: 5000,
          position: 'top-right',
        }
      );
      
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Header />
      <main>
        <Hero onSearchClick={scrollToRecommendation} />
        <section className="py-12" id='recommendation'>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <JobDescriptionForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RecommendationsList 
              recommendations={recommendations} 
              currentRequest={currentRequest}
            />
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Floating Chat Button */}
      <button 
        className="floating-chat-button"
        onClick={() => setShowChat(true)}
        title="Chat with AI Assistant"
      >
        💬
      </button>

      {/* Chat Modal */}
      {showChat && (
        <div className="chat-modal" onClick={() => setShowChat(false)}>
          <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
            <ChatInterface onClose={() => setShowChat(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 