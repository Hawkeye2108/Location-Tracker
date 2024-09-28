import { useContext, useEffect, useState } from 'react';
import {io} from 'socket.io-client';
import { MapContainer, Marker, Popup, TileLayer,useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { Icon, marker } from 'leaflet';
import L from "leaflet";
import "./CustomMarker.css"
import { UserContext } from '../context.js/userContext';

// Component to update map center
const MapCenterUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom()); // Update the map's center and retain zoom level
    }
  }, [center, map]);

  return null;
};


function MapPage() {
   const {users,addUsers,deleteUsers,updateUsers,updateUserLocation,socket} = useContext(UserContext);
   console.log("users = ",users);
   console.log("socket id = ",socket);

   
    const [yourLocation, setYourLocation] = useState([users[0].latitude,users[0].longitude]);
    const [markers,setMarkers] = useState([]);
    const [id,setId] = useState();
    const [yourData,setYourData] = useState(...users);

    useEffect(()=>{

    // // Connection to socket
    // const socket = io("https://location-tracker-i8d5.onrender.com");
    // // console.log("initial socket id = ",socket.id);
    // socket.on("connect",()=>{
    //   // console.log("socket connect id = ",socket.id);
    //   updateUsers(socket.id);
    //   console.log("sendind data");
    //   socket.emit("send-location",{...yourData,id:socket.id});
    //   const [yourLocationData] = users;
    //   setYourData({...yourLocationData,id:socket.id});
    // })
    
    // // Capture user ID when connected
    // socket.on("connect", () => {
    //   setUserId(socket.id);
    // });

    
    let watchId;
    if(navigator.geolocation){
      watchId = navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude} = position.coords;
        setYourLocation([latitude,longitude]);
        // socket.emit("send-location", {latitude,longitude});
        // console.log("send locayion = ",{...yourData});
        // console.log("send locayion = ",{...yourData,latitude,longitude});
        socket.emit("send-location", {...yourData,latitude,longitude});
      },
      (error)=>{
       console.log(error);
      }
      ,
      {
        enableHighAccuracy:true,
      //   timeout:5000,
      //   maximumAge:0
      }
      )
    }

    socket.on("receive-location",(data)=>{
      const {id,latitude,longitude} = data;
      console.log('Received location data = ', data);
      // console.log("sockedt.id = ",socket.id);
       const existingUser = users.find(user => user.id===id);
        if(existingUser){
         // Update the existing user's location
         updateUserLocation(id,data);
         return ;
        }
        // console.log("addUsers data = ",data);
        console.log("receiving data");
        // If user does not exist, add them to the state
        addUsers(data);
      })
     
      // To clean up marker if a user is disconnected
      socket.on("remove-marker",({id})=>{
      //   // setMarkers((prevMarkers)=> prevMarkers.filter((marker)=> marker.id!=id))
        deleteUsers(id);
      })
      
     // Clean up on component unmount
     return () => {
      socket.disconnect();
      if(watchId){
         navigator.geolocation.clearWatch(watchId);
      }
     };
    },[]);

    


    console.log("     Renders    ")
    const createCustomMarker = (image)=>{
     return L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker">
      <div class="marker-icon">
         <img src=${image} alt="Image"/>
      </div>
      <div class="marker-body"></div>
     </div>`,
      // iconSize: [20, 20],
      // iconAnchor: [10, 20],
    });
  }
    
  console.log("yourData = ",yourData);



  return (
    <>
      <MapContainer center={yourLocation} zoom={13}
       style={{height:"100vh",width:"100%"}}>
        <TileLayer
           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <MapCenterUpdater center={yourLocation}/>
        { users?.map((user,index)=><Marker key={index}
           position={[user.latitude,user.longitude]}
           icon={createCustomMarker(user.image)}
          >
            <Popup><h4>{user.name}</h4></Popup>
          </Marker>

        )}      
    
      </MapContainer>
    </>
  )
}

export default MapPage
































// // src/WebSocketComponent.js
// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// // Replace with your backend URL
// const SOCKET_URL = 'http://localhost:4000';

// const WebSocketComponent = () => {
//   const [data, setData] = useState(null);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     // Initialize the socket connection
//     const newSocket = io(SOCKET_URL);
//     setSocket(newSocket);

//     // Set up event listeners
//     newSocket.on('receive-location', (receivedData) => {
//       setData(receivedData);
//     });

//     newSocket.emit("send-location",{hello:"hi"})

//     // Clean up on component unmount
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <h1>WebSocket Data</h1>
//       <pre>{data ? JSON.stringify(data, null, 2) : 'No data received'}</pre>
//       <button> on</button>
//     </div>
//   );
// };

// export default WebSocketComponent;
