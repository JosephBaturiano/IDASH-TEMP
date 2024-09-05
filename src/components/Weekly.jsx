import React, { useRef, useState, useEffect, useMemo } from 'react';
import Draggable from 'react-draggable';
import { useTimesheets } from '../context/TimesheetContext';
import WeeklyHeader from '../components/WeeklyHeader';
import WeeklyFooter from '../components/WeeklyFooter';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import TimesheetItem from '../components/WeeklyContent';
import { useNotification } from '../context/NotificationContext'; // Import Notification Context


const SECTION_HEIGHT = 700; // Height of one section
const FOOTER_HEIGHT = 50; // Height of the footer
const CONTENT_HEIGHT = SECTION_HEIGHT - FOOTER_HEIGHT; // Available height for content

function Weekly() {
  const { timesheets, user } = useTimesheets();
  const [sections, setSections] = useState([]);
  const { user: notificationUser } = useNotification(); // Rename here
  const reportRefs = useRef([]);

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getDayOfWeek = (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long' });


  const sortedTimesheets = useMemo(() =>
    timesheets
      .filter(timesheet => timesheet.includeInReport)  // Filter only included timesheets
      .sort((a, b) => dayOrder.indexOf(getDayOfWeek(a.date)) - dayOrder.indexOf(getDayOfWeek(b.date))),
    [timesheets]
  );

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });


  const groupedTimesheets = useMemo(() => {
    return sortedTimesheets.reduce((acc, curr) => {
      const date = formatDate(curr.date);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr.description);
      return acc;
    }, {});
  }, [sortedTimesheets]);

  const calculateWeekNumber = (date) => {
    const startDate = new Date('2024-07-22');
    const currentDate = new Date(date);

    const countWeekdays = (start, end) => {
      let count = 0;
      let day = new Date(start);

      while (day <= end) {
        const dayOfWeek = day.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends (0 = Sunday, 6 = Saturday)
          count++;
        }
        day.setDate(day.getDate() + 1);
      }

      return count;
    };

    const totalWeekdays = countWeekdays(startDate, currentDate);
    return Math.floor(totalWeekdays / 5); // 5 weekdays in a week
  };




  const firstDate = sortedTimesheets.length > 0 ? formatDate(sortedTimesheets[0].date) : null;
  const lastDate = sortedTimesheets.length > 0 ? formatDate(sortedTimesheets[sortedTimesheets.length - 1].date) : null;
  const weekNumber = firstDate ? calculateWeekNumber(firstDate) : 0;

  function splitContentIntoSections() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.visibility = 'hidden';
    document.body.appendChild(container);

    let currentHeight = 0;
    let currentSection = [];
    const tempSections = [];

    Object.entries(groupedTimesheets).forEach(([date, descriptions]) => {
      const row = document.createElement('div');
      row.style.margin = '10px 0';

      const dateElem = document.createElement('span');
      dateElem.textContent = date;
      dateElem.style.fontWeight = 'bold';
      row.appendChild(dateElem);

      const descElem = document.createElement('div');
      descElem.innerHTML = descriptions.map(desc => `<div>${desc}</div>`).join('');
      row.appendChild(descElem);

      container.appendChild(row);
      const rowHeight = row.scrollHeight;

      // Check if adding this row would exceed the available content height
      if (currentHeight + rowHeight > CONTENT_HEIGHT) {
        // If yes, start a new section

        tempSections.push(currentSection);
        currentSection = [{ date, descriptions }];
        currentHeight = rowHeight; // Reset current height for new section
      } else {
        // Otherwise, add the row to the current section
        currentSection.push({ date, descriptions });
        currentHeight += rowHeight;
        console.log('Intern Signature URL:', user?.internSignature);

      }

      container.removeChild(row);
    });

    if (currentSection.length > 0) {
      tempSections.push(currentSection);
    }

    document.body.removeChild(container);
    setSections(tempSections);
  }


  useEffect(() => {
    splitContentIntoSections();
  }, [groupedTimesheets]);

  async function handleDownload() {
    const pdf = new jsPDF('p', 'mm', [216, 330]);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < sections.length; i++) {
      const canvas = await html2canvas(reportRefs.current[i], {
        scale: 2,
        useCORS: true,
        width: pageWidth * 3.7795,
        height: pageHeight * 3.7795,
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth;
      const imgHeight = canvas.height * (imgWidth / canvas.width);

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      if (i < sections.length - 1) {
        pdf.addPage();
      }
    }

    // Use the user's display name from the TopBar (which is already their initials)
    const displayName = user?.name || 'Student'; // Default to 'Student' if name is unavailable

    // Define the name of the PDF file using the display name (initials) from TopBar
    const fileName = `${notificationUser?.name || 'Student'} - Week ${weekNumber}.pdf`;

    // Save the PDF with the custom name
    pdf.save(fileName);
  }
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
          ref={el => (reportRefs.current[index] = el)}
          className="relative mx-auto bg-white mb-8"
          style={{
            width: '8.5in',
            height: '13in',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Times New Roman, serif', // Set font to Times New Roman
            fontSize: '12pt',
          }}
        >
          <div className="flex flex-col mx-auto h-full w-11/12">
            <WeeklyHeader />
            <hr className="border-t border-black" />
            <div className="flex-1 p-4">
              {index === 0 && (
                <div className="space-y-3">
                  <h1 className="text-center text-lg font-bold">
                    {user?.subjectCode} (300 hours)
                  </h1>
                  <h2 className="text-center text-lg mb-8 font-bold">
                    STUDENT’S WEEKLY REPORT ON ACTIVITIES
                  </h2>
                </div>
              )}
              {index === 0 && (
                <div className="w-10/12 mx-auto pt-4 text-sm font-semibold">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr>
                        <td className="border-collapse border-black">Name of Student:</td>
                        <td className="border-b border-black">{user?.full_name}</td>
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
              )}
              {index === 0 && (
                <div className={`text-center font-bold text-md pt-5 mb-2 ${index !== 0 ? 'mt-10' : ''}`}>
                  WEEK {weekNumber} ({firstDate} – {lastDate})
                </div>
              )}
              <div className="px-8 ">
                <table className="w-full text-left border-collapse border border-black">

                  <thead>
                    <tr className="border border-black text-center">
                      <th className="border border-black px-4 w-40 text-md">DAY</th>
                      <th className="border border-black px-4 text-md">ACTIVITIES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.map((item, itemIndex) => (
                      <TimesheetItem

                        key={item.date}
                        date={item.date}
                        descriptions={item.descriptions}
                        showDate={itemIndex >= 0}
                        isLastInGroup={itemIndex === section.length - 1}

                      />
                    ))}
                  </tbody>
                </table>
              </div>
              {index === sections.length - 1 && (
                <div className="flex justify-between mx-14 text-sm">
                  <div className="text-left">
                    <div className="h-9"></div>
                    <p className="italic mb-10">Prepared By:</p>
                    <Draggable>
                      {user?.internSignature ? (
                        <img
                          src={user.internSignature}
                          alt="Intern Signature"
                          style={{ width: '300px', height: 'auto', position: 'absolute' }} // Adjust the size of the signature here
                        />
                      ) : (
                        <p>No signature available</p>
                      )}
                    </Draggable>
                    <p className="font-bold">{user?.full_name}</p>
                    <p className="italic mb-7">Trainee/Student</p>

                  </div>
                  <div className="text-left">
                    <div className="h-9"></div>
                    <p className="italic mb-10">Verified and Certified By:</p>
                    <p className="font-bold">Mr. Rene S. Yap</p>
                    <p className="italic">Technical Director</p>
                    <p className="italic">VisibleTeam Solutions OPC</p>
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
