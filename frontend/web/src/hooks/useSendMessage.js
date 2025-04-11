const useSendMessage = () => {
    const sendMessage = async (conversationID, content) => {
        try {
            const token = localStorage.getItem("token"); // Retrieve the token from localStorage

            const response = await fetch("http://localhost:3000/api/chat/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
                },
                body: JSON.stringify({ conversationID, content }),
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to send message");
            }

            const data = await response.json();
            return data; // Return the new message object
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    };

    return { sendMessage };
};

export default useSendMessage;