import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./ProfilePage.module.css";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileSection from "../../components/profile/ProfileSection";
import EditableField from "../../components/profile/EditableField";

function ProfilePage() {
  const structures = useLoaderData();
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div className={styles.profilePageContainer}>
      <ProfileHeader
        username={structures.username}
        isEditMode={isEditMode}
        handleEditClick={handleEditClick}
      />
      <ProfileSection title="Informations générales">
        <EditableField
          label="Nom :"
          value={structures.lastname}
          isEditMode={isEditMode}
          labelClass={styles.label}
        />
        <EditableField
          label="Prénom :"
          value={structures.firstname}
          isEditMode={isEditMode}
          labelClass={styles.label}
        />
        <EditableField
          label="Localisation :"
          value={structures.location}
          isEditMode={isEditMode}
          labelClass={styles.label}
        />
        <address className={styles.profileAddressContainer}>
          <EditableField
            label="Téléphone :"
            value={
              isEditMode ? (
                structures.phone_number
              ) : (
                <a
                  href={`tel:${structures.phone_number}`}
                  className={styles.link}
                >
                  {structures.phone_number}
                </a>
              )
            }
            isEditMode={isEditMode}
            labelClass={styles.label}
          />
          <EditableField
            label="Email :"
            value={
              isEditMode ? (
                structures.mail
              ) : (
                <a href={`mailto:${structures.mail}`} className={styles.link}>
                  {structures.mail}
                </a>
              )
            }
            isEditMode={isEditMode}
            labelClass={styles.label}
          />
        </address>
      </ProfileSection>
      <ProfileSection title="Description">
        <EditableField value={structures.description} isEditMode={isEditMode} />
      </ProfileSection>
      <ProfileSection title="Vos réservations">
        <ul className={styles.noBullets}>
          <li className={styles.profileLiReservation}>Aucune réservations</li>
        </ul>
      </ProfileSection>
    </div>
  );
}

ProfilePage.propTypes = {
  structures: PropTypes.shape({
    username: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    firstname: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    phone_number: PropTypes.string.isRequired,
    mail: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfilePage;
