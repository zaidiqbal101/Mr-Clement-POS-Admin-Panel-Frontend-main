import { useNavigate } from "react-router-dom";

const SubscriptionRenewalAlert = () => {
  const subscriptions = [
    {
      id: "01",
      businessName: "AOH Bars",
      renewalDate: "April 29, 2025"
    },
    {
      id: "02", 
      businessName: "AOH Bars",
      renewalDate: "April 29, 2025"
    },
    {
      id: "03",
      businessName: "AOH Bars", 
      renewalDate: "April 29, 2025"
    }
  ];

  const navigate=useNavigate()
  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold text-black font-['Poppins']">Subscription Renewal Alert</h2>
        <button className="text-sm font-semibold text-black font-['Poppins']" onClick={()=>navigate('/subscription-list')}>See all</button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Table Header */}
          <div className="bg-gradient-to-b from-purple-700/10 to-red-600/10 border-b border-black/20 px-6 sm:px-10 py-4 sm:py-6">
            <div className="grid grid-cols-4 gap-4 sm:gap-8 items-center">
              <span className="text-sm sm:text-base font-semibold text-black/60 font-['Poppins']">#</span>
              <span className="text-sm sm:text-base font-semibold text-black/60 font-['Poppins']">Business Name</span>
              <span className="text-sm sm:text-base font-semibold text-black/60 font-['Poppins'] text-center">Renewal Date</span>
              <span className="text-sm sm:text-base font-semibold text-black/60 font-['Poppins'] text-center">Notify Client</span>
            </div>
          </div>

          {/* Table Rows */}
          {subscriptions.map((subscription, index) => (
            <div 
              key={subscription.id}
              className={`border-b border-black/20 px-6 sm:px-10 py-4 sm:py-6 ${
                index === subscriptions.length - 1 ? 'rounded-b-2xl' : ''
              }`}
            >
              <div className="grid grid-cols-4 gap-4 sm:gap-8 items-center">
                <span className="text-sm sm:text-base font-semibold text-black font-['Poppins']">
                  {subscription.id}
                </span>
                <span className="text-sm sm:text-base font-semibold text-black font-['Poppins']">
                  {subscription.businessName}
                </span>
                <span className="text-sm sm:text-base font-semibold text-red-500 font-['Poppins'] text-center">
                  {subscription.renewalDate}
                </span>
                <div className="flex justify-center">
                  <button className="bg-gradient-to-b from-purple-700 to-red-600 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg text-sm sm:text-base font-semibold font-['Poppins'] hover:opacity-90 transition-opacity">
                    Send Alert
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRenewalAlert;
