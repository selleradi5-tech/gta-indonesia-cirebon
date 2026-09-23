const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const server = http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:true,service:'GTA Indonesia Cirebon Multiplayer'}));});
const io = new Server(server,{cors:{origin:['https://selleradi5-tech.github.io'],methods:['GET','POST']},transports:['websocket','polling'],pingInterval:25000,pingTimeout:20000});
const rooms = new Map();
function safe(v,f=''){return String(v??f).replace(/[^\\p{L}\\p{N} _-]/gu,'').slice(0,16)||f}
function roomPlayers(room){return [...(rooms.get(room)||new Map()).values()].map(p=>({id:p.id,name:p.name,x:p.x,z:p.z,ry:p.ry,vehicle:p.vehicle}));}
io.on('connection',socket=>{
  socket.on('joinRoom',data=>{
    const room=safe(data?.room,'CIREBON').toUpperCase();
    const name=safe(data?.name,'Pemain');
    if(socket.data.room){const old=rooms.get(socket.data.room);old?.delete(socket.id);if(old?.size===0)rooms.delete(socket.data.room);socket.leave(socket.data.room)}
    socket.data.room=room;
    if(!rooms.has(room))rooms.set(room,new Map());
    const players=rooms.get(room);
    const p={id:socket.id,name,x:Number(data?.x)||0,z:Number(data?.z)||0,ry:Number(data?.ry)||0,vehicle:!!data?.vehicle};
    socket.join(room);
    socket.emit('roomState',roomPlayers(room));
    players.set(socket.id,p);
    socket.to(room).emit('playerJoined',p);
  });
  socket.on('playerMove',data=>{
    const room=socket.data.room,players=room&&rooms.get(room),p=players?.get(socket.id);if(!p)return;
    p.x=Math.max(-178,Math.min(178,Number(data?.x)||0));p.z=Math.max(-178,Math.min(178,Number(data?.z)||0));p.ry=Number(data?.ry)||0;p.vehicle=!!data?.vehicle;
    socket.to(room).emit('playerMoved',p);
  });
  socket.on('disconnect',()=>{const room=socket.data.room,players=room&&rooms.get(room);if(!players)return;players.delete(socket.id);socket.to(room).emit('playerLeft',{id:socket.id});if(players.size===0)rooms.delete(room);});
});
server.listen(PORT,'0.0.0.0',()=>console.log('GTA Cirebon multiplayer server listening on '+PORT));
