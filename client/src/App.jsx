import { useEffect, useState } from 'react';
import {io} from 'socket.io-client';
import { MapContainer, Marker, Popup, TileLayer,useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { Icon, marker } from 'leaflet';

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



function App() {
    const [yourLocation, setYourLocation] = useState([25,25]);
    const [markers,setMarkers] = useState([]);
    const [id,setId] = useState();
    useEffect(()=>{
      // navigator.geolocation.getCurrentPosition((pos)=>{
      //   setYourLocation([pos.coords.latitude,pos.coords.longitude])
      // })



    const socket = io("https://location-tracker-i8d5.onrender.com");
    console.log(socket.id);
    // // Capture user ID when connected
    // socket.on("connect", () => {
    //   setUserId(socket.id);
    // });
    let watchId;
    if(navigator.geolocation){
      watchId = navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude} = position.coords;
        // console.log({latitude,longitude})
        setYourLocation([latitude,longitude]);
        socket.emit("send-location", {latitude,longitude});
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
      console.log('Received location:', { id, latitude, longitude });
      console.log("sockedt.id = ",socket.id)
      setMarkers((prevMarkers)=>{
        console.log("previous Markers = ",prevMarkers);
        const markerExist = prevMarkers.find(marker=>marker.id===id);
        if(markerExist){
           return prevMarkers.map(marker=>
           marker.id===id?{id,latitude,longitude}:marker);
        }
        else{
           return [...prevMarkers, {id,latitude,longitude}];
        }
      })
    })
     
      // To clean up marker if a user is disconnected
      socket.on("remove-marker",({id})=>{
        setMarkers((prevMarkers)=> prevMarkers.filter((marker)=> marker.id!=id))
      })
     // Clean up on component unmount
     return () => {
      //
      // socket.emit("remove-marker",{id:socket.id});
      //
      socket.disconnect();
      if(watchId){
         navigator.geolocation.clearWatch(watchId);
      }
     };
    },[])
    

    const customIcon = new Icon({
      iconUrl:"https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-1024.png",
      iconSize:[35,35]
    })
    console.log("yourLocation = ",yourLocation);
    
  return (
    <>
      <MapContainer center={yourLocation} zoom={13}
       style={{height:"100vh",width:"100%"}}>
        <TileLayer
           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <MapCenterUpdater center={yourLocation}/>
        { markers.map((marker)=><Marker key={marker.id}
           position={[marker.latitude,marker.longitude]}
           icon={customIcon}
          >
            <Popup><h4>{marker.id}</h4></Popup>
          </Marker>

        )}      
        {/* <Marker position={[28.6818304,77.2767744]} icon={customIcon}/> */}
      </MapContainer>
    </>
  )
}

export default App










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
