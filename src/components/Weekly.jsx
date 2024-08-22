import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useTimesheets } from '../context/TimesheetContext';
import WeeklyHeader from '../components/WeeklyHeader';
import WeeklyFooter from '../components/WeeklyFooter';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import TimesheetItem from '../components/WeeklyContent'; // Import TimesheetItem

function Weekly() {
  const { timesheets, user } = useTimesheets();
  const reportRef = useRef();
  const [sections, setSections] = useState([]);

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getDayOfWeek = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Memoize sortedTimesheets and groupedTimesheets
  const sortedTimesheets = useMemo(() => {
    return timesheets.sort((a, b) => {
      const dayA = getDayOfWeek(a.date);
      const dayB = getDayOfWeek(b.date);
      return dayOrder.indexOf(dayA) - dayOrder.indexOf(dayB);
    });
  }, [timesheets]);

  const groupedTimesheets = useMemo(() => {
    return sortedTimesheets.reduce((acc, curr) => {
      const date = new Date(curr.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr.description);
      return acc;
    }, {});
  }, [sortedTimesheets]);

  const handleDownload = async () => {
    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', [216, 330]);

    const pdfWidth = pdf.internal.pageSize.width;
    const pdfHeight = pdf.internal.pageSize.height;

    const imgWidth = canvas.width * (pdfWidth / canvas.width);
    const imgHeight = canvas.height * (pdfHeight / canvas.height);

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('weekly-report.pdf');
  };

  useEffect(() => {
    const splitContentIntoSections = () => {
      const sectionHeight = 200;
      let currentHeight = 0;
      let currentSection = [];
      const tempSections = [];

      // Create a container to measure content height
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.visibility = 'hidden';
      document.body.appendChild(container);

      Object.entries(groupedTimesheets).forEach(([date, descriptions]) => {
        const row = document.createElement('div');
        row.style.margin = '10px 0';

        const dateElem = document.createElement('span');
        dateElem.textContent = date;
        dateElem.style.fontWeight = 'bold';
        row.appendChild(dateElem);

        const descElem = document.createElement('div');
        descElem.textContent = descriptions.join(', ');
        row.appendChild(descElem);

        container.appendChild(row);

        const newSectionHeight = container.scrollHeight;

        if (currentHeight + newSectionHeight > sectionHeight) {
          tempSections.push(currentSection);
          currentSection = [];
          currentHeight = 0;
        }

        currentSection.push({ date, descriptions });
        currentHeight += newSectionHeight;

        // Remove row after measurement
        container.removeChild(row);
      });

      if (currentSection.length > 0) {
        tempSections.push(currentSection);
      }

      document.body.removeChild(container);
      setSections(tempSections);
    };

    splitContentIntoSections();
  }, [groupedTimesheets]);

  return (
    <div>
      <button
        onClick={handleDownload}
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 z-10"
      >
        Download PDF
      </button>

      {sections.map((section, index) => (
        <div
          key={index}
          ref={reportRef}
          className="relative mx-auto bg-white mb-8"
          style={{ width: '8.5in', height: '13in', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex flex-col mx-auto h-full w-11/12">
            <WeeklyHeader />
            <hr className="border-t border-black" />
            <div className="flex-1 p-4">

              <div className="space-y-3">
                <h1 className="text-center text-lg font-bold">
                  CMPE 30213 On-The-Job Training 2 (300 hours)
                </h1>
                <h2 className="text-center text-lg mb-8 font-bold">
                  STUDENT’S WEEKLY REPORT ON ACTIVITIES
                </h2>

              </div>
              <div className="w-10/12 mx-auto pt-4 text-sm font-semibold">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-collapse border-black">Name of Student:</td>
                      <td className="border-b border-black ">{user?.name}</td>
                    </tr>
                    <tr>
                      <td className="border-collapse border-black">Company Name:</td>
                      <td className="border-b border-black">VisibleTeam LLC</td>
                    </tr>
                    <tr>
                      <td className="border-collapse border-black">Company Address:</td>
                      <td className="border-b border-black">447 Broadway 2nd Floor #306 New York, NY 10013</td>
                    </tr>
                    <tr>
                      <td className="border-collapse border-black">OJT Adviser/s:</td>
                      <td className="border-b border-black">{user?.OJTadviser}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-center font-bold text-lg pt-5 mb-2">
                WEEK 0 (July 24, 2024 – July 26, 2024)
              </div>
              <div className='px-8'>
                <table className="w-full text-left border-collapse border border-black">
                  <thead>
                    <tr className="border border-black text-center">
                      <th className="border border-black px-4 w-40">DAY</th>
                      <th className="border border-black px-4">ACTIVITIES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.map(({ date, descriptions }) => (
                      <TimesheetItem
                        key={date}
                        date={date}
                        descriptions={descriptions}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Footer Section */}
              {index === sections.length - 1 && (
                <div className="flex justify-between mx-14 mb-12">
                  <div className="text-left">
                    <div className="h-24"></div>
                    <p className="italic mb-7">Prepared By:</p>
                    <p className="font-bold">{user?.name}</p>
                    <p>Trainee/Student</p>
                  </div>
                  <div className="text-left">
                    <div className="h-24"></div>
                    <p className="italic mb-7">Verified and Certified By:</p>
                    <p className="font-bold">Mr. Rene S. Yap</p>
                    <p>Technical Director</p>
                    <p>VisibleTeam Solutions OPC</p>
                  </div>
                </div>
              )}
            </div>
            <WeeklyFooter />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Weekly;
