import React from 'react';

const WeeklyContent = ({ description }) => {
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
              {description || 'No description available'} 
            </td>   
          </tr>
          <tr className="border border-black">
            <td className="border border-black px-4 py-2">July 24, 2024</td>
            <td className="border border-black px-4 py-2">
              {description || 'No description available'} 
            </td>   
          </tr>

          <tr className="border border-black">
            <td className="border border-black px-4 py-2">July 24, 2024</td>
            <td className="border border-black px-4 py-2">
              {description || 'No description available'} 
            </td>   
          </tr>
          <tr className="border border-black">
            <td className="border border-black px-4 py-2">July 24, 2024</td>
            <td className="border border-black px-4 py-2">
              {description || 'No description available'} 
            </td>   
          </tr>
          <tr className="border border-black">
            <td className="border border-black px-4 py-2">July 24, 2024</td>
            <td className="border border-black px-4 py-2">
              {description || 'No description available'} 
            </td>   
          </tr>
          <tr className="border border-black">
            <td className="border border-black px-4 py-2">July 24, 2024</td>
            <td className="border border-black px-4 py-2">
              {description || 'No description available'} 
            </td>   
          </tr>
                    <tr className="border border-black">
            <td className="border border-black px-4 py-2">July 24, 2024</td>
            <td className="border border-black px-4 py-2">
              {description || 'No description available'} 
            </td>   
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyContent;
