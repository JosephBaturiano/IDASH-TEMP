import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const AnnouncementCard = () => {
    const { announcements, loading, error } = useNotification();
    const { theme } = useTheme(); // Get the current theme

    // Define colors based on the current theme
    const cardBgColor = theme === 'dark' ? '#1a202c' : '#ffffff'; // Dark gray for dark mode, white for light mode
    const cardBorderColor = theme === 'dark' ? '#2d3748' : '#e2e8f0'; // Darker border for dark mode, light border for light mode
    const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800'; // Light text for dark mode, dark text for light mode

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className={`font-semibold text-lg mb-2 ${textColor}`}>Announcements</h2>
            {announcements.length === 0 ? (
                <p className={`${textColor}`}>No announcements available</p>
            ) : (
                announcements.map((announcement) => (
                    <div
                        key={announcement.id}
                        className={`mb-4 p-4 border rounded-lg shadow-md ${textColor}`}
                        style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }}
                    >
                        <h2 className={`font-semibold text-lg ${textColor}`}>
                            {announcement.title.rendered}
                        </h2>
                        <div
                            className={`mt-2 ${textColor}`}
                            dangerouslySetInnerHTML={{ __html: announcement.content.rendered }}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default AnnouncementCard;
