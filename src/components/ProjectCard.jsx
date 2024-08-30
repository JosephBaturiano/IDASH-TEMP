import React from 'react';
import { useProjects, formatDate } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const ProjectCard = ({ logo, project_title, project_created, assigned_to, progress, link, color }) => {
  const { theme } = useTheme(); // Get the current theme

  // Define colors for light and dark themes
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const bgColor = theme === 'light' ? 'bg-gray-100' : 'bg-gray-800';
  const progressBarColor = theme === 'light' ? 'bg-slate-700' : 'bg-slate-400';

  // Override the color prop with theme colors if you want to use theme-specific colors
  const cardBgColor = theme === 'dark' ? 'bg-gray-800' : color;

  return (
    <div className={`flex items-center rounded-lg p-4 shadow-md ${bgColor}`} style={{ backgroundColor: cardBgColor }}>
      <div className="w-40 h-40 flex items-center justify-center rounded-full mr-4">
        <img src={logo} alt="Project Icon" className="w-30 h-30" />
      </div>

      <div className="flex-grow">
        <h3 className={`text-[18px] font-semibold ${textColor}`}>{project_title}</h3>
        <p className={`text-[18px] ${textColor}`}>{formatDate(project_created)}</p>
        <p className={`text-[16px] ${textColor}`}>Assigned: {Array.isArray(assigned_to) ? assigned_to.join(', ') : assigned_to}</p>
        <a href={link} className="text-blue-500" target="_blank" rel="noopener noreferrer">View Project</a>
        <div className="flex items-center">
          <div className={`w-full bg-gray-300 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} flex items-center`}>
            <div
              className={`text-xs font-medium text-white ${progressBarColor} text-left p-1.5 leading-none rounded-full`}
              style={{ width: `${progress}%` }}
            >
            </div>
          </div>
          <div className={`ml-6 font-bold ${textColor}`}>{progress}%</div>
        </div>
      </div>
    </div>
  );
};

const ProjectList = () => {
  const { projects, userTeams } = useProjects();

  const filteredProjects = projects.filter((project) => {
    if (Array.isArray(project.assigned_to)) {
      return project.assigned_to.some((team) => userTeams.includes(team));
    } else {
      return userTeams.includes(project.assigned_to);
    }
  });

  return (
    <div className="space-y-4">
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.id}
          logo={project.logo}
          project_title={project.project_title}
          project_created={project.project_created}
          assigned_to={project.assigned_to}
          progress={project.progress}
          link={project.link}
          color={project.color} // Pass the color here
        />
      ))}
    </div>
  );
};

export default ProjectList;
