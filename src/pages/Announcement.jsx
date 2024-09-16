import React, { useState } from 'react';
import Home from './Home'; 
import AnnouncementCard from '../components/AnnouncementCard';
import RulesCard from '../components/RulesCard';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const Announcement = ({ children, currentUserId }) => {
    const [activeTab, setActiveTab] = useState('announcements');
    const { theme } = useTheme(); // Get the current theme

    const showTab = (tab) => {
        setActiveTab(tab);
    };

    // Define colors based on the current theme
    const bgColor = theme === 'dark' ? '#1a202c' : '#F0F8FF'; // Dark gray for dark mode, light blue for light mode
    const tabButtonActiveBg = theme === 'dark' ? 'bg-purple-700' : 'bg-purple-500'; // Darker purple for dark mode
    const tabButtonInactiveBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'; // Darker gray for dark mode
    const tabButtonTextColor = theme === 'dark' ? 'text-gray-200' : 'text-black'; // Light text for dark mode

    return (
        <Home currentUserId={currentUserId}>
            <div className={`p-4 h-full overflow-auto relative flex justify-center items-center ${bgColor}`}>
                {children}

                {/* Tab Container */}
                <div className={`w-[1170px] h-[90%] rounded-3xl shadow-md overflow-hidden relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    {/* Tab Buttons */}
                    <div className={`flex border-b ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <button
                            onClick={() => showTab('announcements')}
                            className={`w-1/2 py-2 text-center ${activeTab === 'announcements' ? tabButtonActiveBg + ' text-white' : tabButtonInactiveBg + ' ' + tabButtonTextColor} rounded-tl-3xl`}
                        >
                            Announcements
                        </button>
                        <button
                            onClick={() => showTab('rules')}
                            className={`w-1/2 py-2 text-center ${activeTab === 'rules' ? tabButtonActiveBg + ' text-white' : tabButtonInactiveBg + ' ' + tabButtonTextColor} rounded-tr-3xl`}
                        >
                            Rules
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className={`p-6 h-[calc(100%-100px)] max-h-auto overflow-y-auto ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        {activeTab === 'announcements' && <AnnouncementCard />}
                        {activeTab === 'rules' && <RulesCard />}
                    </div>
                </div>
            </div>
        </Home>
    );
};

export default Announcement;
