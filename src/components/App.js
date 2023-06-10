import React, { useState, useEffect } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import "../index.css";
import logo from "../images/logo.svg";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";

function App() {
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpened] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpened] = useState(false);
  const [isEditProfilePopupOpen, setEditProfileOpened] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.getMyProfile(), api.getInitialCards()])
      .then(([userData, initialCards]) => {
        setCurrentUser(userData)
        setCards(initialCards);
      })
      .catch((err) => console.log(err));
	}, []);
  
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpened(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpened(true);
  }

  function handleEditProfileClick() {
    setEditProfileOpened(true);
  }

  function closeAllPopups() {
    setEditAvatarPopupOpened(false);
    setAddPlacePopupOpened(false);
    setEditProfileOpened(false);
    setSelectedCard(null);
  }
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err) => console.log(err))
}; 
function handleCardDelete(card) {
  api.deleteCard(card._id)
    .then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id));
    })
    .then(() => closeAllPopups())
    .catch((err) => console.log(err))
};
function handleAddPlaceSubmit(name, link) {
  setIsLoading(true);
  api.setNewCard(name, link)
    .then((newCard) => setCards([newCard, ...cards]))
    .then(() => closeAllPopups())
    .catch((err) => console.log(err))
    .finally(() => { setIsLoading(false)});
};

function handleUpdateUser(name, about) {
  setIsLoading(true);
  api.editMyProfile(name, about)
    .then((data) => {
      setCurrentUser(data)
    })
    .then(() => closeAllPopups())
    .catch((err) => console.log(err))
    .finally(() => { setIsLoading(false)});
};

function handleUpdateAvatar(data) {
  setIsLoading(true);
  api.setNewAvatar(data)
    .then((res) => {
      setCurrentUser(res)
    })
    .then(() => closeAllPopups())
    .catch((err) => console.log(err))
    .finally(() => { setIsLoading(false)});
};
  return (
    <CurrentUserContext.Provider value={currentUser}>
    <div className="page">
      <Header logo={logo} />
      <Main
        cards={cards}
        onCardClick={handleCardClick}
        onEditAvatar={handleEditAvatarClick}
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}       
        onCardLike={handleCardLike}
				onCardDelete={handleCardDelete}
      />
      <Footer />
      <EditProfilePopup
					isOpen={isEditProfilePopupOpen}
					onClose={closeAllPopups}
					onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
				/>
     <AddPlacePopup
					isOpen={isAddPlacePopupOpen}
					onClose={closeAllPopups}
					onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
				/>
      <ImagePopup card={selectedCard} onClose={closeAllPopups}></ImagePopup>
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isLoading={isLoading}/> 
      <PopupWithForm
        name="delete-card"
        title="Вы уверены?"
        buttonText="Да"
        onClose={closeAllPopups}
        onCardDelete={handleCardDelete}
      />
    </div>
    </CurrentUserContext.Provider>
  );
}
export default App;
