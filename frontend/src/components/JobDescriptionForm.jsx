import React, { useState } from 'react';
import { Search, Settings, Sparkles } from 'lucide-react';

const JobDescriptionForm = ({ onSubmit, loading }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [topK, setTopK] = useState(10);
  const [useWeighted, setUseWeighted] = useState(false);
  const [weights, setWeights] = useState({
    bio: 0.5,
    skills: 0.2,
    software: 0.2,
    location: 0.1,
  });

  const presetJobs = [
    {
      title: "Video Editor - Entertainment/Lifestyle",
      description: "Looking for a talented Video Editor with experience in Adobe Premiere Pro who can edit content in Entertainment/Lifestyle & Vlogs categories. Required skills: Splice & Dice, Rough Cut & Sequencing, 2D Animation. Budget: $2500/month. Open to all locations but preference for Asia.",
    },
    {
      title: "Producer/Video Editor - Education/Food",
      description: "Hiring a Producer/Video Editor based in New York (1st priority) or remote from the US to help scale channel in Entertainment/Education/Food & Cooking vertical. Deep experience in TikTok required. Skills: Storyboarding, Sound Designing, Rough Cut & Sequencing, Filming. Budget: $100-150/hour. Prefer female candidates.",
    },
    {
      title: "Chief Operations Officer - Productivity",
      description: "Hiring a Chief Operation Officer to run channel in productivity. Background in Strategy & Consulting, Business operations or Development. Needs high energy and passion for educational content. No budget limitation. Willing to hire the best talent for the role.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestData = {
      jobDescription,
      topK,
      useWeighted,
      weights: useWeighted ? weights : null,
    };
    onSubmit(requestData);
  };

  const handlePresetJob = (description) => {
    setJobDescription(description);
  };

  const handleWeightChange = (key, value) => {
    setWeights(prev => ({
      ...prev,
      [key]: parseFloat(value)
    }));
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Search className="h-5 w-5 text-dataslush-orange" />
        <h2 className="text-xl font-semibold text-gray-900">Find Your Perfect Talent Match</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Description */}
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Describe the role, required skills, experience level, and any specific requirements..."
            className="input-field h-32 resize-none"
            required
          />
        </div>

        {/* Quick Start - Sample Jobs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Start - Sample Jobs
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {presetJobs.map((job, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePresetJob(job.description)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                <h4 className="font-medium text-sm text-gray-900 mb-1">{job.title}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{job.description.substring(0, 100)}...</p>
              </button>
            ))}
          </div>
        </div>

        {/* Top K and Weighted Scoring */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="topK" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Recommendations
            </label>
            <select
              id="topK"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="input-field"
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={20}>Top 20</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="useWeighted"
              checked={useWeighted}
              onChange={(e) => setUseWeighted(e.target.checked)}
              className="h-4 w-4 text-dataslush-orange focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="useWeighted" className="flex items-center text-sm font-medium text-gray-700">
              <Settings className="h-4 w-4 mr-2" />
              Use Weighted Scoring
            </label>
          </div>
        </div>

        {/* Weighted Scoring Options */}
        {useWeighted && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-4 w-4 text-dataslush-orange" />
              <h3 className="text-sm font-medium text-gray-900">Scoring Weights</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(weights).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                    {key}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={value}
                    onChange={(e) => handleWeightChange(key, e.target.value)}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !jobDescription.trim()}
          className="bg-dataslush-orange hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Finding Matches...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Find Talent Matches</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default JobDescriptionForm; 