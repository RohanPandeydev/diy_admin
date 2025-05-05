import React from "react";
import { createContext, useContext, useState } from "react";
import StorageData from "../helper/storagehelper/StorageData";

const userContext = createContext();
const ContextWrapper = ({ children }) => {
  const myuserToken = StorageData.getToken(); 
  const myuserData = StorageData.getUserData();
  const [token, setToken] = useState(myuserToken ? myuserToken : "");
  const [userData, setUserData] = useState(
    myuserData != null ? myuserData : {}
  );

  return (
    <userContext.Provider
      value={{
        token,
        setToken,
        userData,
        setUserData,
        
      }}
    >
      {children}
    </userContext.Provider>
  );
};


const useCustomContext = () => {
  return useContext(userContext);
};
export default useCustomContext;
export { ContextWrapper };
