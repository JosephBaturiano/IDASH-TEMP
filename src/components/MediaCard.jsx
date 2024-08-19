import React from 'react';

const MediaCard = ({ name, url }) => (
    <a
        href={url}
        className="flex items-center bg-[#AFD4FB] rounded-lg p-3 shadow-md"
        target="_blank"
        rel="noopener noreferrer"
    >
        <div className="text-2xl mr-3">📁</div>
        <div className="flex-grow font-bold">{name}</div>
        <div className="cursor-pointer">⋮</div>
    </a>
);

export default MediaCard;

