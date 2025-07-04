import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, CheckSquare, Square, MessageSquare, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { allData } from './data.js';
// Import the censorExpletives function from ticketpage.jsx
import { censorExpletives } from './ticketpage.jsx';

const SchwinsightDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSearchedTerm, setLastSearchedTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [summaryType, setSummaryType] = useState('');
  const [searchResults, setSearchResults] = useState(allData);
  const [isLoading, setIsLoading] = useState(false);
  // Add state for sorting/filtering
  const [sortOption, setSortOption] = useState('newest');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [showSummaryDropdown, setShowSummaryDropdown] = useState(false);
  // Add state for showing filters modal/dropdown
  const [showFilters, setShowFilters] = useState(false);
  // Add state for showing summarize modal/dropdown
  const [showSummarize, setShowSummarize] = useState(false);
  // Add state for digital product filter
  const [digitalProductFilter, setDigitalProductFilter] = useState('All');
  // Get unique digital offerings for dropdown
  const digitalProducts = Array.from(new Set(allData.map(item => item.digitalOffering)));

  const navigate = useNavigate();

  // Add a function to reset all filters, search, and pagination
  const resetToHome = () => {
    setSearchTerm('');
    setLastSearchedTerm('');
    setDepartmentFilter('All');
    setDigitalProductFilter('All');
    setSortOption('newest');
    setCurrentPage(1);
    setSearchResults(allData);
  };

  // Search functionality with pre-parameterized queries
  const handleSearch = () => {
    setIsLoading(true);
    setCurrentPage(1);
    setLastSearchedTerm(searchTerm);
    
    setTimeout(() => {
      let results = [];
      
      if (searchTerm.toLowerCase().includes('bond')) {
        results = allData.filter(item => 
          item.digitalOffering.toLowerCase().includes('bond') ||
          item.rawContent.toLowerCase().includes('bond')
        );
      } else if (searchTerm.toLowerCase().includes('mobile') || searchTerm.toLowerCase().includes('app')) {
        results = allData.filter(item => 
          item.digitalOffering.toLowerCase().includes('mobile') ||
          item.digitalOffering.toLowerCase().includes('app') ||
          item.rawContent.toLowerCase().includes('mobile') ||
          item.rawContent.toLowerCase().includes('app')
        );
      } else if (searchTerm.toLowerCase().includes('schwab.com') || searchTerm.toLowerCase().includes('website')) {
        results = allData.filter(item => 
          item.digitalOffering.toLowerCase().includes('schwab.com') ||
          item.rawContent.toLowerCase().includes('website')
        );
      } else if (searchTerm.toLowerCase().includes('trading')) {
        results = allData.filter(item => 
          item.digitalOffering.toLowerCase().includes('trading') ||
          item.rawContent.toLowerCase().includes('trading')
        );
      } else if (searchTerm.toLowerCase().includes('tech')) {
        results = allData.filter(item => item.department === 'Tech Team');
      } else if (searchTerm.toLowerCase().includes('design')) {
        results = allData.filter(item => item.department === 'Design Team');
      } else if (searchTerm.toLowerCase().includes('marketing')) {
        results = allData.filter(item => item.department === 'Marketing Team');
      } else if (searchTerm === '') {
        results = allData;
      } else {
        results = allData.filter(item => 
          item.rawContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.digitalOffering.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.titleSummary.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setSearchResults(results);
      setIsLoading(false);
    }, 800);
  };

  // Pagination
  const itemsPerPage = 4;
  // Sorting/filtering logic
  const getFilteredSortedResults = () => {
    let results = [...searchResults];
    if (departmentFilter !== 'All') {
      results = results.filter(item => item.department === departmentFilter);
    }
    if (digitalProductFilter !== 'All') {
      results = results.filter(item => item.digitalOffering === digitalProductFilter);
    }
    if (sortOption === 'newest') {
      results.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (sortOption === 'oldest') {
      results.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    } else if (sortOption === 'popular') {
      results.sort((a, b) => b.id.localeCompare(a.id)); // Simulate popularity
    }
    return results;
  };

  // Use getFilteredSortedResults for pagination
  const filteredSortedResults = getFilteredSortedResults();
  const totalPages = Math.ceil(filteredSortedResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredSortedResults.slice(startIndex, startIndex + itemsPerPage);

  const handleCheckboxChange = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSummary = (type) => {
    setSummaryType(type);
    setShowSummary(true);
  };

  const generateSummary = () => {
    const selectedData = searchResults.filter(item => selectedItems.has(item.id));
    const dataToSummarize = selectedData.length > 0 ? selectedData : currentItems;

    // Helper to get quotes
    const getQuotes = (items, sentiment) => {
      return items
        .filter(item => !sentiment || item.sentiment === sentiment)
        .slice(0, 3)
        .map(item => `"${censorExpletives(item.rawContent)}" — ${item.source}`);
    };

    // Helper to get action items
    const getActionItems = (items, sentiment) => {
      if (sentiment === 'Positive') {
        return [
          'Continue to enhance features that users praise, such as fast execution and security.',
          'Promote positive feedback in marketing materials.',
          'Identify and replicate successful UI/UX patterns across other offerings.'
        ];
      } else if (sentiment === 'Negative') {
        return [
          'Investigate and resolve app crashes and slow performance during peak hours.',
          'Simplify navigation and improve charting tools based on user feedback.',
          'Increase transparency in pricing and communication with users.'
        ];
      } else {
        return [
          'Leverage strengths (execution speed, security) as differentiators.',
          'Address recurring pain points (performance, navigation, transparency).',
          'Regularly review user feedback to inform product roadmap.'
        ];
      }
    };

    if (summaryType === 'Positive') {
      const positiveItems = dataToSummarize.filter(item => item.sentiment === 'Positive');
      const quotes = getQuotes(positiveItems, 'Positive');
      const actions = getActionItems(positiveItems, 'Positive');
      return (
        <>
          <div className="mb-2">Positive feedback summary: Customers appreciate fast execution speeds, improved security features, and user-friendly interfaces. Bond trading tools and mobile app authentication are particularly well-received. {positiveItems.length} positive mentions analyzed.</div>
          <div className="mb-2">
            <span className="font-semibold">Relevant Quotes:</span>
            <ul className="list-disc ml-6 text-gray-600">
              {quotes.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
          <div>
            <span className="font-semibold">Potential Action Items:</span>
            <ul className="list-disc ml-6 text-gray-600">
              {actions.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        </>
      );
    } else if (summaryType === 'Negative') {
      const negativeItems = dataToSummarize.filter(item => item.sentiment === 'Negative');
      const quotes = getQuotes(negativeItems, 'Negative');
      const actions = getActionItems(negativeItems, 'Negative');
      return (
        <>
          <div className="mb-2">Negative feedback summary: Main issues include app crashes during market volatility, slow website performance during peak hours, and confusing navigation. Users want better charting tools and more pricing transparency. {negativeItems.length} negative mentions analyzed.</div>
          <div className="mb-2">
            <span className="font-semibold">Relevant Quotes:</span>
            <ul className="list-disc ml-6 text-gray-600">
              {quotes.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
          <div>
            <span className="font-semibold">Potential Action Items:</span>
            <ul className="list-disc ml-6 text-gray-600">
              {actions.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        </>
      );
    } else {
      const quotes = getQuotes(dataToSummarize);
      const actions = getActionItems(dataToSummarize);
      return (
        <>
          <div className="mb-2">Complete feedback summary: Mixed sentiment with {dataToSummarize.filter(i => i.sentiment === 'Positive').length} positive and {dataToSummarize.filter(i => i.sentiment === 'Negative').length} negative mentions. Key strengths include execution speed and security. Areas for improvement include performance during peak times and user interface clarity.</div>
          <div className="mb-2">
            <span className="font-semibold">Relevant Quotes:</span>
            <ul className="list-disc ml-6 text-gray-600">
              {quotes.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
          <div>
            <span className="font-semibold">Potential Action Items:</span>
            <ul className="list-disc ml-6 text-gray-600">
              {actions.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        </>
      );
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#009DDB] to-[#33B9E6] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800 text-center border-b-2 border-[#009DDB]/15 pb-2" style={{ fontFamily: '"Granjon LT Std", "Times New Roman", "Georgia", "Minion Pro", serif', fontStyle: 'italic' }}>Schwinsight</h1>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowSummary(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Results
                </button>
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  title="Export summary"
                  type="button"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {summaryType === 'Positive' ? 'Positive' : summaryType === 'Negative' ? 'Negative' : 'Complete'} Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{generateSummary()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#009DDB] to-[#33B9E6] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Top: Schwinsight logo/title centered on its own row */}
          <div className="flex justify-center mb-2">
            <span
              className="text-3xl font-bold text-gray-800 text-center border-b-2 border-[#009DDB]/15 pb-2 select-none cursor-pointer"
              style={{ fontFamily: '"Granjon LT Std", "Times New Roman", "Georgia", "Minion Pro", serif', fontStyle: 'italic' }}
              onClick={resetToHome}
              tabIndex={0}
              role="link"
              aria-label="Go to Schwinsight home"
            >
              Schwinsight
            </span>
          </div>
          {/* Second row: Summarize and Export buttons, aligned right */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder='Search feedback (e.g. "mobile app", "bond trading", "tech team")'
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              onClick={() => setShowFilters(true)}
            >
              Filters
            </button>
            <button
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              onClick={() => setShowSummarize(true)}
            >
              Summarize
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>

          {/* Filters modal/dropdown */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-3xl font-bold w-10 h-10 flex items-center justify-center cursor-pointer transition-transform hover:scale-110" onClick={() => setShowFilters(false)}>&times;</button>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Sort By</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
                    value={sortOption}
                    onChange={e => setSortOption(e.target.value)}
                  >
                    <option value="newest">Chronological (Newest First)</option>
                    <option value="oldest">Chronological (Oldest First)</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Department</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
                    value={departmentFilter}
                    onChange={e => setDepartmentFilter(e.target.value)}
                  >
                    <option value="All">All Departments</option>
                    <option value="Tech Team">Tech Team</option>
                    <option value="Design Team">Design Team</option>
                    <option value="Finance Team">Finance Team</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Product Team">Product Team</option>
                    <option value="Operations Team">Operations Team</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Digital Product</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
                    value={digitalProductFilter}
                    onChange={e => setDigitalProductFilter(e.target.value)}
                  >
                    <option value="All">All Products</option>
                    {digitalProducts.map(product => (
                      <option key={product} value={product}>{product}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Summarize modal/dropdown */}
          {showSummarize && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-3xl font-bold w-10 h-10 flex items-center justify-center cursor-pointer transition-transform hover:scale-110" onClick={() => setShowSummarize(false)}>&times;</button>
                <div className="mb-2 font-semibold text-lg text-gray-800">Summarize</div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { handleSummary('Positive'); setShowSummarize(false); }} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">Positive</button>
                  <button onClick={() => { handleSummary('Negative'); setShowSummarize(false); }} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">Negative</button>
                  <button onClick={() => { handleSummary('all'); setShowSummarize(false); }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">All</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Showing results for "{lastSearchedTerm || 'all feedback'}"{digitalProductFilter !== 'All' ? ` for ${digitalProductFilter}` : ''}{departmentFilter !== 'All' ? ` in ${departmentFilter}` : ''} ({filteredSortedResults.length} total)
                </h2>
              </div>

              <div className="space-y-4">
                {currentItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <button 
                          onClick={() => handleCheckboxChange(item.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedItems.has(item.id) ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {item.digitalOffering}
                          </span>
                          <span className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            {item.department}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 mb-2">{item.titleSummary}</h3>
                        <p className="text-gray-600 mb-3">{censorExpletives(item.rawContent)}</p>
                        
                        <div className="flex items-center justify-between">
                          {/* Source section: clickable, hoverable */}
                          <button
                            className="flex items-center gap-2 text-sm text-gray-500 hover:bg-[#005999] hover:text-white px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onClick={() => navigate(`/ticket/${item.id}`)}
                            title="View full ticket"
                            tabIndex={0}
                            type="button"
                          >
                            {item.source.includes('Employee') ? (
                              <MessageSquare className="h-4 w-4" />
                            ) : (
                              <Globe className="h-4 w-4" />
                            )}
                            <span>{item.source}</span>
                          </button>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              item.sentiment === 'Positive' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.sentiment}
                            </span>
                            <span className="text-xs text-gray-500">{item.dateAdded}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchwinsightDemo;