import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CallIcon from '@mui/icons-material/Call';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    university: '',
    address: '',
    email: '',
    telephone: '',
    badgeOne: '',
    badgeTwo: '',
    about: '',
  });
  const ojtTime = "00:00:00";

  useEffect(() => {
    // Fetching updated data from the WordPress API
    let config = {
      method: 'get',
      url: 'http://edl-wp1.local/wp-json/wp/v2/users/me',
      headers: { 
        'Authorization': 'Basic dXNlcjo2VmlIIGcxelAgR2xEUiBoT0NzIFExTWsgTVVLUw==',
      },
    };

    axios.request(config)
      .then((response) => {
        const acfData = response.data.acf;  // Accessing the ACF fields
        setProfileData({
          university: acfData.university,
          address: acfData.address,
          email: acfData.email,
          telephone: acfData.telephone,
          badgeOne: acfData.badge_one, // Adjusted for ACF field names
          badgeTwo: acfData.badge_two, // Adjusted for ACF field names
          about: acfData.about,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // Empty dependency array ensures this runs only once after the initial render

  return (
    <div className="flex justify-center items-start gap-10 bg-[#f0f8ff]">  {/* Center the containers */}
      {/* Left section */}
      <div className="flex flex-col justify-between">  {/* Stack the elements vertically */}
        <div className="bg-white rounded-lg shadow-md h-[600px] w-[400px] my-16 flex flex-col items-center p-10">  {/* Center the image */}
          <img
            src="src/assets/your-logo.png"
            alt="APS"
            className="rounded-3xl w-[250px] h-[250px] object-cover mb-2"
          />
          <h2 className="text-center text-2xl font-medium mb-5">Maraiah Queen Arceta</h2>

          <div className="container flex bg-[#c3ffc7] rounded-3xl shadow-md h-[70px] w-[250px] mb-7 p-4 flex items-center justify-center flex-col">
            <span className="text-xs font-semibold text-gray-600">Time Rendered</span>
            <span className="text-lg font-medium">{ojtTime}</span>
          </div>
          <div className="flex flex-col text-left space-y-1"> {/* Align text to the left and add vertical spacing */}
            <div className="flex items-center space-x-4"> {/* Flex container to align icon and text */}
              <SchoolIcon className="text-black" />
              <p className="text-sm">{profileData.university}</p>
            </div>
            <div className="flex items-center space-x-4"> {/* Flex container to align icon and text */}
              <LocationOnIcon className="text-black" />
              <p className="text-sm">{profileData.address}</p>
            </div>
            <div className="flex items-center space-x-4"> {/* Flex container to align icon and text */}
              <AlternateEmailIcon className="text-black" />
              <p className="text-sm">{profileData.email}</p>
            </div>
            <div className="flex items-center space-x-4"> {/* Flex container to align icon and text */}
              <CallIcon className="text-black" />
              <p className="text-sm">{profileData.telephone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between h-[600px] my-16">  {/* Stack the elements vertically */}
        <div className="bg-[#dbedff] rounded-lg shadow-md h-[180px] w-[600px] overflow-hidden"> {/* Ensure the container hides overflow */}
          <h2 className="text-2xl font-medium px-5 pt-3">Badges</h2>
          <div className="flex gap-4 px-4 pt-1">
            <img src={profileData.badgeOne} alt="React Badge" className="h-[130px] w-[130px]" />
            <img src={profileData.badgeTwo} alt="TensorFlow Badge" className="h-[130px] w-[130px]" />
          </div>
        </div>

        <div className="bg-[#dbedff] rounded-lg shadow-md h-[180px] w-[600px]">
          <h2 className="text-2xl font-medium px-5 pt-3">About Me</h2>
          <div className="px-5 pt-3"> {/* Added padding */}
            <p className="text-sm text-gray-700 text-justify">{profileData.about}</p>
          </div>
        </div>

        <div className="bg-[#dbedff] rounded-lg shadow-md h-[150px] w-[600px]">
          <h2 className="text-2xl font-medium px-5 pt-3 mb-5">Directory</h2>
          <div className="flex gap-8 px-4 pt-1">
            <a href="https://github.com/vt4b" target="_blank" rel="noopener noreferrer">
              <img src="src/assets/github-logo.png" alt="github" className="h-[60px] w-[60px]" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
              <img src="src/assets/discord-logo.png" alt="discord" className="h-[60px] w-[60px]" />
            </a>
            <a href="https://drive.google.com/drive/folders/1wKjQNXLYTmaqTpsEOyZgol4JpFmnvjfW" target="_blank" rel="noopener noreferrer">
              <img src="src/assets/gdrive-logo.png" alt="gdrive" className="h-[60px] w-[60px]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
