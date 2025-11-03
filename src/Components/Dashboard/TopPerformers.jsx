import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopPerformers = () => {
  const navigate = useNavigate();
  const performersData = [
    { id: '01', company: 'AOH Bars', sales: '9 9000 XOF', renewalDate: 'March 01, 2025' },
    { id: '02', company: 'Tech Hive', sales: '8 4500 XOF', renewalDate: 'April 10, 2025' },
    { id: '03', company: 'Zenith Corp', sales: '7 1200 XOF', renewalDate: 'May 15, 2025' },
    { id: '04', company: 'NovaX Labs', sales: '6 9800 XOF', renewalDate: 'June 21, 2025' },
    { id: '05', company: 'ByteBurst', sales: '5 8700 XOF', renewalDate: 'July 30, 2025' },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-black">Top Performers</h2>
        <button
          onClick={() => navigate('/top-performers-list')}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          See all
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px] w-full">
          {/* Table Header */}
          <div className="grid grid-cols-4 md:grid-cols-5 bg-gradient-to-b from-purple-900/10 to-red-600/10 border border-black/20 rounded-t-2xl text-black/60 font-semibold text-sm md:text-base px-4 py-3">
            <div>#</div>
            <div className="col-span-2">Company Name</div>
            <div className="text-center">Total Sales</div>
            <div className="hidden md:block text-center">Renewal Date</div>
          </div>

          {/* Table Rows */}
          {performersData.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-4 md:grid-cols-5 items-center bg-white border-x border-b border-black/20 px-4 py-3 text-sm md:text-base ${
                index === performersData.length - 1 ? 'rounded-b-2xl' : ''
              }`}
            >
              <div>{item.id}</div>
              <div className="col-span-2">{item.company}</div>
              <div className="text-center text-green-500">{item.sales}</div>
              <div className="hidden md:block text-center text-red-500">{item.renewalDate}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopPerformers;
