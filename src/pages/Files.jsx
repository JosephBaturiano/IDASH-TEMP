import React, { useState } from 'react';
import Home from './Home'; // Ensure Home is correctly imported
import MediaCard from '../components/MediaCard';
import OJTDocsCard from '../components/OJTDocsCard';
import folderImage from '../assets/folder.png'; // Path to your folder image

const ojtDocsData = {
    Unsigned: [
        { name: 'AAA', url: 'https://drive.google.com/drive/folders/18IKR2Au8nCeGS2-0QaynjWP0Gj0mGzBm?usp=drive_link://drive.google.com/drive/folders/1x3103PSKrmAnAr98MOtf0nJNuyCEG6M4?usp=drive_link' },
        { name: 'APS', url: 'https://drive.google.com/drive/folders/1C4F9hF9VKjhR6RlmMmCwu67R4MV6AXMo?usp=drive_link' },
        { name: 'CDS', url: 'https://drive.google.com/drive/folders/1jh8HMpFg-F-hLi41MsnL-yFQiVutjnbF?usp=drive_link' },
        { name: 'CJO', url: 'https://drive.google.com/drive/folders/1bp7IzCaEQb-ir0Cwi7qw8AUQDE_mm1BS?usp=drive_link' },
        { name: 'EDL', url: 'https://drive.google.com/drive/folders/1oEaYbuPJB8cZplpNYfaqP5mwLjL8iX2Y?usp=drive_link' },
        { name: 'JBM', url: 'https://drive.google.com/drive/folders/1m2mNmMwxuoMf4xAfIunO-zcC0EBqTVSc?usp=drive_link' },
        { name: 'JZB', url: 'https://drive.google.com/drive/folders/1vg4krLl16NKU00G7FlatCOnhuyb5Jt9I?usp=drive_link' },
        { name: 'KNM', url: 'https://drive.google.com/drive/folders/1gDJQxosEGDCzO6m4MOtBvcToOnDkGSHz?usp=drive_link' },
        { name: 'LAA', url: 'https://drive.google.com/drive/folders/1-XuibKFYR63aggLHSMBvIGIhl9_I1YT6?usp=drive_link' },
        { name: 'MRS', url: 'https://drive.google.com/drive/folders/16YgTFIeeM3uFYrJcY-vCgOZf0ssfGsBk?usp=drive_link' },
        { name: 'RTL', url: 'https://drive.google.com/drive/folders/1tMlpwtMdgOTeUfWh_eH8YiJQitRHSnTI?usp=drive_link' },
        { name: 'UJE', url: 'https://drive.google.com/drive/folders/1bMQXmCOIfSMTFrJsY8RvOlytQqBRNq0k?usp=drive_link' }
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
        { name: 'TEMPLATES', url: 'https://drive.google.com/drive/folders/1KkWEUTPE-fqLVTYUBIEDsFP6gWznvF_l?usp=drive_link' },
        
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
  const [activeTab, setActiveTab] = useState('Signed'); // Default tab

  const handleTabClick = (tabName) => {
      setActiveTab(tabName);
  };

  return (
    <Home>
        <div className="p-5 bg-[#E8F2FA]">
            <div className="mb-5">
                <h2 className="text-2xl font-bold mb-4 text-black">OJT Documents</h2>
                <div className="flex gap-5 mb-5 mx-auto w-3/4 max-w-4xl">
                    {['Signed', 'Unsigned', 'Templates'].map((tab) => (
                        <div
                            key={tab}
                            className="relative flex items-center cursor-pointer"
                            onClick={() => handleTabClick(tab)}
                        >
                            <img src={folderImage} alt={tab} className="w-21 h-21 object-cover" />
                            <span className="absolute bottom-2 left-2 text-black font-bold p-1 rounded">{tab}</span>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-t border-gray-400 my-5" />
            
            <div>
                {activeTab && (
                    <div className="mx-auto mt-8 mb-8 max-w-4xl">
                        <h2 className="text-lg mb-2 text-black">{activeTab} </h2>
                        <div className="grid grid-cols-3 gap-4">
                            {ojtDocsData[activeTab].map((item, index) => (
                                <OJTDocsCard key={index} name={item.name} url={item.url} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <hr className="border-t border-gray-400 my-5" />
            <h2 className="text-2xl font-bold mb-4 text-black">Media</h2>
            <div className="mx-auto mt-8 mb-8 max-w-4xl"> {/* Increased max-width */}
                
                <div className="grid grid-cols-3 gap-4 justify-items-center">
                    {mediaData.map((item, index) => (
                        <div key={index} className="w-72"> {/* Example: increased width of each item */}
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
