import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import ProfileBadges from '../components/ProfileBadges';
import ProfileAbout from '../components/ProfileAbout';
import ProfileDirectory from '../components/ProfileDirectory';
import EditProfileModal from '../components/EditProfileModal';
import EditBadgesModal from '../components/EditBadgesModal';
import Home from './Home';

const Profile = () => {
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
  const [modalOpen, setModalOpen] = useState(false);
  const [editBadgesModalOpen, setEditBadgesModalOpen] = useState(false);
  const ojtTime = "00:00:00";

  useEffect(() => {
    const config = {
      method: 'get',
      url: import.meta.env.VITE_API_BASE_URL + 'users/me',
      headers: {
        'Authorization': 'Basic ' + btoa(import.meta.env.VITE_AUTH_USERNAME + ':' + import.meta.env.VITE_AUTH_PASSWORD),
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
          name: acfData.name,
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
    .then((response) => {
      console.log('Profile updated successfully');
      setProfileData(prevData => ({
        ...prevData,
        ...updatedProfileData,
      }));
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
          <ProfileAbout about={profileData.about} />
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
      </div>
    </Home>
  );
};

export default Profile;
