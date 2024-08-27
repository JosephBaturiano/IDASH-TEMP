import React from 'react';
import { useNotification } from '../context/NotificationContext';

const AnnouncementCard = () => {
    const { announcements, loading, error } = useNotification();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="font-semibold text-lg mb-2">Announcements</h2>
            {announcements.length === 0 ? (
                <p>No announcements available</p>
            ) : (
                announcements.map((announcement) => (
                    <div key={announcement.id} className="mb-4 p-4 border rounded-lg bg-white shadow-md">
                        <h2 className="font-semibold text-lg">{announcement.title.rendered}</h2>
                        <div dangerouslySetInnerHTML={{ __html: announcement.content.rendered }} />
                    </div>
                ))
            )}
        </div>
    );
};

export default AnnouncementCard;
