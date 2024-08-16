import React from 'react';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';

function Home({ children }) {
  return (
    <main className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-[17%] h-full fixed">
        <SideBar />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col w-[83%] ml-[17%]">
        <TopBar />
        <div className="p-4 bg-[#F0F8FF] h-full overflow-auto">
          {children}
        </div>
      </div>
    </main>
  );
}

export default Home;
