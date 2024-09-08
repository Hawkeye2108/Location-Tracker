import { Marker } from "react-leaflet";
import { socket } from "./socket";

if(navigator.geolocation){
   navigator.geolocation.watchPosition((position)=>{
     const {latitude,longitude} = position.coords;
     console.log({latitude,longitude})
     socket.emit("send-location", {latitude,longitude});
   },
   (error)=>{
    console.log(error);
   })
}

// console.log({latitude,longitude})