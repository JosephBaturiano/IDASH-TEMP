import React, { useContext } from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import { UserContext } from '../context/UserContext'; // Import UserContext
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';

function Home({ children }) {
  const { theme } = useTheme(); // Get the current theme from ThemeContext
  const { currentUserId } = useContext(UserContext); // Get currentUserId from UserContext

  // Define background colors based on the current theme
  const sidebarBgColor = theme === 'light' ? '#DBEDFF' : '#1F2937';
  const mainContentBgColor = theme === 'light' ? '#F0F8FF' : '#1a202c';
  
  return (
    <main className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-[17%] h-full fixed" style={{ backgroundColor: sidebarBgColor }}>
        <SideBar />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col w-[83%] ml-[17%]">
        <TopBar currentUserId={currentUserId} />
        <div className="p-4 h-full overflow-auto" style={{ backgroundColor: mainContentBgColor }}>
          {children}
        </div>
      </div>
    </main>
  );
}

export default Home;
