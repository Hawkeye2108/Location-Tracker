import React, { useState } from 'react'

const UserWindow = ({userProfile,setUserProfile}) => {
  const [open,setOpen] = useState(true);
  const handleClose = ()=>{
    setUserProfile((prev)=>null);
    setOpen((prev)=>!prev);
  }
  return (
    <>
    {open && 
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",width:"100vw",zIndex:1000,position:"absolute"}}>
      <div style={{backgroundColor:"white",height:"60%",maxWidth:"350px",width:"60%",borderRadius:20,overflow:"hidden",position:"relative"}}>
          <div onClick={handleClose} style={{position:"absolute",right:15,top:10,fontWeight:"bold",fontSize:20,cursor:"pointer"}}>
          X
          </div>
         <div style={{height:"75%",width:"100%",display:'flex',alignItems:"center"}}>
          <img style={{width:"100%",height:"100%",objectFit:"contain"}} src={userProfile.image} alt="Profile" />
         </div>
         <div style={{textAlign:"center",margin:5}}>
            <h2>User:{userProfile.name}</h2>
         </div>
      </div>
    </div>
    }
    </>
  )
}

export default UserWindow