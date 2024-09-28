import {createContext, useState,useEffect } from "react";
import {io} from 'socket.io-client';

// Create a context
const UserContext = createContext();

// Create a Provider Component
const UserProvider = ({children})=>{
    const [socket,setSocket] = useState(null);
    useEffect(()=>{

        // Connection to socket
         const socket = io("https://location-tracker-i8d5.onrender.com");
        // console.log("initial socket id = ",socket.id);
        setSocket(socket);
        socket.on("connect",()=>{
          console.log("socket connect id = ",socket.id);
        //   updateUsers(socket.id);
          console.log("sendind data");
        //   socket.emit("send-location",{...yourData,id:socket.id});
        //   const [yourLocationData] = users;
        //   setYourData({...yourLocationData,id:socket.id});
        })
        return ()=>{
            socket.disconnect();
        }
    },[]);
    // State to hold user information
    const [users,setUsers] = useState([]);
    // Method to add user
    const addUsers = (user)=>{
        console.log("user conntext = ",user);
        console.log("users state in addUsers = ",users);
        let userExists = false;
        console.log("users length = ",users.length);
        // for(let i=0;i<users.length;i++){
        //     console.log(`users[${i}].id = ${users[i].id}`);
        //     console.log(`user.id = ${user.id}`);
        //     // if(users[i].id === undefined){
        //     //     userExists = true;
        //     //     break;
        //     // }
        //     if(users[i].id === user.id){
        //         userExists = true;
        //         break;
        //     }
        // }
        // console.log("user exists = ",userExists);
        // // console.log("add users state = ",users);
        // if(userExists){
        //    updateUserLocation(user);
        // }
        // else
        setUsers((prevUser) => [...prevUser,user]);
    }

    // Method to delete user
    const deleteUsers = (id)=>{
        setUsers((prevUser) => {
            console.log("prevUsers in deleteUsers before = ",prevUser);
            const data = prevUser.filter(user => (user.id !== id))   

        console.log("users updated in deleteUsers after = ",data);
        return data;

    }
)

    }
    
    const updateUserLocation = (id,updatedData)=>{
        setUsers((prevUser)=>{
            return prevUser.map(user=>
              user.id===id?{...user,updatedData}:user
            );
        });
    };

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
        <UserContext.Provider value={{users,addUsers,deleteUsers,updateUsers,updateUserLocation,socket}}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider};