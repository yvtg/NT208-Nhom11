// lấy ra những message thuộc những conversation gần nhất có liên quan tới user 

import { useState, useEffect } from 'react';

const useConversations = (showConversation) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/chat/messages", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showConversation) {
      fetchConversations();
    }
  }, [showConversation]);

  return { conversations, loading, error, refresh: fetchConversations };
};

export default useConversations;