import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const RulesCard = () => {
    const { rules, loading, error } = useNotification();
    const { theme } = useTheme(); // Get the current theme

    // Define colors based on the current theme
    const cardBgColor = theme === 'dark' ? '#2d3748' : '#ffffff'; // Darker background for dark mode
    const cardTextColor = theme === 'dark' ? '#edf2f7' : '#2d3748'; // Lighter text for dark mode
    const borderColor = theme === 'dark' ? '#4a5568' : '#e2e8f0'; // Border color for dark mode

    if (loading) return <p className={cardTextColor}>Loading...</p>;
    if (error) return <p className={cardTextColor}>Error: {error}</p>;

    return (
        <div>
            <h2 className={`font-semibold text-lg mb-2 ${cardTextColor}`}>Rules</h2>
            {rules.length === 0 ? (
                <p className={cardTextColor}>No rules available</p>
            ) : (
                rules.map((rule) => (
                    <div
                        key={rule.id}
                        className={`mb-4 p-4 border rounded-lg shadow-md`}
                        style={{ backgroundColor: cardBgColor, borderColor: borderColor }}
                    >
                        <h3 className={`font-semibold text-lg ${cardTextColor}`}>{rule.title.rendered}</h3>
                        <div
                            dangerouslySetInnerHTML={{ __html: rule.content.rendered }}
                            className={cardTextColor}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default RulesCard;
