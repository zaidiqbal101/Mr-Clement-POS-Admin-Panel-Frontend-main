import React, { useState, useEffect } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import { ChevronDown } from 'lucide-react';
import { getAuthToken } from '../../utils/auth';

const API_BASE_URL = 'https://vercel-mr-clement-pos-backend.vercel.app';

const AuditLogTable = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const periods = ['Today', 'This Week', 'This Month', 'This Year'];

  // Mock data fallback for testing/errors
  const mockAudits = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    user_name: 'Fahim',
    user_role: 'Developer',
    client_name: 'Chinese Ramen Bowl',
    action: i === 0 ? 'Update' : 'File Delete',
    environment: i === 0 ? 'Floor Plan' : 'Reservations',
    ip_address: '#12345648745',
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
  }));

  // Fetch audit logs
  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    setLoading(true);
    setError(null);
    
    // Try to get token from auth utility
    let token = getAuthToken();
    
    // TEMPORARY: Fallback to hardcoded token for testing
    if (!token) {
      console.warn('No token found in storage. Using temporary hardcoded token.');
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjAyNTRmM2E5YmVhZTU5MjAyZWFkMSIsInVzZXJfaWQiOjEsImVtYWlsIjoicGF5YWthbnB1ckBnbWFpbC5jb20iLCJyb2xlIjoxLCJpYXQiOjE3NjI2MDA3MjEsImV4cCI6MTc2MjY4NzEyMX0.F3Xxt7bYRsN89Ly4c7CpWuM93TzvvvcYKvk1WLeC8s4';
      setError('Using temporary token. Please login to use your own session.');
    }
    
    console.log('Token check:', {
      fromStorage: !!getAuthToken(),
      localStorage: localStorage.getItem('admin_token'),
      sessionStorage: sessionStorage.getItem('admin_token')
    });

    try {
      console.log('Fetching audits with token:', token.substring(0, 20) + '...');
      
      const response = await fetch(`${API_BASE_URL}/api/admin/audits/getbyauth`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Audit API Response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('Audit API endpoint not found (404). Using mock data.');
          setAudits(mockAudits);
          setError('Audit endpoint not available. Showing sample data.');
        } else if (response.status === 401) {
          setError('Authentication failed. Please login again.');
          setAudits(mockAudits);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        console.log('Audit API Response data:', data);
        
        // Handle different response structures
        let auditData = [];
        
        if (data.success && Array.isArray(data.data)) {
          auditData = data.data;
        } else if (Array.isArray(data.audits)) {
          auditData = data.audits;
        } else if (Array.isArray(data)) {
          auditData = data;
        } else {
          console.warn('Unexpected API response format:', data);
          auditData = mockAudits;
          setError('Unexpected data format. Showing sample data.');
        }
        
        setAudits(auditData.length > 0 ? auditData : mockAudits);
      }
    } catch (err) {
      console.error('Failed to fetch audits:', err);
      setAudits(mockAudits);
      setError(`API error: ${err.message}. Showing sample data.`);
    } finally {
      setLoading(false);
    }
  };

  // Format audit row
  const formatAuditRow = (audit) => {
    const date = new Date(audit.created_at || audit.timestamp || audit.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const formattedTime = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return {
      userName: audit.user_name || audit.user?.name || 'Unknown User',
      role: audit.user_role || audit.role || 'N/A',
      client: audit.client_name || audit.client || 'N/A',
      action: audit.action || 'Unknown',
      environment: audit.environment || 'N/A',
      ip: audit.ip_address || audit.ip || 'N/A',
      date: formattedDate,
      time: formattedTime,
      isDelete: audit.action?.toLowerCase().includes('delete'),
      isUpdate: audit.action?.toLowerCase().includes('update'),
    };
  };

  const formattedRows = audits.map(formatAuditRow);

  return (
    <div className="w-full overflow-y-auto poppins-text px-4 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Audits</h1>

        <div className="flex items-center gap-4">
          {/* Refresh Button */}
          <button
            onClick={fetchAudits}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>

          {/* Period Dropdown */}
          <div className="relative w-fit">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between gap-2 w-[129px] h-[35px] px-4 py-2 bg-white border border-black rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-700 text-sm font-medium">{selectedPeriod}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-[246px] bg-white shadow-md rounded-lg flex flex-col px-3 py-5 z-30">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left h-8 px-2 py-1 border-b border-black/20 font-[500] text-[16px] leading-[24px] font-[Manrope]
                      ${selectedPeriod === period
                        ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded'
                        : 'text-black hover:bg-gray-100'}
                    `}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-gray-600 text-lg">Loading audits...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-6 mb-6 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="mb-2">⚠️ {error}</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto w-full">
          <div className="min-w-[768px]">
            {/* Table Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-purple-200 to-red-200 border-b border-black/20 rounded-t-lg h-16 flex items-center px-4 md:px-6 text-xs sm:text-sm md:text-base text-[#00000099]">
              <div className="flex-[1.2] font-semibold min-w-[120px]">User Name</div>
              <div className="flex-1 font-semibold min-w-[140px]">Client</div>
              <div className="flex-1 font-semibold min-w-[120px]">Action</div>
              <div className="flex-1 font-semibold min-w-[140px]">Environment</div>
              <div className="flex-1 font-semibold min-w-[140px]">IP Address</div>
              <div className="flex-1 text-right font-semibold min-w-[160px]">Time Stamp</div>
            </div>

            {/* Table Rows */}
            {formattedRows.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-white border border-gray-200">
                No audit logs found.
              </div>
            ) : (
              formattedRows.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center px-4 md:px-6 border-b border-gray-200 h-20 text-xs sm:text-sm md:text-base bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-[1.2] min-w-[120px]">
                    <div className="font-semibold truncate">{row.userName}</div>
                    <div className="text-xs text-gray-600">{row.role}</div>
                  </div>
                  <div className="flex-1 font-semibold min-w-[140px] truncate">{row.client}</div>
                  <div
                    className={`flex-1 font-semibold min-w-[120px] ${
                      row.isUpdate ? 'text-green-500' : row.isDelete ? 'text-red-500' : 'text-gray-700'
                    }`}
                  >
                    {row.action}
                  </div>
                  <div className="flex-1 font-semibold min-w-[140px] truncate">{row.environment}</div>
                  <div className="flex-1 font-semibold min-w-[140px] truncate">{row.ip}</div>
                  <div className="flex-1 text-right min-w-[160px]">
                    <div className={`font-semibold ${row.isDelete ? 'text-red-500' : 'text-black'}`}>
                      {row.date}
                    </div>
                    <div className={`font-semibold ${row.isDelete ? 'text-red-500' : 'text-black'}`}>
                      {row.time}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default withAdminLayout(AuditLogTable);