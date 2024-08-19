import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RulesCard = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                // Replace with your WordPress REST API endpoint for the 'rules' custom post type
                const response = await axios.get('https://cjo-acf.local/wp-json/wp/v2/rule');
                setRules(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRules();
    }, []);

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
                        <h3 className="font-semibold text-md">{rule.title.rendered}</h3>
                        <div dangerouslySetInnerHTML={{ __html: rule.content.rendered }} />
                    </div>
                ))
            )}
        </div>
    );
};

export default RulesCard;
