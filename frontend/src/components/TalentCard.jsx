import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, DollarSign, Eye, Star } from 'lucide-react';
import { cn } from '../utils/cn';

const TalentCard = ({ talent, rank }) => {
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score) => {
    const normalizedScore = Math.min(score, 1.0);
    if (normalizedScore >= 0.8) return 'text-green-600 bg-green-100';
    if (normalizedScore >= 0.6) return 'text-blue-600 bg-blue-100';
    if (normalizedScore >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    const normalizedScore = Math.min(score, 1.0);
    if (normalizedScore >= 0.8) return 'Excellent';
    if (normalizedScore >= 0.6) return 'Good';
    if (normalizedScore >= 0.4) return 'Fair';
    return 'Poor';
  };

  const formatRate = (monthlyRate, hourlyRate) => {
    if (monthlyRate && monthlyRate > 0) {
      return `$${monthlyRate}/month`;
    }
    if (hourlyRate && hourlyRate > 0) {
      return `$${hourlyRate}/hour`;
    }
    return 'Rate not specified';
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-dataslush-orange font-semibold text-sm">#{rank}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {talent['First Name'] && talent['Last Name'] 
                ? `${talent['First Name']} ${talent['Last Name']}` 
                : 'Unknown'
              }
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <MapPin className="h-3 w-3" />
              <span>
                {talent.City && talent.Country 
                  ? `${talent.City}, ${talent.Country}` 
                  : talent.City || talent.Country || 'Location not specified'
                }
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={cn("badge", getScoreColor(talent.final_score || talent.score))}>
            <Star className="h-3 w-3 mr-1" />
            {getScoreLabel(talent.final_score || talent.score)}
          </div>
          <div className="text-sm font-medium text-gray-900 mt-1">
            {Math.min(((talent.final_score || talent.score || 0) * 100), 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {expanded ? talent['Profile Description'] : truncateText(talent['Profile Description'], 120)}
        </p>
      </div>

      {/* Key Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">
            {formatRate(talent['Monthly Rate'], talent['Hourly Rate'])}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Eye className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">
            {talent['# of Views by Creators'] && talent['# of Views by Creators'] > 0 
              ? `${talent['# of Views by Creators'].toLocaleString()} views` 
              : 'No view data'
            }
          </span>
        </div>
      </div>

      {/* Job Types */}
      {talent['Job Types'] && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Job Types</h4>
          <div className="flex flex-wrap gap-1">
            {talent['Job Types'].split(',').slice(0, 3).map((type, index) => (
              <span key={index} className="badge badge-blue text-xs">
                {type.trim()}
              </span>
            ))}
            {talent['Job Types'].split(',').length > 3 && (
              <span className="badge badge-gray text-xs">
                +{talent['Job Types'].split(',').length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Expandable Details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center space-x-1 text-sm text-dataslush-orange hover:text-orange-600 py-2 border-t border-gray-100"
      >
        <span>{expanded ? 'Show Less' : 'Show More Details'}</span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          {/* Skills */}
          {talent.Skills && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {talent.Skills.split(',').map((skill, index) => (
                  <span key={index} className="badge badge-green text-xs">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Software */}
          {talent.Software && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Software</h4>
              <div className="flex flex-wrap gap-1">
                {talent.Software.split(',').map((software, index) => (
                  <span key={index} className="badge badge-purple text-xs">
                    {software.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content Verticals */}
          {talent['Content verticals'] && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Content Verticals</h4>
              <div className="flex flex-wrap gap-1">
                {talent['Content verticals'].split(',').map((vertical, index) => (
                  <span key={index} className="badge badge-yellow text-xs">
                    {vertical.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Creative Styles */}
          {talent['Creative styles'] && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Creative Styles</h4>
              <div className="flex flex-wrap gap-1">
                {talent['Creative styles'].split(',').map((style, index) => (
                  <span key={index} className="badge badge-gray text-xs">
                    {style.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Platforms */}
          {talent.Platforms && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Platforms</h4>
              <div className="flex flex-wrap gap-1">
                {talent.Platforms.split(',').map((platform, index) => (
                  <span key={index} className="badge badge-blue text-xs">
                    {platform.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Past Creators */}
          {talent['Past creators'] && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Past Creators</h4>
              <div className="flex flex-wrap gap-1">
                {talent['Past creators'].split(',').map((creator, index) => (
                  <span key={index} className="badge badge-green text-xs">
                    {creator.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TalentCard; 