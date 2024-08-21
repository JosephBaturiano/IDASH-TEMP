import React from 'react';
import WeeklyHeader from '../components/WeeklyHeader';
import WeeklyContent from '../components/WeeklyContent';
import WeeklyFooter from '../components/WeeklyFooter';
import { PDFDownloadLink } from '@react-pdf/renderer';
import WeeklyPDF from './WeeklyPdf'; // Adjust the import path as needed

const Weekly = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      {/* Download Button */}
      <div className="absolute top-0 right-0 m-4">
        <PDFDownloadLink document={<WeeklyPDF />} fileName="weekly-report.pdf">
          {({ loading }) => (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300"
            >
              {loading ? 'Generating PDF...' : 'Download PDF'}
            </button>
          )}
        </PDFDownloadLink>
      </div>
      
      {/* Main Container */}
      <div className="relative bg-white shadow-md rounded-lg" style={{ width: '816px', height: '1248px' }}>
        
        {/* Header */}
        <header className="w-full">
          <WeeklyHeader />
          <hr className="border-t border-black my-4" />
        </header>
        
        {/* Content */}
        <main className="w-full">
          <div className="px-12 py-8">
            <h1 className="text-center text-lg font-bold mb-2">
              CMPE 30213 On-The-Job Training 2 (300 hours)
            </h1>
            <h2 className="text-center text-lg mb-8">
              STUDENT’S WEEKLY REPORT ON ACTIVITIES
            </h2>

            {/* Student Information */}
            <div className="grid grid-cols-1 gap-2 mb-8">
              <div className="flex justify-between">
                <span className="font-bold">Name of Student:</span>
                {/* Add student name here */}
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Company Name:</span>
                {/* Add company name here */}
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Company Address:</span>
                {/* Add company address here */}
              </div>
              <div className="flex justify-between">
                <span className="font-bold">OJT Adviser/s:</span>
                {/* Add OJT adviser here */}
              </div>
            </div>

            {/* Week Information */}
            <div className="text-center font-bold mb-8">
              WEEK 0 (July 24, 2024 – July 26, 2024)
            </div>

            {/* Table */}
            <WeeklyContent />

            {/* Signatures */}
            <div className="flex justify-between mt-12">
              <div className="text-center">
                <div className="h-24">
                  {/* Signature Image can go here */}
                </div>
                <p className="font-bold">Jonas Brian R. Macacua</p>
                <p>Trainee/Student</p>
              </div>

              <div className="text-center">
                <div className="h-24">
                  {/* Signature Image can go here */}
                </div>
                <p className="font-bold">Mr. Rene S. Yap</p>
                <p>Technical Director</p>
                <p>VisibleTeam Solutions OPC</p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="w-full">
          <WeeklyFooter />
        </footer>
      </div>
    </div>
  );
};

export default Weekly;
