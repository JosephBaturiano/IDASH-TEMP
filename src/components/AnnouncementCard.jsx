import React from 'react';

const AnnouncementCard = () => {
    return (
        <div>
            <div className="mb-4 p-4 border rounded-lg bg-gray-100">
                <h2 className="font-semibold text-lg">Absence to meeting:</h2>
                <ul className="list-disc pl-5">
                    <li>1st offense: warning</li>
                    <li>2nd offense: 1 day suspension</li>
                    <li>3rd offense: 1 day deduction</li>
                    <li>4th offense: 1 week suspension</li>
                    <li>5th offense: termination</li>
                </ul>
            </div>
            <div className="mb-4 p-4 border rounded-lg bg-gray-100">
                <h2 className="font-semibold text-lg">Tardiness to meeting:</h2>
                <ul className="list-disc pl-5">
                    <li>1st offense: warning</li>
                    <li>2nd offense: 1 hour deduction</li>
                    <li>3rd offense: 3 hours deduction</li>
                    <li>4th offense: 1 day deduction</li>
                    <li>5th offense: 3 days deduction</li>
                </ul>
            </div>
            <div className="p-4 border rounded-lg bg-gray-100">
                <p>
                    Please update your availability for next week on/before Friday 8pm of each week. If you don’t, we will assume you won’t be available. You will <strong>not</strong> be allowed to log your time for that week.
                </p>
            </div>
        </div>
    );
};

export default AnnouncementCard;
