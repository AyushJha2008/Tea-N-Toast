import express, { urlencoded } from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import http from "http";
import { initializeSocket } from "./sockets/socket.js";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import convoRoutes from "./routes/convo.route.js"
import messageRoutes from "./routes/message.route.js";

dotenv.config({});

const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended: true}));
const corsOption = {
    origin: "http://localhost5173",
    Credentials: true,
}
app.use(cors(corsOption));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/convo", convoRoutes);
app.use("/api/v1/messages", messageRoutes);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initializeSocket(server);

server.listen(PORT, ()=>{
    connectDB();
    console.log(`server running on ${PORT}`);
});
