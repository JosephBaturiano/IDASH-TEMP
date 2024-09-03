import React, { useState } from 'react';
import Home from './Home'; // Ensure Home is correctly imported
import MediaCard from '../components/MediaCard';
import OJTDocsCard from '../components/OJTDocsCard';
import folderImage from '../assets/folder.png'; // Path to your folder image
import { useTheme } from '../context/ThemeContext'; 

const ojtDocsData = {
    Unsigned: [
        { name: 'UNSIGNED', url: 'https://drive.google.com/drive/folders/1WI0RDHo57WdYH9tKJuQ03BmFOk5V197Y?usp=drive_link' },
    ],
    Signed: [
        { name: 'AAA', url: 'https://drive.google.com/drive/folders/1x3103PSKrmAnAr98MOtf0nJNuyCEG6M4?usp=drive_link' },
        { name: 'APS', url: 'https://drive.google.com/drive/folders/1NY91myg-4Kfi1ExFzgqE7_lCozIzgUwA?usp=drive_link' },
        { name: 'CDS', url: 'https://drive.google.com/drive/folders/1Gko16uW00fR_24McyuTSq8KlwEMqfzDQ?usp=drive_link' },
        { name: 'CJO', url: 'https://drive.google.com/drive/folders/1nYg9ecc3hOhBxLf9_VKlEas5h_KD9twy?usp=drive_link' },
        { name: 'EDL', url: 'https://drive.google.com/drive/folders/1_du07R8P-Ne3eX54vEqRCgf57YNn1z72?usp=drive_link' },
        { name: 'JBM', url: 'https://drive.google.com/drive/folders/1P1RM3L0eC-zBSRn85C4-fIPkf7XtT6-G?usp=drive_link' },
        { name: 'JZB', url: 'https://drive.google.com/drive/folders/1Ed4PkZQaB3lu7lgO_BBoTM0WXUn9Jgnl?usp=drive_link' },
        { name: 'KNM', url: 'https://drive.google.com/drive/folders/11mk-JQ626UrD8Jt9VUEB8tDw-we22Wfd?usp=drive_link' },
        { name: 'LAA', url: 'https://drive.google.com/drive/folders/1JofnjoSyOIgU9qt3QO47gBDOZIsDjz37?usp=drive_link' },
        { name: 'MRS', url: 'https://drive.google.com/drive/folders/1mrRBR9X3RACoYglJdtWlY1OA7jHc4SKs?usp=drive_link' },
        { name: 'RTL', url: 'https://drive.google.com/drive/folders/1JJjIC4LASwZNg4YC79vRlGEXV9gsGJLv?usp=drive_link' },
        { name: 'UJE', url: 'https://drive.google.com/drive/folders/1FVrZxe_EHkC9e7CkSxKISbDcYCfmo2WM?usp=drive_link' }
      ],
    Templates: [
        { name: 'TEMPLATES', url: 'https://drive.google.com/drive/folders/1PdM4AX-DOswQEenAlyVe2zXrju8vYAMw' },
        
    ]
};

