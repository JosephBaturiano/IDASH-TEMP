import React from 'react';

const WeeklyContent = () => {
  return (
    <div>
      {/* Table */}
      <table className="w-full text-left border-collapse border border-black">
        <thead>
          <tr className="border border-black">
            <th className="border border-black px-4 py-2">DAY</th>
            <th className="border border-black px-4 py-2">ACTIVITIES</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border border-black">
            <td className="border border-black px-4 py-2">July 24, 2024</td>
            <td className="border border-black px-4 py-2">
              Completing the Gforms: Application for Unpaid Part-Time IT Internship Program
              <br />Download and Install Local
              <br />Read and Understand Markdown
              <br />Install Screencastify Chrome Extension
              <br />Install Katalon Recorder Chrome Extension
            </td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black px-4 py-2">July 25, 2024</td>
            <td className="border border-black px-4 py-2">
              Daily Meeting
              <br />Team Meeting
              <br />Research WordPress and Elementor
              <br />Watch Basic WordPress and Elementor Pro Tutorial
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyContent;
