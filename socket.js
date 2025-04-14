import { authenticateUser } from './src/utils/auth.js';
import { insertMessage, updateReceivers, updateSeens } from './src/utils/chat.js';
import { Server } from 'socket.io';


const onlineUsers = new Map();

const initSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type"],
            credentials: true
        }
    });

    console.log("📡 Socket.IO server initialized");

    io.on('connect', async (socket) => {
        console.log(`✅ User connected: ${socket.id}`);

        const token = socket.handshake.query.token;
        if (token) {
            const userId = await authenticateUser(token);
            onlineUsers.set(userId, socket.id);
            io.emit("online_users", onlineUsers);
        }

        socket.on('disconnect', async () => {
            onlineUsers.forEach((value, key) => {
                if (value === socket.id) {
                    onlineUsers.delete(key);
                }
            });

        });

        socket.on('typing', async (arg) => {
            let obj = JSON.parse(arg)
            io.emit('typing', obj);
        })

        socket.on('delivered_event', async (arg) => {
            let obj = JSON.parse(arg)
            io.emit('delivered_event', obj);
            updateReceivers(obj)
        })

        socket.on('seen_event', async (arg) => {
            let obj = JSON.parse(arg)
            io.emit('seen_event', obj);
            updateSeens(obj)
        })

        socket.on('new_message', (arg) => {
            try {
                let obj = JSON.parse(arg)
                obj.date = Date.now().toString();
                obj.receivers.push(obj.user._id)
                if (!obj.members.includes(obj.user._id)) {
                    obj.members.push(obj.user._id);
                }
                obj.members.forEach((member) => {
                    const socketId = onlineUsers.get(member);
                    if (socketId) {
                        io.to(socketId).emit('new_message', obj);
                    }
                });
                insertMessage(obj)
            } catch (error) {
                console.error('Error processing new_message:', error.message);
            }
        });
    });

};

const onlineUsersMiddles = async (req, res, next) => {
    req.onlineUsers = onlineUsers
    next();
}

export { initSocket, onlineUsersMiddles };