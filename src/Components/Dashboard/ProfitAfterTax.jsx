import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ProfitAfterTax = () => {
  const data = [
    { name: 'Progress', value: 80 },
    { name: 'Remaining', value: 20 },
  ];

  const COLORS = ['url(#gradient)', '#1E1E1E'];

  return (
    <div className="h-[383px] flex flex-col gap-4">
      {/* Title */}
      <h2 className="text-2xl font-bold text-black">Profit After Tax</h2>

      {/* Card */}
      <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-3xl shadow-lg px-6 py-6 relative">
        
        {/* Net Profit Info */}
        <div className="text-center mb-4">
          <div className="text-sm font-medium text-black">Net Profit</div>
          <div className="text-3xl font-bold bg-gradient-to-b from-purple-800 to-red-600 bg-clip-text text-transparent">
            6 092 XOF
          </div>
          <div className="text-sm text-black/60 mt-1">
            You have Made <span className="text-green-600 font-semibold">32%</span> better than Last Month
          </div>
        </div>

        {/* Chart */}
        <div className="w-[270px] h-[150px] relative overflow-visible">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B934D8" />
                  <stop offset="100%" stopColor="#3D0C5A" />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}   // smaller inner radius
                outerRadius={100}  // same outer radius
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Percentage Centered */}
          <div className="absolute top-[80%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="text-xl font-bold bg-gradient-to-b from-purple-800 to-red-600 bg-clip-text text-transparent">
              80%
            </div>
          </div>

          {/* Tick Line */}
          <div className="absolute right-[80px] top-[38px] w-[2px] h-[70px] bg-[#3D0C5A] transform rotate-[56deg] origin-bottom"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfitAfterTax;
