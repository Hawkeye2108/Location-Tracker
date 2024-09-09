const express = require("express");
const cors = require("cors");
const app = express();

const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);

const io = socketIo(server,{
    cors:{
        origin:"*"
    }
})
app.use(cors({
   origin:"*"
}));

// Handle socket connections
io.on("connection",(socket)=>{
    console.log("Client connected: ",socket.id)
    socket.on("send-location",(data)=>{
       console.log({...data});
       io.emit("receive-location",{id:socket.id,...data});
    })

    socket.on("disconnect", () => {
        io.emit("remove-marker",{id:socket.id});
        console.log('Client disconnected:', socket.id);
    });
})

app.get("/",(req,res)=>{
    res.send("hi");
})
const PORT = process.env.PORT || 4000;
server.listen(PORT);