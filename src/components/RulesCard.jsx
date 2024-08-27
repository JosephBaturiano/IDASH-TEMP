import React, { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';

const RulesCard = () => {
    const { rules, loading, error } = useNotification();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="font-semibold text-lg mb-2">Rules</h2>
            {rules.length === 0 ? (
                <p>No rules available</p>
            ) : (
                rules.map((rule) => (
                    <div key={rule.id} className="mb-4 p-4 border rounded-lg bg-white shadow-md">
                        <h3 className="font-semibold text-lg">{rule.title.rendered}</h3>
                        <div dangerouslySetInnerHTML={{ __html: rule.content.rendered }} />
                    </div>
                ))
            )}
        </div>
    );
};

export default RulesCard;
