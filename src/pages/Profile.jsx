import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CallIcon from '@mui/icons-material/Call';
import EditIcon from '@mui/icons-material/Edit'; // Import the Edit icon
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import EditProfileModal from '../components/EditProfileModal'; // Import the modal component

const Profile = ({ children }) => {
  const [profileData, setProfileData] = useState({
    university: '',
    address: '',
    email: '',
    telephone: '',
    badgeOne: '',
    badgeTwo: '',
    badgeThree: '',
    about: '',
    user: '',
  });
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const ojtTime = "00:00:00";

  useEffect(() => {
    let config = {
      method: 'get',
      url: 'https://idash.visible.team/wp-json/wp/v2/users/me',
      headers: {
        'Authorization': 'Basic RURMOlZPdUsgMTBNZCB4MGpUIG14WDAgV3JlUCB4dGlv',
      },
    };

    axios.request(config)
      .then(async (response) => {
        const acfData = response.data.acf;

        const badgeOneUrl = acfData['badge-one'] ? await fetchImageUrl(acfData['badge-one']) : '';
        const badgeTwoUrl = acfData['badge-two'] ? await fetchImageUrl(acfData['badge-two']) : '';
        const badgeThreeUrl = acfData['badge-three'] ? await fetchImageUrl(acfData['badge-three']) : '';
        const userUrl = acfData['user'] ? await fetchImageUrl(acfData['user']) : '';

        setProfileData({
          university: acfData.university,
          address: acfData.address,
          email: acfData.email,
          telephone: acfData.telephone,
          badgeOne: badgeOneUrl,
          badgeTwo: badgeTwoUrl,
          badgeThree: badgeThreeUrl,
          user: userUrl,
          about: acfData.about,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fetchImageUrl = async (imageId) => {
    try {
      const response = await axios.get(`https://idash.visible.team/wp-json/wp/v2/media/${imageId}`); 
      return response.data.source_url;
    } catch (error) {
      console.error('Error fetching image URL:', error);
      return '';
    }
  };

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveProfile = (updatedProfileData) => {
    // Preserve the current profile photo URL
    const updatedData = {
      ...updatedProfileData,
      user: profileData.user, // Include the profile photo URL if needed
    };
  
    // Update profile data in WordPress
    axios.post('https://idash.visible.team/wp-json/wp/v2/users/me', updatedData, {
      headers: {
        'Authorization': 'Basic RURMOlZPdUsgMTBNZCB4MGpUIG14WDAgV3JlUCB4dGlv',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log('Profile updated successfully');
      // Update state with new data
      setProfileData(prevData => ({
        ...prevData,
        ...updatedProfileData,
      }));
    })
    .catch((error) => {
      console.error('Error updating profile:', error);
    });
  };  

  return (
    <main className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-[17%] h-full fixed">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-[83%] ml-[17%]">
        <TopBar />
        <div className="p-4 bg-[#F0F8FF] h-full overflow-auto">
          <div className="flex justify-center items-stretch gap-10 h-full"> {/* Centralize content */}
            {/* Left Section */}
            <div className="flex flex-col items-center h-full">
              <div className="bg-white rounded-lg shadow-md w-[400px] p-6 mb-10 h-full relative">
                {profileData.user && (
                  <div className="relative group">
                    <img
                      src={profileData.user}
                      alt="Profile"
                      className="rounded-3xl w-full h-[250px] w-[225px] object-cover mb-2 mx-auto"
                    />
                    <div
                      onClick={handleEditClick}
                      className="absolute top-2 right-2 bg-gray-700 bg-opacity-50 p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <EditIcon className="text-white" />
                    </div>
                  </div>
                )}
                <h2 className="text-center text-2xl font-medium mb-5">Maraiah Queen Arceta</h2>

                <div className="flex flex-col items-center bg-[#c3ffc7] rounded-3xl shadow-md p-4 mb-5 w-[300px] mx-auto">
                  <span className="text-xs font-semibold text-gray-600">Time Rendered</span>
                  <span className="text-lg font-medium">{ojtTime}</span>
                </div>
                <div className="space-y-3 px-6">
                  <div className="flex items-center space-x-4">
                    <SchoolIcon className="text-black" />
                    <p className="text-sm">{profileData.university}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <LocationOnIcon className="text-black" />
                    <p className="text-sm">{profileData.address}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <AlternateEmailIcon className="text-black" />
                    <p className="text-sm">{profileData.email}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <CallIcon className="text-black" />
                    <p className="text-sm">{profileData.telephone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-center h-full">
              <div className="bg-[#dbedff] rounded-lg shadow-md w-[600px] h-[170px] p-5 mb-8">
                <h2 className="text-2xl font-medium mb-2">Badges</h2>
                <div className="flex gap-4 px-1 pt-1">
                  {profileData.badgeOne && (
                    <img src={profileData.badgeOne} alt="Badge 1" className="h-[90px] w-[90px]" />
                  )}
                  {profileData.badgeTwo && (
                    <img src={profileData.badgeTwo} alt="Badge 2" className="h-[90px] w-[90px]" />
                  )}
                  {profileData.badgeThree && (
                    <img src={profileData.badgeThree} alt="Badge 3" className="h-[90px] w-[90px]" />
                  )}
                </div>
              </div>

              <div className="bg-[#dbedff] rounded-lg shadow-md w-[600px] h-[210px] p-5 mb-8 overflow-hidden">
                <h2 className="text-2xl font-medium mb-2">About Me</h2>
                <div className="px-1 h-[160px] overflow-y-auto"> {/* Contain text overflow */}
                  <p className="text-sm text-gray-700 text-justify">{profileData.about}</p>
                </div>
              </div>

              <div className="bg-[#dbedff] rounded-lg shadow-md w-[600px] p-5">
                <h2 className="text-2xl font-medium mb-5">Directory</h2>
                <div className="flex gap-8">
                  <a href="https://github.com/vt4b" target="_blank" rel="noopener noreferrer">
                    <img src="src/assets/github-logo.png" alt="github" className="h-[50px] w-[50px]" />
                  </a>
                  <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                    <img src="src/assets/discord-logo.png" alt="discord" className="h-[50px] w-[50px]" />
                  </a>
                  <a href="https://drive.google.com/drive/folders/1wKjQNXLYTmaqTpsEOyZgol4JpFmnvjfW" target="_blank" rel="noopener noreferrer">
                    <img src="src/assets/gdrive-logo.png" alt="gdrive" className="h-[50px] w-[50px]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for editing profile */}
      <EditProfileModal
        open={modalOpen}
        onClose={handleCloseModal}
        profileData={profileData}
        onSave={handleSaveProfile}
      />
    </main>
  );
};

export default Profile;