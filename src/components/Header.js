import React from "react";

function Header(props) {
  return (
    <header className="header">
      <img
        className="header__logo"
        src={props.logo}
        alt="Логотип сайта Mesto Russia"
      />
    </header>
  );
}

export default Header;
