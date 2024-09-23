import React, { useContext, useRef, useState } from 'react'
import WebCam from "react-webcam"
import {NavLink} from "react-router-dom"
import { UserContext } from '../context.js/userContext'

const WebCameraPage = () => {
  const {users,addUsers} = useContext(UserContext);
  console.log("users = ",users);
   
  const [yourLocation,setYourLocation] = useState();
  const [name,setName] = useState(null);
  const [proceed,setProceed] = useState(false);


  let webcamRef = useRef(null);
  const [imageSrc,setImageSrc] = useState(null);
  
  const capturescreenShot = ()=>{
    console.log(webcamRef);
    setImageSrc(webcamRef.current.getScreenshot());
    stopCamera();
  }
  const retakeScreenShot = ()=>{
    setImageSrc(null);
    setYourLocation(null);
    setName(null);
    setProceed(false);
  }
  // console.log(imageSrc)
   
  // To stop camera after taking screenshot and the camera is on after imageSrc is set to null in retakeScreenShot because of which 
  // the webcamRef is set to refrence WebCam react-webcam component
  const stopCamera = () => {
    if (webcamRef.current) {
      console.log("Stopping camera");
      const tracks = webcamRef.current.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      webcamRef = null;
    }
  };
  
  // Function to add user to UserContext
  const handleUser = ()=>{
    addUsers({
      name,
      latitude:yourLocation.latitude,
      longitude:yourLocation.longitude,
      image:imageSrc
    });
    console.log("handleusers = ",users)
  }
  // Function to handle proceed 
  const handleProceed = ()=>{
    if(name.length>0)
      setProceed(true);
  }
  
  const allowLocation = ()=>{
    alert("location");
    let watchId;
    if(navigator.geolocation){
      watchId = navigator.geolocation.getCurrentPosition((position)=>{
        const {latitude,longitude} = position.coords;
        console.log({latitude,longitude});
        alert(latitude + "->" + longitude);
        setYourLocation({latitude,longitude});
      },
      (error)=>{
      console.log(error);
      alert(error);
      }
      ,
      {
        enableHighAccuracy:true,
      }
      )
    }
  } 
  return (
    <div style={{display:'flex',alignItems:"center",flexDirection:"column",height:"100vh",padding:10}}>
      <h1>Click A Photo appear in Marker</h1>
      <div style={{backgroundColor:'yellow',width:'350px',height:'350px',display:"flex",alignItems:"center",margin:10}}>
      {imageSrc?
      <img src={imageSrc} alt="Image" style={{display:"flex", alignItems:"center"}}/>:      
      <WebCam width={"100%"} height={"100%"} ref={webcamRef} screenshotFormat='image/jpeg' screenshotQuality={0.9}/>
      }
      </div>
      <div>
        {imageSrc?
         <div style={{display:"flex",flexDirection:"column",gap:10,margin:4}}>
         <button onClick={retakeScreenShot}>Retake Photo</button>
         <button onClick={allowLocation}>Allow Location Access</button>
          <input type="text" placeholder='Enter your name' name={name} onChange={(e)=>setName(e.target.value)} />
          <button  onClick={handleProceed}>Proceed</button>
          {yourLocation && proceed?
         <NavLink to="/map"><button onClick={handleUser}>Go to Map</button></NavLink>
         : null
          }
         </div>
         :        
        <button onClick={capturescreenShot}>Capture Photo</button>
        }
      </div>
      </div>
  )
}

export default WebCameraPage