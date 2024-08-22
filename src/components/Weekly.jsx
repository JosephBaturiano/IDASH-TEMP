import React from 'react';
import { useTimesheets } from '../context/TimesheetContext';
import WeeklyContent from '../components/WeeklyContent';
import WeeklyHeader from '../components/WeeklyHeader';
import WeeklyFooter from '../components/WeeklyFooter';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';

function Weekly() {
  const { timesheets, user } = useTimesheets();
  const reportRef = useRef();

  const handleDownload = async () => {
    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', [216, 330]); // 8.5 x 13 inches
    const pdfWidth = pdf.internal.pageSize.width;
    const pdfHeight = pdf.internal.pageSize.height;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const scale = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);

    const imgWidth = canvasWidth * scale;
    const imgHeight = canvasHeight * scale;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('weekly-report.pdf');
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 z-10"
      >
        Download PDF
      </button>

      <div
        ref={reportRef}
        className="relative mx-auto bg-white"
        style={{ width: '8.5in', height: '13in', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex flex-col h-full">
          <WeeklyHeader />
          <hr className="border-t border-black" />
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-8">
              <h1 className="text-center text-lg font-bold">
                CMPE 30213 On-The-Job Training 2 (300 hours)
              </h1>
              <h2 className="text-center text-lg mb-8 font-bold">
                STUDENT’S WEEKLY REPORT ON ACTIVITIES
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-1 pl-6 pt-2">
              <div className="flex justify">
                <span className="font-semibold">Name of Student:</span>
                <p className='ml-4'>{user?.name}</p>
              </div>
              <div className="flex justify">
                <span className="font-semibold">Company Name:</span>
                <p className='ml-4'>VisibleTeam Solutions OPC</p>
              </div>
              <div className="flex justify">
                <span className="font-semibold">Company Address:</span>
                <p className='ml-4'>447 Broadway 2nd Floor #306 New York, NY 10013</p>
              </div>
              <div className="flex justify">
                <span className="font-semibold">OJT Adviser/s:</span>
                <p className='ml-4'>{user?.OJTadviser}</p>
              </div>
            </div>
            <div className="text-center font-bold text-lg pt-5 mb-5">
              WEEK 0 (July 24, 2024 – July 26, 2024)
            </div>
            <div className='px-8'>
              {timesheets.map((timesheet) => (
                <WeeklyContent
                  key={timesheet.id}
                  description={timesheet.description}
                  date={timesheet.date}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between mx-14 mb-12">
            <div className="text-center">
              <div className="h-24"></div>
              <p className="italic mb-7">Prepared By:</p>
              <p className="font-bold">{user?.name}</p>
              <p>Trainee/Student</p>
            </div>

            <div className="text-center">
              <div className="h-24"></div>
              <p className="italic mb-7">Verified and Certified By:</p>
              <p className="font-bold">Mr. Rene S. Yap</p>
              <p>Technical Director</p>
              <p>VisibleTeam Solutions OPC</p>
            </div>
          </div>
          <WeeklyFooter />
        </div>
      </div>
    </div>
  );
}

export default Weekly;
