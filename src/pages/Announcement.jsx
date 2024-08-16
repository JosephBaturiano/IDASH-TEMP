
import { AnnouncementOutlined, AnnouncementRounded } from '@mui/icons-material'
import { Icon } from '@mui/material'
import React from 'react'

import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';

const Announcement = ({children}) => {
  return (
    <main className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-[17%] h-full fixed">
        <SideBar />
      </div>
      
      
    </main>
  );
};

export default Announcement;
