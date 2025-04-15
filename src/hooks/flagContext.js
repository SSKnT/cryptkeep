import { useState, useContext, createContext } from "react";

const FlagContext = createContext()

export const FlagProvider = ({children}) => {
    const [flagCount, setFlagCount] = useState(0)

    return(
        <FlagContext.Provider value={{flagCount, setFlagCount}}>
            {children}
        </FlagContext.Provider>
    )
}

export const UseFlag = () => useContext(FlagContext)
