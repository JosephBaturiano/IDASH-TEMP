import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import ProfileBadges from '../components/ProfileBadges';
import ProfileAbout from '../components/ProfileAbout';
import ProfileDirectory from '../components/ProfileDirectory';
import EditProfileModal from '../components/EditProfileModal';
import EditBadgesModal from '../components/EditBadgesModal';
import EditAboutModal from '../components/EditAboutModal';
import EditSignatureModal from '../components/EditSignatureModal'; // Import the EditSignatureModal
import InternSignature from '../components/InternSignature'; // Import the InternSignature component
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
    groupLeader: false,
    internSignature: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editBadgesModalOpen, setEditBadgesModalOpen] = useState(false);
  const [editAboutModalOpen, setEditAboutModalOpen] = useState(false);
  const [editSignatureModalOpen, setEditSignatureModalOpen] = useState(false); // State for the EditSignatureModal
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
      const internSignatureUrl = acfData['intern_signature'] ? await fetchImageUrl(acfData['intern_signature']) : '';

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
        groupLeader: acfData.group_leader === 'Group Leader',
        internSignature: internSignatureUrl, // Set intern signature URL
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

  const handleSaveBadges = async (updatedBadges) => {
    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL + 'users/me', updatedBadges, {
        headers: {
          'Authorization': 'Basic ' + btoa(import.meta.env.VITE_AUTH_USERNAME + ':' + import.meta.env.VITE_AUTH_PASSWORD),
          'Content-Type': 'application/json',
        },
      });
      console.log('Badges updated successfully');
      await fetchProfileData(); // Fetch latest data
      handleCloseEditBadgesModal();
    } catch (error) {
      console.error('Error updating badges:', error);
    }
  };

  const handleDeleteBadge = (badgeType) => {
    setProfileData(prevData => ({
      ...prevData,
      [badgeType]: '', // Set badge URL to an empty string
    }));
  };

  const handleEditAboutClick = () => {
    setEditAboutModalOpen(true);
  };

  const handleCloseEditAboutModal = () => {
    setEditAboutModalOpen(false);
  };

  const handleSaveAbout = (updatedAbout) => {
    const updatedProfileData = {
      acf: {
        about: updatedAbout.aboutText,
        team: updatedAbout.team,
        ojt_adviser: updatedAbout.ojtAdviser,
        subject_code: updatedAbout.subjectCode,
        group_leader: updatedAbout.groupLeader ? 'Group Leader' : '', // Update group leader status
      }
    };

    axios.post(import.meta.env.VITE_API_BASE_URL + 'users/me', updatedProfileData, {
      headers: {
        'Authorization': 'Basic ' + btoa(import.meta.env.VITE_AUTH_USERNAME + ':' + import.meta.env.VITE_AUTH_PASSWORD),
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        console.log('About section updated successfully');
        fetchProfileData(); // Refetch profile data to get the updated about section
        handleCloseEditAboutModal();
      })
      .catch((error) => {
        console.error('Error updating about section:', error);
      });
  };

  const handleEditSignatureClick = () => {
    setEditSignatureModalOpen(true); // Open the "Edit Signature" modal
  };

  const handleCloseEditSignatureModal = () => {
    setEditSignatureModalOpen(false);
  };

  const handleSaveSignature = async (updatedSignature) => {
    const updatedProfileData = {
      acf: {
        intern_signature: updatedSignature, // Update intern signature
      }
    };

    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL + 'users/me', updatedProfileData, {
        headers: {
          'Authorization': 'Basic ' + btoa(import.meta.env.VITE_AUTH_USERNAME + ':' + import.meta.env.VITE_AUTH_PASSWORD),
          'Content-Type': 'application/json',
        },
      });
      console.log('Signature updated successfully');
      fetchProfileData(); // Refetch profile data to get the updated signature
      handleCloseEditSignatureModal();
    } catch (error) {
      console.error('Error updating signature:', error);
    }
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
            groupLeader={profileData.groupLeader}
            onEditClick={handleEditAboutClick}
          />
          <ProfileDirectory />
          <InternSignature
            signatureUrl={profileData.internSignature}
            onEditClick={handleEditSignatureClick}
          />
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
              groupLeader: profileData.groupLeader,
            }}
            onClose={handleCloseEditAboutModal}
            onSave={handleSaveAbout}
          />
        )}

        {editSignatureModalOpen && (
          <EditSignatureModal
            signature={profileData.internSignature}
            onClose={handleCloseEditSignatureModal}
            onSave={handleSaveSignature}
          />
        )}
      </div>
    </Home>
  );
};

export default Profile;
