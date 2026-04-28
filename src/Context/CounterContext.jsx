import React, { createContext, useState } from "react";

export const CountContext = createContext();

const CounterContextProvider = ({ children }) => {

  const [counter, setCounter] = useState(10);


  return (
    <>
      <CountContext.Provider value={{ counter, setCounter }}>
        {children}
      </CountContext.Provider>
    </>
  );
};

export default CounterContextProvider;
