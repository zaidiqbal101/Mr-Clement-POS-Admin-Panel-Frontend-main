import React, { useState, useEffect } from 'react';
import withAdminLayout from '../AdminPanel/withAdminLayout';
import { getAuthToken } from '../../utils/auth';
import { Search, RefreshCw, Plus, Edit2, Trash2, X } from 'lucide-react';

const SupportsPage = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTicketTypes();
  }, []);

  const fetchTicketTypes = async () => {
    let token = getAuthToken();
    
    if (!token) {
      console.warn('No token found in storage. Using temporary hardcoded token.');
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjAyNTRmM2E5YmVhZTU5MjAyZWFkMSIsInVzZXJfaWQiOjEsImVtYWlsIjoicGF5YWthbnB1ckBnbWFpbC5jb20iLCJyb2xlIjoxLCJpYXQiOjE3NjI2MDA3MjEsImV4cCI6MTc2MjY4NzEyMX0.F3Xxt7bYRsN89Ly4c7CpWuM93TzvvvcYKvk1WLeC8s4';
    }

    try {
      setLoading(true);
      setError('');

      console.log('Fetching support ticket types...');

      const response = await fetch(
        'https://vercel-mr-clement-pos-backend.vercel.app/api/restaurant/support_ticket_type/getbyauth',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please login again.');
          setLoading(false);
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch ticket types');
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (result.success && Array.isArray(result.data)) {
        setTicketTypes(result.data);
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (err) {
      console.error('Error fetching ticket types:', err);
      setError(err.message || 'Failed to load ticket types. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketById = async (ticketId) => {
    let token = getAuthToken();
    
    if (!token) {
      console.warn('No token found in storage. Using temporary hardcoded token.');
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjAyNTRmM2E5YmVhZTU5MjAyZWFkMSIsInVzZXJfaWQiOjEsImVtYWlsIjoicGF5YWthbnB1ckBnbWFpbC5jb20iLCJyb2xlIjoxLCJpYXQiOjE3NjI2MjQwNDgsImV4cCI6MTc2MjcxMDQ0OH0.wP6Wc_E8UzSWZmsp3oHYynYz2gk7KJRlZDhp_JB6IrU';
    }

    try {
      setDetailsLoading(true);

      console.log(`Fetching ticket details for ID: ${ticketId}`);

      const response = await fetch(
        `https://vercel-mr-clement-pos-backend.vercel.app/api/restaurant/support_ticket_type/getbyid/${ticketId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch ticket details');
      }

      const result = await response.json();
      console.log('Ticket Details Response:', result);

      if (result.success && result.data) {
        setSelectedTicket(result.data);
        setShowModal(true);
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      alert('Failed to load ticket details. Please try again.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter ticket types based on search
  const filteredTicketTypes = ticketTypes.filter(ticket =>
    ticket.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.nodes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.CreateBy?.Name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalTickets = ticketTypes.length;
  const activeTickets = ticketTypes.filter(t => t.Status === true).length;
  const inactiveTickets = ticketTypes.filter(t => t.Status === false).length;

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-8 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Ticket Types</h1>
          <p className="text-gray-600 mt-1">Manage your support ticket categories</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchTicketTypes}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-b from-purple-700 to-red-600 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Type
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Types</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalTickets}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Types</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{activeTickets}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Inactive Types</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{inactiveTickets}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {!loading && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search ticket types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <p className="text-gray-600 text-lg">Loading ticket types...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchTicketTypes}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Ticket Types Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTicketTypes.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg mt-4">No ticket types found</p>
            </div>
          ) : (
            filteredTicketTypes.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => fetchTicketById(ticket.support_ticket_type_id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{ticket.Name}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.Status 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ticket.Status ? '● Active' : '● Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit functionality
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Delete functionality
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {ticket.nodes || 'No description available'}
                </p>

                {/* Metadata */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Created by:</span>
                    <span className="font-medium text-gray-900">{ticket.CreateBy?.Name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium text-gray-700 text-xs">{ticket.CreateBy?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium text-gray-700 text-xs">{formatDate(ticket.CreateAt)}</span>
                  </div>
                  {ticket.UpdatedAt !== ticket.CreateAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Updated:</span>
                      <span className="font-medium text-gray-700 text-xs">{formatDate(ticket.UpdatedAt)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="text-gray-500">Ticket ID:</span>
                    <span className="font-mono text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                      #{ticket.support_ticket_type_id}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-red-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedTicket.Name}</h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    selectedTicket.Status 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedTicket.Status ? '● Active' : '● Inactive'}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Description Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedTicket.nodes || 'No description available'}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Ticket Type ID</p>
                  <p className="text-xl font-bold text-blue-600">#{selectedTicket.support_ticket_type_id}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Database ID</p>
                  <p className="text-sm font-mono text-purple-600 break-all">{selectedTicket._id}</p>
                </div>
              </div>

              {/* Creator Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Created By</h3>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-gray-900">{selectedTicket.CreateBy?.Name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-700">{selectedTicket.CreateBy?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User ID:</span>
                    <span className="font-medium text-gray-700">{selectedTicket.CreateBy?.user_id || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Updated By Information */}
              {selectedTicket.UpdatedBy && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Last Updated By</h3>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold text-gray-900">{selectedTicket.UpdatedBy?.Name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-700">{selectedTicket.UpdatedBy?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-medium text-gray-700">{selectedTicket.UpdatedBy?.user_id || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Timestamps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Created At</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedTicket.CreateAt)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedTicket.UpdatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit Ticket Type
                </button>
                <button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Ticket Type
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay for Details */}
      {detailsLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <p className="text-gray-600">Loading details...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAdminLayout(SupportsPage);