const mediaData = [
  { name: 'AAA', url: 'https://drive.google.com/drive/folders/1KkWEUTPE-fqLVTYUBIEDsFP6gWznvF_l?usp=drive_link' },
  { name: 'APS', url: 'https://drive.google.com/drive/folders/1jSLsFRQV_D6Cq9_ai83_5vr_J3PvYIeG?usp=drive_link' },
  { name: 'CDS', url: 'https://drive.google.com/drive/folders/1piZyVEnDxF8SwveMPxvPoKmySa9-h6yT?usp=drive_link' },
  { name: 'CJO', url: 'https://drive.google.com/drive/folders/11xkWENXkfUPTiG677_YIP_xAni0auxtE?usp=drive_link' },
  { name: 'EDL', url: 'https://drive.google.com/drive/folders/1nBfOVoBIFxkwnY5hQZ5C4Og-hZ3MotLk?usp=drive_link' },
  { name: 'JBM', url: 'https://drive.google.com/drive/folders/1ebNDZGkiOvXgSQ985qe7xiqXpOZ2NGBc?usp=drive_link' },
  { name: 'JZB', url: 'https://drive.google.com/drive/folders/1vsSNVX305wP-eWXBnBOFmm_0Ip3pE_BG?usp=drive_link' },
  { name: 'KNM', url: 'https://drive.google.com/drive/folders/16wfmcB-IcNZ-jIIIAbl3n0_QxD3azUDd?usp=drive_link' },
  { name: 'LAA', url: 'https://drive.google.com/drive/folders/1I3wqvt4UchTsI2chnldmKPehVc3DezgA?usp=drive_link' },
  { name: 'MRS', url: 'https://drive.google.com/drive/folders/1gXb2ECb9pnRxiKhzz7ca-ppdbmjfapNN?usp=drive_link' },
  { name: 'RTL', url: 'https://drive.google.com/drive/folders/1rlEMOBOqIsyS9LN0JVAjtpkHDT58sH5D?usp=drive_link' },
  { name: 'UJE', url: 'https://drive.google.com/drive/folders/1xDLARpzYg6A3W6RZEuZ1nOqtmCrzLeel?usp=drive_link' }
];
  
const Files = () => {
  const [activeTab, setActiveTab] = useState('Signed'); 
  const { theme } = useTheme();

  const backgroundColor = theme === 'light' ? 'bg-[#E8F2FA]' : 'bg-gray-800';
  const textColor = theme === 'light' ? 'text-black' : 'text-white';
  const tabActiveBgColor = theme === 'light' ? 'bg-gray-200' : 'bg-gray-700';
  const tabHoverBgColor = theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800';
  const borderColor = theme === 'light' ? 'border-gray-400' : 'border-gray-600';
  const cardHoverBgColor = theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800';


  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <Home>
      <div className={`p-5 ${backgroundColor}`}>
        <div className="mb-5">
          <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>OJT Documents</h2>
          <div className="flex gap-5 mb-5 mx-auto w-3/4 max-w-4xl">
            {['Signed', 'Unsigned', 'Templates'].map((tab) => (
              <div
                key={tab}
                className={`relative flex items-center cursor-pointer p-2 rounded-lg overflow-hidden transition-all duration-300 ${
                  activeTab === tab ? tabActiveBgColor : tabHoverBgColor
                }`}
                onClick={() => handleTabClick(tab)}
              >
                <img
                  src={folderImage}
                  alt={tab}
                  className="w-18 h-18 object-cover"
                />
                <span
                  className={`absolute bottom-3 left-5 text-black font-bold p-2 rounded w-full h-full flex items-end text-xl`}
                  style={{ fontSize: '1rem', lineHeight: '1rem' }}
                >
                  {tab}
                </span>
                <div
                  className={`absolute bottom-0 left-0 w-full h-1 transition-transform duration-300 ${
                    activeTab === tab ? 'bg-blue-600' : 'bg-transparent'
                  } ${activeTab === tab ? 'transform scale-x-100' : 'transform scale-x-0'}`}
                />
              </div>
            ))}
          </div>
        </div>
  
        <hr className={`border-t ${borderColor} my-5`} />
        <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>{activeTab}</h2>
        <div>
          {activeTab && (
            <div className="mx-auto mt-8 mb-8 max-w-4xl">
              <div className="grid grid-cols-3 gap-4 justify-items-center">
                {ojtDocsData[activeTab].map((item, index) => (
                  <div
                    key={index}
                    className={`w-72 transition-transform duration-200 hover:scale-105 ${cardHoverBgColor}`}
                  >
                    <OJTDocsCard name={item.name} url={item.url} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
  
        <hr className={`border-t ${borderColor} my-5`} />
        <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>Media</h2>
        <div className="mx-auto mt-8 mb-8 max-w-4xl">
          <div className="grid grid-cols-3 gap-4 justify-items-center">
            {mediaData.map((item, index) => (
              <div
                key={index}
                className={`w-72 transition-transform duration-200 hover:scale-105 ${cardHoverBgColor}`}
              >
                <MediaCard name={item.name} url={item.url} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Home>
  );
};
  
export default Files;