import { useEffect, useState } from 'react';
import {io} from 'socket.io-client';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { Icon } from 'leaflet';

function App() {
    const [markers,setMarkers] = useState([]);
    useEffect(()=>{
    const socket = io("http://localhost:4000");
    let watchId;
    if(navigator.geolocation){
      watchId = navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude} = position.coords;
        // console.log({latitude,longitude})
        socket.emit("send-location", {latitude,longitude});
      },
      (error)=>{
       console.log(error);
      }
      // ,
      // {
      //   enableHighAccuracy:true,
      //   timeout:5000,
      //   maximumAge:0
      // }
      )
    }

    socket.on("receive-location",(data)=>{
      const {id,latitude,longitude} = data;
      console.log('Received location:', { id, latitude, longitude });
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

     // Clean up on component unmount
     return () => {
      socket.disconnect();
      navigator.geolocation.clearWatch(watchId);
     };
    },[])
    
    const customIcon = new Icon({
      iconUrl:"https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-1024.png",
      iconSize:[35,35]
    })
  return (
    <>
      <MapContainer center={[28.6818304,77.2767744]} zoom={20}
       style={{height:"100vh",width:"100%"}}>
        <TileLayer
           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
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
