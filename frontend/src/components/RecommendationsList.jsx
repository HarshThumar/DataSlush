import React, { useState, useMemo } from 'react';
import { Filter, SortAsc, SortDesc, Users, TrendingUp, Target } from 'lucide-react';
import TalentCard from './TalentCard';

const RecommendationsList = ({ recommendations, currentRequest }) => {
  const [filters, setFilters] = useState({
    location: '',
    minScore: 0,
    maxRate: '',
    jobType: '',
  });
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredAndSortedRecommendations = useMemo(() => {
    let filtered = recommendations || [];

    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(talent => {
        const location = talent.City || talent.Country || '';
        return location.toLowerCase().includes(filters.location.toLowerCase());
      });
    }

    if (filters.minScore > 0) {
      filtered = filtered.filter(talent => Math.min((talent.final_score || talent.score || 0), 1.0) >= filters.minScore);
    }

    if (filters.maxRate) {
      filtered = filtered.filter(talent => {
        const rate = talent['Monthly Rate'] || talent['Hourly Rate'] || 0;
        return rate <= parseFloat(filters.maxRate);
      });
    }

    if (filters.jobType) {
      filtered = filtered.filter(talent => 
        talent['Job Types'] && talent['Job Types'].toLowerCase().includes(filters.jobType.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'score':
          aValue = Math.min((a.final_score || a.score || 0), 1.0);
          bValue = Math.min((b.final_score || b.score || 0), 1.0);
          break;
        case 'rate':
          aValue = a['Monthly Rate'] || a['Hourly Rate'] || 0;
          bValue = b['Monthly Rate'] || b['Hourly Rate'] || 0;
          break;
        case 'views':
          aValue = a['# of Views by Creators'] || 0;
          bValue = b['# of Views by Creators'] || 0;
          break;
        case 'name':
          aValue = `${a['First Name'] || ''} ${a['Last Name'] || ''}`;
          bValue = `${b['First Name'] || ''} ${b['Last Name'] || ''}`;
          break;
        default:
          aValue = a.final_score || a.score || 0;
          bValue = b.final_score || b.score || 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [recommendations, filters, sortBy, sortOrder]);

  const stats = useMemo(() => {
    if (!recommendations || recommendations.length === 0) return null;

    const totalMatches = recommendations.length;
    const averageScore = recommendations.reduce((sum, talent) => sum + Math.min((talent.final_score || talent.score || 0), 1.0), 0) / totalMatches;
    
    const scoreDistribution = {
      excellent: recommendations.filter(t => Math.min((t.final_score || t.score || 0), 1.0) >= 0.8).length,
      good: recommendations.filter(t => {
        const score = Math.min((t.final_score || t.score || 0), 1.0);
        return score >= 0.6 && score < 0.8;
      }).length,
      fair: recommendations.filter(t => {
        const score = Math.min((t.final_score || t.score || 0), 1.0);
        return score >= 0.4 && score < 0.6;
      }).length,
      poor: recommendations.filter(t => Math.min((t.final_score || t.score || 0), 1.0) < 0.4).length,
    };

    return { totalMatches, averageScore, scoreDistribution };
  }, [recommendations]);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
        <p className="text-gray-500">Enter a job description above to find matching talent.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
                         <Target className="h-5 w-5 text-dataslush-orange" />
            <h2 className="text-xl font-semibold text-gray-900">
              Top {currentRequest?.topK || recommendations.length} Recommendations
            </h2>
          </div>
          <div className="text-sm text-gray-500">
            {filteredAndSortedRecommendations.length} of {recommendations.length} results
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                         <div className="text-center">
               <div className="text-2xl font-bold text-dataslush-orange">{stats.totalMatches}</div>
               <div className="text-sm text-gray-500">Total Matches</div>
             </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(stats.averageScore * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.scoreDistribution.excellent}</div>
              <div className="text-sm text-gray-500">Excellent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.scoreDistribution.good}</div>
              <div className="text-sm text-gray-500">Good</div>
            </div>
          </div>
        )}

        {/* Active Weights Display */}
        {currentRequest?.useWeighted && currentRequest?.weights && (
                     <div className="mb-4 p-3 bg-orange-50 rounded-lg">
             <h4 className="text-sm font-medium text-orange-900 mb-2">Active Scoring Weights</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(currentRequest.weights).map(([key, value]) => (
                <span key={key} className="badge badge-blue text-xs">
                  {key}: {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Sorting */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by location..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="input-field w-40 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min score (0-1)"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.minScore}
                  onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseFloat(e.target.value) || 0 }))}
                  className="input-field w-32 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Max rate ($)"
                  value={filters.maxRate}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxRate: e.target.value }))}
                  className="input-field w-32 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Filter by job type..."
                  value={filters.jobType}
                  onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                  className="input-field w-40 text-sm"
                />
              </div>
            </div>

            {/* Sorting */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-32 text-sm"
              >
                <option value="score">Score</option>
                <option value="rate">Rate</option>
                <option value="views">Views</option>
                <option value="name">Name</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filteredAndSortedRecommendations.length === 0 ? (
        <div className="text-center py-8">
          <Filter className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No results match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedRecommendations.map((talent, index) => (
            <TalentCard
              key={`${talent.Name}-${index}`}
              talent={talent}
              rank={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsList; 