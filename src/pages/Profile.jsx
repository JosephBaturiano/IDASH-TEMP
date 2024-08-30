import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import ProfileBadges from '../components/ProfileBadges';
import ProfileAbout from '../components/ProfileAbout';
import ProfileDirectory from '../components/ProfileDirectory';
import EditProfileModal from '../components/EditProfileModal';
import EditBadgesModal from '../components/EditBadgesModal';
import EditAboutModal from '../components/EditAboutModal'; // Import the EditAboutModal
import Home from './Home';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    full_name: '',
    university: '',
    address: '',
    email: '',
    telephone: '',
    badgeOne: '',
    badgeTwo: '',
    badgeThree: '',
    about: '',
    user_profile: '',
    team: [],
    ojtAdviser: '',
    subjectCode: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editBadgesModalOpen, setEditBadgesModalOpen] = useState(false);
  const [editAboutModalOpen, setEditAboutModalOpen] = useState(false); // State for the EditAboutModal
  const ojtTime = "00:00:00";

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const config = {
      method: 'get',
      url: import.meta.env.VITE_API_BASE_URL + 'users/me',
      headers: {
        'Authorization': 'Basic ' + btoa(import.meta.env.VITE_AUTH_USERNAME + ':' + import.meta.env.VITE_AUTH_PASSWORD),
      },
    };

    try {
      const response = await axios.request(config);
      const acfData = response.data.acf;

      const badgeOneUrl = acfData['badge-one'] ? await fetchImageUrl(acfData['badge-one']) : '';
      const badgeTwoUrl = acfData['badge-two'] ? await fetchImageUrl(acfData['badge-two']) : '';
      const badgeThreeUrl = acfData['badge-three'] ? await fetchImageUrl(acfData['badge-three']) : '';
      const userProfileUrl = acfData['user_profile'] ? await fetchImageUrl(acfData['user_profile']) : '';

      setProfileData({
        full_name: acfData.full_name,
        university: acfData.university,
        address: acfData.address,
        email: acfData.email,
        telephone: acfData.telephone,
        badgeOne: badgeOneUrl,
        badgeTwo: badgeTwoUrl,
        badgeThree: badgeThreeUrl,
        user_profile: userProfileUrl,
        about: acfData.about,
        team: acfData.team || [],
        ojtAdviser: acfData.ojt_adviser || '',
        subjectCode: acfData.subject_code || '',
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchImageUrl = async (imageId) => {
    if (!imageId) return '';
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}media/${imageId}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(import.meta.env.VITE_AUTH_USERNAME + ':' + import.meta.env.VITE_AUTH_PASSWORD),
        },
      });
      return response.data.source_url;
    } catch (error) {
      console.error(`Error fetching image URL for imageId ${imageId}:`, error.message);
      return 'https://via.placeholder.com/90'; // Placeholder image
    }
  };

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveProfile = (updatedProfileData) => {
    axios.post(import.meta.env.VITE_API_BASE_URL + 'users/me', updatedProfileData, {
      headers: {
        'Authorization': 'Basic ' + btoa(import.meta.env.VITE_AUTH_USERNAME + ':' + import.meta.env.VITE_AUTH_PASSWORD),
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        console.log('Profile updated successfully');
        fetchProfileData(); // Refetch profile data to get the updated user_profile URL
        handleCloseModal();
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  const handleEditBadgesClick = () => {
    setEditBadgesModalOpen(true);
  };

  const handleCloseEditBadgesModal = () => {
    setEditBadgesModalOpen(false);
  };

  const handleSaveBadges = (updatedBadges) => {
    setProfileData(prevData => ({
      ...prevData,
      ...updatedBadges,
    }));
    handleCloseEditBadgesModal();
  };

  const handleDeleteBadge = (badgeType) => {
    setProfileData(prevData => ({
      ...prevData,
      [badgeType]: '', // Set badge URL to an empty string
    }));
  };

  const handleEditAboutClick = () => {
    setEditAboutModalOpen(true); // Open the "Edit About Me" modal
  };

  const handleCloseEditAboutModal = () => {
    setEditAboutModalOpen(false);
  };

  const handleSaveAbout = (updatedAbout) => {
    setProfileData(prevData => ({
      ...prevData,
      about: updatedAbout.aboutText, // Update about text
      team: updatedAbout.team,
      ojtAdviser: updatedAbout.ojtAdviser,
      subjectCode: updatedAbout.subjectCode,
    }));
    handleCloseEditAboutModal();
  };

  return (
    <Home>
      <div className="flex justify-center items-start space-x-5">
        <ProfileCard profileData={profileData} ojtTime={ojtTime} handleEditClick={handleEditClick} />
 
        <div className="flex flex-col space-y-8">
          <ProfileBadges
            badgeOne={profileData.badgeOne}
            badgeTwo={profileData.badgeTwo}
            badgeThree={profileData.badgeThree}
            onEditClick={handleEditBadgesClick}
            onDeleteBadge={handleDeleteBadge}
          />
          <ProfileAbout
            about={profileData.about}
            ojtAdviser={profileData.ojtAdviser}
            subjectCode={profileData.subjectCode}
            team={profileData.team}
            onEditClick={handleEditAboutClick}
          />
          <ProfileDirectory />
        </div>
 
        {modalOpen && (
          <EditProfileModal
            profileData={profileData}
            onClose={handleCloseModal}
            onSave={handleSaveProfile}
          />
        )}
 
        {editBadgesModalOpen && (
          <EditBadgesModal
            badges={profileData}
            onClose={handleCloseEditBadgesModal}
            onSave={handleSaveBadges}
          />
        )}
 
        {editAboutModalOpen && (
          <EditAboutModal
            aboutData={{
              team: profileData.team || [],
              ojtAdviser: profileData.ojtAdviser || '',
              subjectCode: profileData.subjectCode || '',
              aboutText: profileData.about || '',
            }}
            onClose={handleCloseEditAboutModal}
            onSave={handleSaveAbout}
          />
        )}
      </div>
    </Home>
  );  
};

export default Profile;
