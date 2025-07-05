import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
import { allData } from '../data/data.js';
import { censorExpletives } from '../utils/censor.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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



  const handleExport = () => {
    // Create a temporary div to render the content for PDF generation
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    tempDiv.style.padding = '20px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '12px';
    tempDiv.style.lineHeight = '1.4';
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const redactSource = (source) => {
      if (source.includes('Reddit')) return 'Reddit User';
      if (source.includes('Twitter') || source.includes('X')) return 'X User';
      if (source.includes('Facebook')) return 'Facebook User';
      if (source.includes('Quora')) return 'Quora User';
      if (source.includes('Employee')) return 'Employee';
      return source;
    };

    // Generate the HTML content for PDF
    tempDiv.innerHTML = `
      <div style="text-align: center; border-bottom: 2px solid #005999; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="color: #005999; font-size: 24px; margin: 0 0 5px 0; font-weight: bold;">SchwabInsight Feedback Ticket</h1>
        <p style="color: #666; font-size: 14px; margin: 0;">Individual Feedback Report</p>
      </div>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 3px solid #005999;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="margin-bottom: 8px;">
            <div style="font-weight: 600; color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Ticket ID</div>
            <div style="font-size: 13px; color: #333; margin-top: 2px;">${ticket.id}</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="font-weight: 600; color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Date Added</div>
            <div style="font-size: 13px; color: #333; margin-top: 2px;">${formatDate(ticket.dateAdded)}</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="font-weight: 600; color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Digital Product</div>
            <div style="font-size: 13px; color: #333; margin-top: 2px;">${ticket.digitalOffering}</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="font-weight: 600; color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Department</div>
            <div style="font-size: 13px; color: #333; margin-top: 2px;">${ticket.department}</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="font-weight: 600; color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Source (Redacted)</div>
            <div style="font-size: 13px; color: #333; margin-top: 2px;">${redactSource(ticket.source)}</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="font-weight: 600; color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Sentiment</div>
            <div style="font-size: 13px; color: #333; margin-top: 2px;">
              <span style="display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: bold; text-transform: uppercase; background: ${ticket.sentiment === 'Positive' ? '#d4edda' : '#f8d7da'}; color: ${ticket.sentiment === 'Positive' ? '#155724' : '#721c24'};">${ticket.sentiment}</span>
            </div>
          </div>
        </div>
      </div>

      <div style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 25px 0 15px 0; line-height: 1.3; padding-bottom: 10px; border-bottom: 1px solid #e0e0e0;">${ticket.titleSummary}</div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 3px solid #005999; margin: 20px 0; font-style: italic; color: #555; line-height: 1.5; font-size: 13px;">${censorExpletives(ticket.rawContent)}</div>

      <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; color: #666; font-size: 11px;">
        <p style="margin: 3px 0;"><strong>Export Date:</strong> ${formatDate(new Date())}</p>
        <p style="margin: 3px 0;"><strong>Original Source:</strong> ${ticket.source}</p>
      </div>
    `;

    document.body.appendChild(tempDiv);

    // Generate PDF
    html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`schwabinsight-ticket-${ticket.id}-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.removeChild(tempDiv);
    });
  };

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
          <button 
            onClick={handleExport}
            className="px-3 py-2 sm:px-5 sm:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center gap-2 text-base sm:text-lg font-semibold shadow-sm transition-colors"
          >
            <Download className="h-5 w-5 sm:h-6 sm:w-6" /> Export
          </button>
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