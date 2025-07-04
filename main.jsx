import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SchwinsightDemo from './schwinsightdemo.jsx';
import TicketPage from './ticketpage.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SchwinsightDemo />} />
        <Route path="/ticket/:id" element={<TicketPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
); 