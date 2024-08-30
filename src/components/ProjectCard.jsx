import React from 'react';
import { useProjects, formatDate } from '../context/ProjectContext';

const ProjectCard = ({ logo, project_title, project_created, assigned_to, progress, link, color }) => {
  return (
    <div className="flex items-center rounded-lg p-4 shadow-md" style={{ backgroundColor: color }}>
      <div className="w-40 h-40 flex items-center justify-center rounded-full mr-4">
        <img src={logo} alt="Project Icon" className="w-30 h-30" />
      </div>

      <div className="flex-grow">
        <h3 className="text-[18px] font-semibold">{project_title}</h3>
        <p className="text-[18px] text-gray-800">{formatDate(project_created)}</p>
        <p className="text-[16px] text-gray-800">Assigned: {Array.isArray(assigned_to) ? assigned_to.join(', ') : assigned_to}</p>
        <a href={link} className="text-blue-500" target="_blank" rel="noopener noreferrer">View Project</a>
        <div className="flex items-center">
          <div className="w-full bg-gray-300 rounded-full dark:bg-gray-700 flex items-center">
            <div
              className={`text-xs font-medium text-white bg-slate-700 text-left p-1.5 leading-none rounded-full`}
              style={{width: `${progress}%` }}
            >
            </div>
          </div>
          <div className="ml-6 text-slate-900 font-bold">{progress}%</div>
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
