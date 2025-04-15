import { useState, useContext, createContext } from "react";

const FlagContext = createContext()

export const FlagProvider = ({children}) => {
    const [foundFlags, setFoundFlags] = useState([])

    const addFlag = (id) => {
        if (!foundFlags.includes(id)){
            setFoundFlags(prev=>[...prev,id])
            return true;
        }
        return false;
    }
 
    return(
        <FlagContext.Provider value={{foundFlags, addFlag}}>
            {children}
        </FlagContext.Provider>
    )
}

export const UseFlag = () => useContext(FlagContext)
