import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import AnnouncementCard from '../components/AnnouncementCard';
import RulesCard from '../components/RulesCard';

const Announcement = ({ children }) => {
    const [activeTab, setActiveTab] = useState('announcements');
  
    const showTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <main className="flex h-screen w-full relative">
            {/* Sidebar */}
            <div className="w-[17%] h-full fixed">
                <SideBar />
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-[83%] ml-[17%]">
                <TopBar />
                <div className="p-4 bg-[#F0F8FF] h-full overflow-auto relative flex justify-center items-center">
                    {children}

                    {/* Tab Container */}
                    <div className="w-[1170px] h-[90%] bg-white rounded-3xl shadow-md overflow-hidden relative">
                        {/* Tab Buttons */}
                        <div className="flex bg-white border-b">
                            <button
                                onClick={() => showTab('announcements')}
                                className={`w-1/2 py-2 text-center ${activeTab === 'announcements' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-black'} rounded-tl-3xl`}
                            >
                                Announcements
                            </button>
                            <button
                                onClick={() => showTab('rules')}
                                className={`w-1/2 py-2 text-center ${activeTab === 'rules' ? 'bg-black text-white' : 'bg-gray-200 text-black'} rounded-tr-3xl`}
                            >
                                Rules
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 h-[calc(100%-50px)] max-h-[500px] overflow-y-auto">
                            {activeTab === 'announcements' && <AnnouncementCard />}
                            {activeTab === 'rules' && <RulesCard />}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Announcement;
