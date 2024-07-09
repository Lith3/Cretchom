import { useState, useEffect, useContext, useReducer } from "react";
import { useLoaderData, useParams, Link } from "react-router-dom";
import notify from "../../utils/notify";

import styles from "./ProfilePage.module.css";
import ProfileHeader from "../../components/profile/profile_header/ProfileHeader";
import ProfileSection from "../../components/profile/profile_section/ProfileSection";
import EditableField from "../../components/profile/editable_field/EditableField";
import EditableTextarea from "../../components/profile/editable_text_area/EditableTextarea";
import { AuthentificationContext } from "../../use_context/authentification";
import NavMenu from "../../components/nav_menu/NavMenu";

function ProfilePage() {
  const customerdata = useLoaderData();
  const { id } = useParams();
  const { auth } = useContext(AuthentificationContext);
  const [animalData, setAnimalData] = useState([]);
  const [updateAnimals, setUpdateAnimals] = useState(false);
  const [changeAvatar, setChangeAvatar] = useState(false);

  // notify the user that their information have been fetch correctly
  const handleSave = () => {
    notify("Informations mises à jour avec succès !", "success");
  };
  const URL = import.meta.env.VITE_API_URL;

  // Create initial State for the useReducer hook
  const initialState = {
    customer: { ...customerdata },
    beforeChange: { ...customerdata },
    isEditMode: false,
  };

  // Create the different actions that will be used in UseReducer
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_CUSTOMER":
        return { ...state, customer: action.payload };
      case "SET_BEFORE_CHANGE":
        return { ...state, beforeChange: action.payload };
      case "TOGGLE_EDIT_MODE":
        return { ...state, isEditMode: !state.isEditMode };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // update customer info according to what they write
  const onChange = (e, champ) => {
    dispatch({
      type: "SET_CUSTOMER",
      payload: { ...state.customer, [champ]: e.target.value },
    });
  };

  // Send the users updates
  const handleEditClick = async () => {
    if (state.isEditMode && state.beforeChange !== state.customer) {
      const endpoint = auth.user.isHomeStructure === false 
        ? `user/` 
        : `homestructure/`;

        const values = auth.user.isHomeStructure === false ? {
          id: state.customer.id,
          lastname: state.customer.lastname,
          firstname: state.customer.firstname,
          username: state.customer.username,
          phoneNumber: state.customer.phoneNumber,
          location: state.customer.location,
          mail: state.customer.mail,
          description: state.customer.description,
        } : state.customer
      try {
  
        const response = await fetch(`${URL}${endpoint}/${customerdata.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
  
        if (response.status === 204) {
          dispatch({ type: "SET_BEFORE_CHANGE", payload: state.customer });
          dispatch({ type: "TOGGLE_EDIT_MODE" });
          return handleSave();
        }
  
        const data = await response.json();
        return notify(data.validationErrors[0].message, "error");
  
      } catch (err) {
        console.error("Fetch error:", err);
        notify("Erreur lors de la modification du profil", "error");
        return {
          error:
            "An error occurred during registration. Please try again later.",
        };
      }
    }
  
    setChangeAvatar(!changeAvatar);
    return dispatch({ type: "TOGGLE_EDIT_MODE" });
  };
  

  // Check if the user has an animal, if they do, fetch it
  useEffect(() => {
    const fetchAnimals = async () => {
      if (auth !== null && auth !== false && auth.user.hasAnimals === true) {
        try {
          const response = await fetch(`${URL}animal/${id}`);
          const data = await response.json();
          setAnimalData(data);
        } catch (err) {
          console.error("Fetch profile error:", err);
        }
      }
    };
    fetchAnimals();
  }, [URL, id, auth, updateAnimals]);

  // function to delete user's animals
  const handleDeleteAnimals = async (animalId, animalName) => {
    try {
      const response = await fetch(`${URL}animal/${animalId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animalId }),
      });

      // if something went wrong, notify user
      if (response.status !== 204) {
        throw new Error("an error occured, try againt later");
      }

      /* else reload useEffect so that the user have the latest info
      and notify them that everything went well */
      setUpdateAnimals(!updateAnimals);

      notify(`${animalName} a bien été supprimé`, "success");
      return { success: true };
    } catch (err) {
      console.error("Fetch error:", err);
      notify(
        "Erreur lors de la suppression du profil. Veuillez réessayer plus tard.",
        "error"
      );
      return {
        error: "An error occurred during deletion. Please try again later.",
      };
    }
  };

  return (
    <>
      <NavMenu />
      <div className={styles.profilePageContainer}>
        <ProfileHeader
          username={state.customer.username}
          isEditMode={state.isEditMode}
          handleEditClick={handleEditClick}
          valueName="username"
          onChange={onChange}
          customer={state.customer}
          changeAvatar={changeAvatar}
          setChangeAvatar={setChangeAvatar}
        />
        <ProfileSection title="Informations générales">
          <EditableField
            label="Nom :"
            value={state.customer.lastname}
            isEditMode={state.isEditMode}
            valueName="lastname"
            onChange={onChange}
          />
          <EditableField
            label="Prénom :"
            value={state.customer.firstname}
            isEditMode={state.isEditMode}
            valueName="firstname"
            onChange={onChange}
          />
          <EditableField
            label="Localisation :"
            value={state.customer.location}
            isEditMode={state.isEditMode}
            valueName="location"
            onChange={onChange}
          />
          <address className={styles.profileAddressContainer}>
            <EditableField
              label="Téléphone :"
              value={state.customer.phoneNumber}
              isEditMode={state.isEditMode}
              valueName="phoneNumber"
              onChange={onChange}
            />
            <EditableField
              label="Email :"
              value={state.customer.mail}
              isEditMode={state.isEditMode}
              valueName="mail"
              onChange={onChange}
            />
          </address>
        </ProfileSection>
        <ProfileSection title="Description">
          <EditableTextarea
            value={state.customer.description}
            isEditMode={state.isEditMode}
            valueName="description"
            onChange={onChange}
          />
        </ProfileSection>

        <ProfileSection title="Mes animaux">
          {animalData.length > 0 && (
            <ul>
              {animalData.map((animal) => (
                <li className={styles.profilAnimalsList} key={animal.id}>
                  {animal.name}
                  <button
                    type="submit"
                    onClick={() => handleDeleteAnimals(animal.id, animal.name)}
                    className={styles.deleteAnimalsButton}
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Link to={`/formulaire-animal/${id}`} className={styles.addLink}>
            Ajouter des animaux
          </Link>
        </ProfileSection>

        <ProfileSection title="Ma structure">
          {auth !== null &&
          auth !== false &&
          auth.user.isHomeStructure === true ? (
            <>
              <EditableField
                label="code postale"
                value={state.customer.postal_code}
                isEditMode={state.isEditMode}
                valueName="codePostale"
                onChange={onChange}
              />
              <EditableField
                label="Chats acceptés"
                value={state.customer.cat === 1 ? "Oui" : "Non"}
                isEditMode={state.isEditMode}
                valueName="cat"
                onChange={onChange}
              />
              <EditableField
                label="Chiens acceptés"
                value={state.customer.dog === 1 ? "Oui" : "Non"}
                isEditMode={state.isEditMode}
                valueName="dog"
                onChange={onChange}
              />
              <EditableField
                label="type de structure"
                value={
                  state.customer.is_professional === 1
                    ? "professionnel"
                    : "particulier"
                }
                isEditMode={state.isEditMode}
                valueName="structure"
                onChange={onChange}
              />
              <EditableField
                label="capacité d'accueil"
                value={state.customer.capacity}
                isEditMode={state.isEditMode}
                valueName="capacity"
                onChange={onChange}
              />
              <Link
                to={`/inscription_accueil/${id}`}
                className={styles.addLink}
              >
                Je ne veux plus être structure d'accueil
              </Link>
            </>
          ) : (
            <Link to={`/inscription_accueil/${id}`} className={styles.addLink}>
              Devenir structure d'accueil
            </Link>
          )}
        </ProfileSection>
      </div>
    </>
  );
}

export default ProfilePage;
