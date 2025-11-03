import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionsPurchased = () => {
  const subscriptionData = [
    { id: '01', business: 'AOH Bars', plan: '3 months Plan', date: '23/09/2025', amount: '460 XOF' },
    { id: '02', business: 'AOH Bars', plan: '6 months Plan', date: '23/09/2025', amount: '840 XOF' },
    { id: '03', business: 'AOH Bars', plan: '3 months Plan', date: '23/09/2025', amount: '460 XOF' },
    { id: '04', business: 'AOH Bars', plan: '1 Year Plan', date: '23/09/2025', amount: '1060 XOF' },
    { id: '05', business: 'AOH Bars', plan: '6 months Plan', date: '23/09/2025', amount: '860 XOF' },
  ];

  const navigate=useNavigate()

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-black">Subscriptions Purchased</h2>
        <div className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer" onClick={()=>navigate('/subscription-list')}>
          See all
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] w-full">
          {/* Table Header */}
          <div className="grid grid-cols-5 bg-gradient-to-b from-purple-900/10 to-red-600/10 border border-black/20 rounded-t-2xl text-sm md:text-base font-semibold text-black/60 px-4 py-3">
            <div>#</div>
            <div>Business Name</div>
            <div>Plan Purchased</div>
            <div>Purchased Date</div>
            <div>Amount</div>
          </div>

          {/* Table Rows */}
          {subscriptionData.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-5 items-center bg-white border-x border-b border-black/20 px-4 py-3 text-sm md:text-base ${
                index === subscriptionData.length - 1 ? 'rounded-b-2xl' : ''
              }`}
            >
              <div>{item.id}</div>
              <div>{item.business}</div>
              <div>{item.plan}</div>
              <div>{item.date}</div>
              <div className="text-green-500 font-semibold">{item.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPurchased;
