// lấy ra những message thuộc những conversation gần nhất có liên quan tới user 

import { useState, useEffect } from 'react';
import { getConversations } from '../api/messages';

const useConversations = (showConversation) => {
  const [conversations, setConversations] = useState([]);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversationError, setConversationError] = useState(null);

  const fetchConversations = async () => {
    try {
      setConversationLoading(true);
      const data = await getConversations();
      setConversations(data);
      setConversationError(null);
    } catch (err) {
      setConversationError(err.message);
      console.error("Error fetching conversations:", err);
    } finally {
      setConversationLoading(false);
    }
  };

  useEffect(() => {
    if (showConversation) {
      fetchConversations();
    }
  }, [showConversation]);

  return { conversations, conversationLoading, conversationError, conversationRefresh: fetchConversations };
};

export default useConversations;