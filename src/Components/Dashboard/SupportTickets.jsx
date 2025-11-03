import React from 'react';
import image1 from '../../assets/Images/admin/Dashboard/mcd.png'
import kfc from '../../assets/Images/admin/Dashboard/kfc.png'
import taco from '../../assets/Images/admin/Dashboard/taco.png'
import dalchini from '../../assets/Images/admin/Dashboard/dalchini.png'
import { useNavigate } from 'react-router-dom';

// Support Tickets Component
const SupportTickets = () => {
    const tickets = [
        {
            id: 1,
            restaurant: "Jason Restaurant",
            issue: "Addons are displa...",
            avatar: image1
        },
        {
            id: 2,
            restaurant: "Jason Restaurant",
            issue: "Addons are displa...",
            avatar: kfc
        },
        {
            id: 3,
            restaurant: "Jason Restaurant",
            issue: "Addons are displa...",
            avatar: taco
        },
        {
            id: 4,
            restaurant: "Jason Restaurant",
            issue: "Addons are displa...",
            avatar: dalchini
        },
        {
            id: 5,
            restaurant: "Jason Restaurant",
            issue: "Addons are displa...",
            avatar: image1
        }
    ];
const navigate=useNavigate()
    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-black font-['Poppins']">Support Tickets</h2>
                <button className="text-sm font-semibold text-black font-['Poppins']" onClick={()=>navigate('/supports')}>See all</button>
            </div>

            {/* Tickets Container */}
            <div className="bg-white border border-black/20 rounded-3xl shadow-lg p-4 h-96 overflow-hidden">
                <div className="h-full overflow-y-auto pr-2 scrollbar-hide">
                    <div className="space-y-4">
                        {tickets.map((ticket, index) => (
                            <div key={ticket.id}>
                                <div className="flex items-center justify-between">
                                    {/* Left side - Avatar and info */}
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                            <img
                                                src={ticket.avatar}
                                                alt="Avatar"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-black font-['Poppins']">
                                                {ticket.restaurant}
                                            </span>
                                            <span className="text-base text-black/60 font-['Poppins']">
                                                {ticket.issue}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right side - Resolve button */}
                                    <button className="bg-gradient-to-b from-purple-700 to-red-600 text-white px-4 py-2 rounded-lg text-lg font-medium font-['Poppins'] hover:opacity-90 transition-opacity">
                                        Resolve
                                    </button>
                                </div>

                                {/* Divider line */}
                                {index < tickets.length - 1 && (
                                    <div className="border-t border-black/30 mt-4"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportTickets;
