import {createContext, useState } from "react";

// Create a context
const UserContext = createContext();

// Create a Provider Component
const UserProvider = ({children})=>{
    // State to hold user information
    const [users,setUsers] = useState([]);
    // Method to add user
    const addUsers = (user)=>{
        console.log("user conntext = ",user);
        setUsers((prevUser) => [...prevUser,user]);
    }

    // Method to delete user
    const deleteUsers = (id)=>{
        setUsers((prevUser) => prevUser.filter(user => user.id !== id))
    }

    // Method to update user to have socket id
    const updateUsers = (id)=>{
        setUsers((prevUser) => {
            console.log("updateUsers = ",prevUser);
            //  Destructure the first user from prevUsers
            const [firstUser] = prevUser;
            console.log("firstUser  =",firstUser );
            // Create a new user object with the updated id
              const updatedUser = { ...firstUser, id };

            // Return a new array with the updated user and the rest of the users
            return [updatedUser];
        });
    }
    // Provide state and methods to children 
    return (
        <UserContext.Provider value={{users,addUsers,deleteUsers,updateUsers}}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider};