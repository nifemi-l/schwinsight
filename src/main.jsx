import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SchwinsightDemo from "./components/schwinsightdemo.jsx";
import TicketPage from "./components/ticketpage.jsx";
import VideoPage from "./components/videopage.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SchwinsightDemo />} />
        <Route path="/ticket/:id" element={<TicketPage />} />
        <Route path="/video" element={<VideoPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
); 