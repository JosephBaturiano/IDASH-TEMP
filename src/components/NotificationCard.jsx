
import React from 'react';

const NotificationCard = ({ notifications }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-4">Notifications</h3>
      <ul className="space-y-2 text-[20px]">
        {notifications.map((notification, index) => (
          <li key={index} className="flex justify-between p-4 items-center bg-gray-100 rounded-lg">
            <div>
              <p className="text-sm text-[20px] pb-2">{notification.message}</p>
              <p className="text-xs text-gray-500 pb-2 text-[20px]">{notification.date}</p>
            </div>
            <button className="bg-yellow-400 text-black text-[15px] px-2 py-1 rounded">
              {notification.action}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationCard;