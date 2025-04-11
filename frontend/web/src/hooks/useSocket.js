import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import useAuth from '../hooks/useAuth';

const useSocket = () => {
    const socket = useRef(null);
    const { userID, isLoading } = useAuth();

    useEffect(() => {
        if (!userID || isLoading) return; // Chưa có thông tin user thì chưa kết nối
        
        // Kết nối tới server socket.io
        socket.current = io("http://localhost:3002", {
            transports: ["websocket"],
            auth: {
                token: localStorage.getItem("token") // hoặc từ context
            }
        });

        // Khi kết nối thành công, gửi thông tin người dùng lên server
        socket.current.on("connect", () => {
            socket.current.emit("userOnline", userID);
        });

        // Clean up khi component unmount hoặc userID đổi
        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, [userID]); // chạy lại khi userID thay đổi

    return socket;
};

export default useSocket;
