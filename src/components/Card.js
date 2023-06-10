import { useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardDelete, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);

	const isOwn = card.owner._id === currentUser._id;

	const isLiked = card.likes.some(i => i._id === currentUser._id);
	const cardLikeButtonClassName = (
		`element__button ${isLiked && "element__button_active"}`
	);
  function handleClick() {
    onCardClick(card);
  }
  function handleDeleteClick() {
		onCardDelete(card);
	};

	function handleLikeClick() {
		onCardLike(card);
	};

  return (
    <div id="elements-template">
      <article className="element">
      {isOwn && <button className="element__basket" type="button" onClick={handleDeleteClick}></button>}
        <img
          className="element__item"
          src={card.link}
          alt={card.name}
          onClick={handleClick}
        />
        <div className="element__description">
          <h2 className="element__title">{card.name}</h2>
          <div className="element__like-container">
            <button
              className={cardLikeButtonClassName}
              type="button"
              aria-label="like"
              onClick={handleLikeClick}
            />
            <p className="element__like-counter">{card.likes.length}</p>
          </div>
        </div>
      </article>
    </div>
  );
}

export default Card;
