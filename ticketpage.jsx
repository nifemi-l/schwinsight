import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
import { allData } from './data.js';

// Simple expletive censor (demo)
export const censorExpletives = (text) =>
  text.replace(/\b(fudge|crud|darn|heck|shoot|dang|gosh|drat|crud|blimey|shucks|rats|phooey|baloney|bullocks|jeez|golly|gee)\b/gi, '****');

const TicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [censor, setCensor] = useState(true);

  // Find the ticket
  const ticket = allData.find((item) => item.id === id);
  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Ticket Not Found</h2>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Go Back</button>
        </div>
      </div>
    );
  }

  // Redact user info
  let redactedSource = ticket.source;
  if (redactedSource.includes('Reddit')) redactedSource = 'Reddit User';
  else if (redactedSource.includes('Twitter') || redactedSource.includes('X')) redactedSource = 'X User';
  else if (redactedSource.includes('Facebook')) redactedSource = 'Facebook User';
  else if (redactedSource.includes('Quora')) redactedSource = 'Quora User';
  else if (redactedSource.includes('Employee')) redactedSource = 'Employee';

  // Determine main site link from source
  let mainSite = null;
  if (/Reddit/i.test(ticket.source)) mainSite = 'https://reddit.com';
  else if (/Twitter|X/i.test(ticket.source)) mainSite = 'https://twitter.com';
  else if (/Facebook/i.test(ticket.source)) mainSite = 'https://facebook.com';
  else if (/Quora/i.test(ticket.source)) mainSite = 'https://quora.com';

  // Use ticket.title if available, else fallback to titleSummary
  const displayTitle = ticket.title || ticket.titleSummary;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#009DDB] to-[#33B9E6] p-2 sm:p-4 md:p-20">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 md:p-20 max-w-full sm:max-w-2xl md:max-w-5xl w-full mx-0 sm:mx-2 md:mx-auto border-2 border-blue-200 relative transition-all duration-300">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-blue-700 mb-6 sm:mb-10 text-left tracking-tight">Feedback Ticket</h1>
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => navigate(-1)} className="px-3 py-2 sm:px-5 sm:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center gap-2 text-base sm:text-lg font-semibold shadow-sm transition-colors"><ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" /> Back</button>
          <button className="px-3 py-2 sm:px-5 sm:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center gap-2 text-base sm:text-lg font-semibold shadow-sm transition-colors"><Download className="h-5 w-5 sm:h-6 sm:w-6" /> Export</button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-8 mb-6 sm:mb-8 md:grid-cols-2">
          <div>
            <div className="mb-2 sm:mb-3 text-xs sm:text-sm text-gray-500">Ticket ID: <span className="font-semibold text-gray-700">{ticket.id}</span></div>
            <div className="mb-2 sm:mb-3 text-base sm:text-lg text-gray-600">Digital Product: <span className="font-semibold">{ticket.digitalOffering}</span></div>
            <div className="mb-2 sm:mb-3 text-base sm:text-lg text-gray-600">Department: <span className="font-semibold">{ticket.department}</span></div>
            <div className="mb-2 sm:mb-3 text-base sm:text-lg text-gray-600">Date: <span className="font-semibold">{ticket.dateAdded}</span></div>
          </div>
          <div>
            <div className="mb-2 sm:mb-3 text-base sm:text-lg text-gray-600">Source (Redacted): <span className="font-semibold">{redactedSource}</span></div>
            <div className="mb-2 sm:mb-3 text-base sm:text-lg text-gray-600">Source (Original): {mainSite ? (
              <a href={mainSite} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{ticket.source.split(' - ')[0]}</a>
            ) : (
              <span className="font-semibold">{ticket.source}</span>
            )}</div>
          </div>
        </div>
        <div className="mb-4 sm:mb-8 text-xl sm:text-3xl font-bold text-gray-800 leading-snug text-left">{displayTitle}</div>
        <div className="mb-4 sm:mb-8 text-base sm:text-xl text-gray-700 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-inner min-h-[120px] sm:min-h-[160px] text-left">
          {censor ? censorExpletives(ticket.rawContent) : ticket.rawContent}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 justify-center mt-4 sm:mt-6">
          <label className="flex items-center gap-1 sm:gap-2 text-base sm:text-lg">
            <input type="checkbox" checked={censor} onChange={() => setCensor((v) => !v)} className="h-4 w-4 sm:h-5 sm:w-5" />
            Censor expletives
          </label>
        </div>
      </div>
    </div>
  );
};

export default TicketPage; 