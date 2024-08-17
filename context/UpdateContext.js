import React, { createContext, useContext, useState } from 'react';

const UpdateContext = createContext();

export const UpdateProvider = ({ children }) => {
    const [onUpdateOrDelete, setOnUpdateOrDelete] = useState(null);

    return (
        <UpdateContext.Provider value={{ onUpdateOrDelete, setOnUpdateOrDelete }}>
            {children}
        </UpdateContext.Provider>
    );
};

export const useUpdateContext = () => useContext(UpdateContext);
