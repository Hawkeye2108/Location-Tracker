const express = require("express");
const cors = require("cors");
const app = express();

const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);

const io = socketIo(server,{
    cors:{
        origin:"http://localhost:5173"
    }
})
app.use(cors({
   origin:"http://localhost:5173"
}));

// Handle socket connections
io.on("connection",(socket)=>{
    console.log("Client connected: ",socket.id)
    socket.on("send-location",(data)=>{
       console.log({...data});
       io.emit("receive-location",{id:socket.id,...data});
    })

    socket.on("disconnect", () => {
        console.log('Client disconnected:', socket.id);
    });
})

app.get("/",(req,res)=>{
    res.send("hi");
})

server.listen(4000);