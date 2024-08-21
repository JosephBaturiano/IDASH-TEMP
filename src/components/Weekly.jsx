import React, { useRef } from 'react';
import WeeklyHeader from '../components/WeeklyHeader';
import WeeklyContent from '../components/WeeklyContent';
import WeeklyFooter from '../components/WeeklyFooter';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Weekly = () => {
  const reportRef = useRef();

  const handleDownload = async () => {
    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', [216, 330]); // 8.5 x 13 inches
    const pdfWidth = pdf.internal.pageSize.width;
    const pdfHeight = pdf.internal.pageSize.height;
    
    // Calculate the scaling ratio to fit the content within the page
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const scale = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);

    // Use the scaling ratio to set the dimensions for the PDF image
    const imgWidth = canvasWidth * scale;
    const imgHeight = canvasHeight * scale;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('weekly-report.pdf');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="absolute top-0 right-0 m-4 bg-blue-500 text-white px-4 py-2 rounded shadow"
      >
        Download
      </button>
      
      {/* Main Container */}
      <div
        ref={reportRef}
        className="relative bg-white shadow-md rounded-lg"
        style={{ width: '816px', height: '1248px' }} 
      >
        {/* Header */}
        
        <header className="w-full mb-2"> {/* Added margin-bottom */}
          <WeeklyHeader />
          <hr className="border-t border-black" />
        </header>
        
        {/* Content */}
        <main className="w-full px-12 py-40">
          <div className="space-y-8"> {/* Added space between sections */}
            <h1 className="text-center text-lg font-bold">
              CMPE 30213 On-The-Job Training 2 (300 hours)
            </h1>
            <h2 className="text-center text-lg mb-8 font-bold">
              STUDENT’S WEEKLY REPORT ON ACTIVITIES
            </h2>

            {/* Student Information */}
            <div className="grid grid-cols-1 gap-2">
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
            <div className="text-center font-bold text-lg">
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
        <footer className="w-full mt-8"> {/* Added margin-top */}
          <WeeklyFooter />
        </footer>
      </div>
    </div>
  );
};

export default Weekly;
