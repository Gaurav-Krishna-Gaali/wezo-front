const socket = io('http://localhost:3000',{
    transports: ['websocket', 'polling', 'flashsocket'],
    auth:{
        token: localStorage.getItem('token')
    }
})

socket.on('connect',()=>{
    socket.emit("login", {});
})