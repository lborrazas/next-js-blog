import {createContext, useContext, useState} from 'react';

export class User {
    constructor(id, name, email, address, isAdmin){
        this.id = id
        this.name = name
        this.email = email
        this.address = address
        this.isAdmin = isAdmin
    }
}




const UserContext = createContext(null)
const SetUserContext = createContext(null)

export function AppProvider({children}) {
    const [user, setUser] = useState(null)

    return (
        <UserContext.Provider value={user}>
            <SetUserContext.Provider value={setUser}>
                        {children}
            </SetUserContext.Provider>
        </UserContext.Provider>
    )
}


export function useUser(){
    return useContext(UserContext)
}

export function useSetUser(){
    return useContext(SetUserContext)
}
