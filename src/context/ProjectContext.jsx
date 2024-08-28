import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Define a set of colors
const predefinedColors = [
    '#FFDDDD', // Light Pink
    '#DDFFDD', // Light Green
    '#DDDDFF', // Light Blue
    '#FFFFDD', // Light Yellow
    '#DDFFFF', // Light Cyan
    '#FFCCDD', // Pastel Pink
    '#CCFFCC', // Pastel Green
    '#CCCCFF', // Pastel Blue
    '#FFFFCC', // Pastel Yellow
    '#CCFFFF', // Pastel Cyan
    '#FFCCFF', // Pastel Lavender
    '#FFDAB9', // Peach Puff
    '#E6E6FA', // Lavender
    '#F5F5DC', // Beige
    '#F0EAD6', // Linen
    '#D3FFD3', // Honeydew
    '#E0FFFF', // Light Cyan
    '#F5F5F5', // White Smoke
  ];

const ProjectContext = createContext();

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

const ProjectProvider = ({ children }) => {
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
  
        const data = await Promise.all(response.data.map(async (project, index) => {
          const logoUrl = project.acf.logo ? await getLogoUrl(project.acf.logo) : '';
          return {
            id: project.id,
            logo: logoUrl,
            project_title: project.title.rendered,
            project_created: project.date,
            assigned_to: project.acf.assigned_to,
            progress: project.acf.progress,
            link: project.link,
            color: predefinedColors[index % predefinedColors.length], // Assign color based on index
          };
        }));
  
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
  
    fetchUserTeams();
    fetchProjects();
  
    const intervalId = setInterval(() => {
      fetchUserTeams();
      fetchProjects();
    }, 600000); // Poll every 10 minutes (600000 ms)
  
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  

  return (
    <ProjectContext.Provider value={{ projects, userTeams }}>
      {children}
    </ProjectContext.Provider>
  );
};

const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export { ProjectProvider, useProjects, formatDate };
