// src/pages/AllTicketsPage.jsx   (or wherever the file lives)
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_POS_API; // <-- .env  VITE_POS_API=https://vercel-mr-clement-pos-backend.vercel.app

/**
 * Helper – builds an axios instance that automatically adds the Bearer token
 */
const api = axios.create({
  baseURL: API_BASE,
  timeout: 12_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pos_token"); // <-- same key used by login
  console.log("asa",token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Component ---------------------------------------------------------------
 */
const AllTicketsPage = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------------------------
  // 1. Fetch ticket types on mount
  // --------------------------------------------------------------------
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const { data } = await api.get(
          "/api/restaurant/support_ticket_type/getbyauth"
        );
        // API usually returns an array – safeguard just in case
        setTicketTypes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load support ticket types"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  // --------------------------------------------------------------------
  // 2. Render
  // --------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center py-4 w-full">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading ticket types…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-4 w-full">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start py-4 w-full max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Support Ticket Types
      </h2>

      {ticketTypes.length > 0 ? (
        ticketTypes.map((type, idx) => (
          <TicketListItem
            key={type.id}
            ticketId={type.id}
            status={type.status ?? "—"}          // adjust fields to your API response
            title={type.name ?? type.title ?? "Untitled"}
            description={type.description ?? ""}
            userName={type.created_by ?? "System"}
            isFirst={idx === 0}
          />
        ))
      ) : (
        <p className="text-center w-full text-gray-600 text-lg">
          No ticket types found.
        </p>
      )}
    </div>
  );
};

export default AllTicketsPage;