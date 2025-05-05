import { useState } from "react";
import Header from "../common/Header";
import LeftSidebar from "../common/LeftSidebar";

// eslint-disable-next-line react/prop-types
const Wrapper = ({ children }) => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };
  return (
    <>
      <Header handleToggleMenu={handleToggleMenu} />
      <main className="main-body">
        <div className="main-row">
          <LeftSidebar toggleMenu={toggleMenu} />
          <div className="body-content">{children}</div>
        </div>
      </main>
    </>
  );
};

export default Wrapper;
