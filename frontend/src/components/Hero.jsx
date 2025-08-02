import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Users, TrendingUp } from 'lucide-react';


const Hero = ({ onSearchClick }) => {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms analyze skills, experience, and cultural fit for optimal matches.',
    },
    {
      icon: Target,
      title: 'Precise Recommendations',
      description: 'Get the top 10 candidates ranked by relevance and compatibility scores.',
    },
    {
      icon: TrendingUp,
      title: 'Lightning Fast',
      description: 'Instant results with our optimized vector search and pre-computed embeddings.',
    },
    {
      icon: Users,
      title: '500+ Talent Profiles',
      description: 'Comprehensive database of verified creative professionals across all skill levels.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Talent Profiles' },
    { value: '95%', label: 'Match Accuracy' },
    { value: '<2s', label: 'Response Time' },
  ];

  return (
    <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Find Your Perfect
            <span className="text-dataslush-orange block">Creative Talent</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Streamline your hiring process with AI-powered talent matching. 
            Discover top creative professionals based on skills, experience, and cultural fit.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              className="btn-primary text-lg px-8 py-3 flex items-center space-x-2"
              onClick={onSearchClick}
            >
              <span>Start Matching Now</span>
            </button>
            <button className="btn-secondary text-lg px-8 py-3">
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-dataslush-orange" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 