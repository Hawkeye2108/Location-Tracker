import React, { useContext, useRef, useState } from 'react'
import WebCam from "react-webcam"
import {NavLink} from "react-router-dom"
import { UserContext } from '../context.js/userContext'

const WebCameraPage = () => {
  const {users,addUsers,socket} = useContext(UserContext);
  // console.log("users = ",users);
   
  const [yourLocation,setYourLocation] = useState(null);
  const [name,setName] = useState(null);
  const [proceed,setProceed] = useState(false);


  let webcamRef = useRef(null);
  const [imageSrc,setImageSrc] = useState(null);
  
  const capturescreenShot = ()=>{
    // console.log(webcamRef);
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
      // console.log("Stopping camera");
      const tracks = webcamRef.current.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      webcamRef = null;
    }
  };
  
  // Function to add user to UserContext
  const handleUser = ()=>{
    addUsers({
      id:socket.id,
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
    // alert("location");
    let watchId;
    if(navigator.geolocation){
      watchId = navigator.geolocation.getCurrentPosition((position)=>{
        const {latitude,longitude} = position.coords;
        // console.log({latitude,longitude});
        // alert(latitude + "->" + longitude);
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
  // console.log("users state updated = ",users);
  return (
    <div style={{display:'flex',alignItems:"center",flexDirection:"column",height:"100vh",padding:10}}>
      <h2 style={{fontWeight:"bold",textAlign:"center"}}>Click a Photo For Marker</h2>
      <div style={{background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(151,167,184,1) 0%, rgba(0,0,0,1) 100%)",width:'350px',height:'350px',display:"flex",alignItems:"center",margin:8}}>
      {imageSrc?
      <img src={imageSrc} alt="Image" style={{display:"flex", alignItems:"center"}}/>:      
      <WebCam width={"100%"} height={"100%"} ref={webcamRef} screenshotFormat='image/jpeg' screenshotQuality={0.9}/>
      }
      </div>
      <div>
        {imageSrc?
         <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"center",width:"190px"}}>
         <button onClick={retakeScreenShot}
         style={{width:"100%",padding:7,fontWeight:"bold",color:"white",background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(190,190,255,1) 0%, rgba(0,212,255,1) 100%)",border:0,borderRadius:6,cursor:"pointer"}}
         >
          Retake Photo</button>
         <button onClick={allowLocation}
         style={{width:"100%",padding:7,fontWeight:"bold",color:"white",background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(190,190,255,1) 0%, rgba(0,212,255,1) 100%)",border:0,borderRadius:6,cursor:"pointer"}}
         >Allow Location Access</button>
         {yourLocation && 
         <>
          <input type="text" placeholder='Enter your name' name={name} onChange={(e)=>setName(e.target.value)} 
          style={{padding:7,fontWeight:"bold",borderRadius:6,borderColor:"white",outline:0}}/>
          <button  onClick={handleProceed}
          style={{width:"100%",padding:7,fontWeight:"bold",color:"white",background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(190,190,255,1) 0%, rgba(0,212,255,1) 100%)",border:0,borderRadius:6,cursor:"pointer"}}
          >Proceed</button>
          </>
         } 
          {yourLocation && proceed?
         <NavLink to="/map" style={{width:"100%"}}><button onClick={handleUser}
         style={{width:"100%",padding:7,fontWeight:"bold",color:"white",background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(190,190,255,1) 0%, rgba(0,212,255,1) 100%)",border:0,borderRadius:6,cursor:"pointer"}}
         >Go to Map</button></NavLink>
         : null
          }
         </div>
         :        
        <button onClick={capturescreenShot}
        style={{padding:7,fontWeight:"bold",color:"white",background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(190,190,255,1) 0%, rgba(0,212,255,1) 100%)",border:0,borderRadius:6,cursor:"pointer",width:190}}>
          Capture Photo
        </button>
        }
      </div>
      </div>
  )
}

export default WebCameraPage