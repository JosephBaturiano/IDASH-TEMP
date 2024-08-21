import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getRandomColor = () => {
  const colors = ['#FFDDDD', '#DDFFDD', '#DDDDFF', '#FFFFDD', '#DDFFFF'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const formatDate = (dateStr) => {
  if (!dateStr) {
    console.error('Invalid date string:', dateStr);
    return 'Invalid Date';
  }

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    console.error('Invalid date object created:', date);
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const ProjectCard = ({ logo, project_title, project_created, assigned_to, progress, link }) => {
  const backgroundColor = getRandomColor();

  return (
    <div className="flex items-center rounded-lg p-4 shadow-md" style={{ backgroundColor }}>
      <div className="w-40 h-40 flex items-center justify-center rounded-full mr-4">
        <img src={logo} alt="Project Icon" className="w-30 h-30" />
      </div>

      <div className="flex-grow">
        <h3 className="text-[18px] font-semibold">{project_title}</h3>
        <p className="text-[18px] text-gray-800">{formatDate(project_created)}</p>
        <p className="text-[16px] text-gray-800">Assigned: {Array.isArray(assigned_to) ? assigned_to.join(', ') : assigned_to}</p>
        <a href={link} className="text-blue-500" target="_blank" rel="noopener noreferrer">View Project</a>
        <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
          <div
            className="h-2.5 rounded-full bg-blue-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [userTeams, setUserTeams] = useState([]);

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}users/me`, {
          headers: {
            'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`),
          },
        });
        setUserTeams(userResponse.data.acf.team); // Assuming 'acf.team' is an array of teams
      } catch (error) {
        console.error('Error fetching user teams:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}project`, {
          headers: {
            'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`),
          },
        });

        const getLogoUrl = async (id) => {
          try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}media/${id}`, {
              headers: {
                'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`),
              },
            });
            return data.source_url;
          } catch (error) {
            console.error('Error fetching logo:', error);
            return '';
          }
        };

        const data = await Promise.all(response.data.map(async (project) => {
          const logoUrl = project.acf.logo ? await getLogoUrl(project.acf.logo) : '';
          return {
            id: project.id,
            logo: logoUrl,
            project_title: project.title.rendered,
            project_created: project.date,
            assigned_to: project.acf.assigned_to,
            progress: Math.floor(Math.random() * 100),
            link: project.link,
          };
        }));

        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchUserTeams();
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (Array.isArray(project.assigned_to)) {
      // If assigned_to is an array, check if any of the user's teams are in the assigned_to array
      return project.assigned_to.some((team) => userTeams.includes(team));
    } else {
      // If assigned_to is a string, just check if it matches one of the user's teams
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
        />
      ))}
    </div>
  );
};

export default ProjectList;
