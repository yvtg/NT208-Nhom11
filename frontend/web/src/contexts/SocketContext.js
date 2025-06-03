import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';

const SocketContext = createContext(null);
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3002";

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        return null; // Thay vì throw error, trả về null
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const { userID, isLoading } = useAuth();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Nếu đã có socket hoặc chưa có userID thì không khởi tạo
        if (socketRef.current || !userID || isLoading) return;

        // Kết nối tới server socket.io
        socketRef.current = io(SOCKET_URL, {
            transports: ["websocket"],
            auth: {
                token: localStorage.getItem("token")
            }
        });

        // Khi kết nối thành công
        socketRef.current.on("connect", () => {
            console.log("Socket connected");
            setIsConnected(true);
            socketRef.current.emit("userOnline", userID);
        });

        // Khi mất kết nối
        socketRef.current.on("disconnect", () => {
            console.log("Socket disconnected");
            setIsConnected(false);
        });

        // Khi có lỗi kết nối
        socketRef.current.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            setIsConnected(false);
        });

        // Cleanup khi component unmount hoặc userID đổi
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
            }
        };
    }, [userID, isLoading]);

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    );
}; 