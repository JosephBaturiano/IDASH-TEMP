import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getRandomColor = () => {
  const colors = ['#FFDDDD', '#DDFFDD', '#DDDDFF', '#FFFFDD', '#DDFFFF'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const formatDate = (dateStr) => {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6) - 1; // Months are 0-based
  const day = dateStr.substring(6, 8);

  const date = new Date(year, month, day);
  
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
      {/* Icon */}
      <div className="w-40 h-40 flex items-center justify-center rounded-full mr-4">
        <img src={logo} alt="Project Icon" className="w-30 h-30" />
      </div>

      {/* Project Details */}
      <div className="flex-grow">
        <h3 className="text-[18px] font-semibold">{project_title}</h3>
        <p className="text-[18px] text-gray-800">{formatDate(project_created)}</p>
        <p className="text-[16px] text-gray-800">Assigned: {assigned_to}</p>
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://jbm-acf.local/wp-json/wp/v2/project', {
          headers: {
            'Authorization': 'Basic ' + btoa('admin:oML3 3mDp p9D5 tM9w RLkm OKDH'),
          },
        });

        // Log the raw API response
        console.log('API Response:', response.data);

        const getLogoUrl = async (id) => {
          try {
            const { data } = await axios.get(`https://jbm-acf.local/wp-json/wp/v2/media/${id}`, {
              headers: {
                'Authorization': 'Basic ' + btoa('admin:oML3 3mDp p9D5 tM9w RLkm OKDH'),
              },
            });
            return data.source_url; // Adjust this if the field is different
          } catch (error) {
            console.error('Error fetching logo:', error);
            return ''; // Return empty string if there’s an error
          }
        };

        const data = await Promise.all(response.data.map(async (project) => {
          const logoUrl = project.acf.logo ? await getLogoUrl(project.acf.logo) : ''; // Fetch logo URL
          return {
            id: project.id,
            logo: logoUrl,
            project_title: project.title.rendered,
            project_created: project.acf.project_created,
            assigned_to: project.acf.assigned_to,
            progress: Math.floor(Math.random() * 100), // Random progress value
            link: project.link, // Link to the project
          };
        }));

        // Log the processed data
        console.log('Processed Data:', data);

        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="space-y-4">
      {projects.map((project) => (
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
