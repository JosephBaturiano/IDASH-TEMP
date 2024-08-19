import React, { useState } from 'react';
import Home from './Home'; // Ensure Home is correctly imported
import MediaCard from '../components/MediaCard';
import OJTDocsCard from '../components/OJTDocsCard';
import folderImage from '../assets/folder.png';  // Path to your folder image

const ojtDocsData = {
    Signed: [
        { name: 'Folder 1', url: 'https://example.com/signed1' },
        // Add more items as needed
    ],
    Unsigned: [
        { name: 'Folder 2', url: 'https://example.com/unsigned1' },
        // Add more items as needed
    ],
    Templates: [
        { name: 'Folder 3', url: 'https://example.com/templates1' },
        // Add more items as needed
    ]
};

const mediaData = [
  { name: 'Folder 1', url: 'https://example.com/templates1' }

];

const Files = () => {
    const [activeTab, setActiveTab] = useState('Signed'); // Default tab

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <Home>
            <div className="p-5 bg-[#E8F2FA]">
                <div className="mb-5">
                    <h2 className="text-lg mb-2 text-black">OJT Documents</h2>
                    <div className="flex gap-5 mb-5">
                        {['Signed', 'Unsigned', 'Templates'].map((tab) => (
                            <div 
                                key={tab}
                                className={`cursor-pointer flex items-center ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
                                onClick={() => handleTabClick(tab)}
                            >
                                <img src={folderImage} alt={tab} className="w-16 h-16 object-cover" />
                                <span className="ml-2">{tab}</span>
                            </div>
                        ))}
                    </div>

                    <hr className="border-t border-gray-400 my-5" />

                    <div>
                        {activeTab && (
                            <div>
                                <h2 className="text-lg mb-2 text-black">{activeTab} Documents</h2>
                                <div className="grid grid-cols-3 gap-4" style={{ width: '800px', height: '60px' }}>
                                    {ojtDocsData[activeTab].map((item, index) => (
                                        <OJTDocsCard key={index} name={item.name} url={item.url} label={item.name} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <hr className="border-t border-gray-400 my-5" />
                    
                    <div>
                        <h2 className="text-lg mb-2 text-black">Media</h2>
                        <div className="grid grid-cols-3 gap-4" style={{ width: '800px', height: '60px' }}>
                            {mediaData.map((item, index) => (
                                <MediaCard key={index} label={item.name} url={item.url} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Home>
    );
};

export default Files;
