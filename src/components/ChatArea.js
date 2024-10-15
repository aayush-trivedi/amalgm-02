import React, { useState, useRef, useCallback, useEffect } from 'react';
import { generateChatCompletion, generateChatTitle } from '../actions/openai-actions';
import { performExaSearch } from '../actions/exa-actions';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase'; // Make sure to import the Firebase db instance
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDoc, query, orderBy, getDocs, arrayUnion, Timestamp } from 'firebase/firestore';
import ChatMessage from './ChatMessage';
import SearchResults from './searchresults';
import Sidebar from './Sidebar';
import ChatBox from './chatbox';
import Navbar from './navbar';
import { Copy, RefreshCw, Download, SquareArrowOutUpRight } from 'lucide-react';
import WebPreview from './webpreview'; // We'll create this component next

// Add this CSS class at the top of your file or in a separate CSS file
const scrollbarHideStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const ChatArea = () => {
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [chats, setChats] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatTitle, setChatTitle] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (messages.length === 2) { // User message and first bot response
      generateChatTitle();
    }
  }, [messages]);

  const fetchChats = async () => {
    try {
      const chatsQuery = query(collection(db, 'chats'), orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(chatsQuery);
      
      const fetchedChats = {};
      querySnapshot.forEach((doc) => {
        const chatData = doc.data();
        let date;
        if (chatData.updatedAt instanceof Timestamp) {
          date = chatData.updatedAt.toDate().toISOString().split('T')[0];
        } else if (chatData.updatedAt && chatData.updatedAt.seconds) {
          date = new Date(chatData.updatedAt.seconds * 1000).toISOString().split('T')[0];
        } else {
          date = new Date().toISOString().split('T')[0];
        }
        
        if (!fetchedChats[date]) {
          fetchedChats[date] = [];
        }
        fetchedChats[date].push({
          id: doc.id,
          ...chatData,
          updatedAt: date // Use the formatted date string
        });
      });

      setChats(fetchedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const createNewChat = async (title, messages) => {
    try {
      const newChat = {
        title: title,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        messages: messages
      };
      const chatRef = await addDoc(collection(db, 'chats'), newChat);
      console.log('New chat created with ID:', chatRef.id);

      setCurrentChatId(chatRef.id);
      setChatTitle(title);

      // Update local state
      const today = new Date().toISOString().split('T')[0];
      setChats(prevChats => ({
        ...prevChats,
        [today]: [
          { id: chatRef.id, ...newChat, createdAt: new Date(), updatedAt: new Date() },
          ...(prevChats[today] || [])
        ]
      }));
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const updateChatTitle = async (title) => {
    if (!currentChatId) return;

    try {
      const chatRef = doc(db, 'chats', currentChatId);
      await updateDoc(chatRef, { 
        title: title,
        updatedAt: serverTimestamp()
      });

      // Update local state
      setChats(prevChats => {
        const updatedChats = { ...prevChats };
        Object.keys(updatedChats).forEach(date => {
          updatedChats[date] = updatedChats[date].map(chat => 
            chat.id === currentChatId ? { ...chat, title: title, updatedAt: new Date() } : chat
          );
        });
        return updatedChats;
      });

      setChatTitle(title);
    } catch (error) {
      console.error('Error updating chat title:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleResize = (newWidth) => {
    setSidebarWidth(newWidth);
  };

  const saveMessageToFirebase = async (message) => {
    if (!currentChatId) {
      console.error('No current chat ID');
      return;
    }

    try {
      const chatRef = doc(db, 'chats', currentChatId);
      await updateDoc(chatRef, {
        messages: arrayUnion(message),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving message to Firebase:', error);
    }
  };

  const handleSendMessage = async (message) => {
    if (message.trim()) {
      setIsLoading(true);
      const newMessage = { text: message, isUser: true, timestamp: new Date() };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      try {
        let botResponse;
        if (isSearchMode) {
          console.log('Performing Exa search:', message);
          const searchResult = await performExaSearch(message);
          botResponse = {
            type: 'search_results',
            results: searchResult.results,
            summary: searchResult.summary,
            timestamp: new Date()
          };
        } else {
          console.log('Sending message to OpenAI API:', message);
          const botResponseText = await generateChatCompletion(message);
          botResponse = { 
            type: 'text',
            text: botResponseText, 
            isUser: false, 
            timestamp: new Date() 
          };
        }

        console.log('Received response:', botResponse);

        updatedMessages.push(botResponse);
        setMessages(updatedMessages);

        // Generate title and save chat only after the first exchange
        if (!currentChatId) {
          const title = await generateChatTitle(message, botResponse.text || 'Search results');
          await createNewChat(title, updatedMessages);
        } else {
          await saveMessageToFirebase(newMessage);
          await saveMessageToFirebase(botResponse);
        }

        // Update the current chat in chats state
        updateChatInState(updatedMessages);
      } catch (error) {
        console.error('Error calling OpenAI API:', error);
        let errorMessage = "Sorry, I couldn't process your request. Please try again.";
        
        if (error.response) {
          console.error(error.response.status, error.response.data);
          errorMessage += ` (Error: ${error.response.status})`;
        } else {
          console.error(error.message);
          errorMessage += ` (${error.message})`;
        }

        setMessages(prevMessages => [
          ...prevMessages,
          { text: errorMessage, isUser: false }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateChatInState = (updatedMessages) => {
    if (currentChatId) {
      setChats(prevChats => {
        const today = new Date().toISOString().split('T')[0];
        const allChats = Object.values(prevChats).flat();
        const updatedChat = allChats.find(chat => chat.id === currentChatId);
        
        if (updatedChat) {
          updatedChat.messages = updatedMessages;
          updatedChat.updatedAt = today; // Use today's date as a string
        }

        const newChats = {};
        allChats.forEach(chat => {
          const chatDate = chat.updatedAt || today; // Use the existing date string or today
          if (!newChats[chatDate]) newChats[chatDate] = [];
          newChats[chatDate].push(chat);
        });

        return newChats;
      });
    }
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard');
  };

  const handleRefreshMessage = async (index) => {
    // Implement refresh logic here
  };

  const handleDownloadMessage = (text) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bot_response.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openInGoogleDocs = (text) => {
    const encodedText = encodeURIComponent(text);
    const googleDocsUrl = `https://docs.google.com/document/create?title=Bot%20Response&body=${encodedText}`;
    window.open(googleDocsUrl, '_blank');
  };

  // Mock current bot for demonstration
  const currentBot = {
    name: 'Assistant',
    logo: 'path/to/bot/logo.png' // Replace with actual path to bot logo
  };

  const loadChat = async (chatId) => {
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatRef);
      
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        setCurrentChatId(chatId);
        setMessages(chatData.messages || []);
        setChatTitle(chatData.title || 'Untitled Chat');
      } else {
        console.error('Chat not found');
        createNewChat();
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      createNewChat();
    }
  };

  const handleChatClick = (chatId) => {
    loadChat(chatId);
  };

  const handlePreviewClick = (url) => {
    setPreviewUrl(url);
  };

  const closePreview = () => {
    setPreviewUrl(null);
  };

  return (
    <>
      <style>{scrollbarHideStyles}</style>
      {/* Add a new style for increased line spacing */}
      <style>{`
        .chat-message-text {
          line-height: 2;
        }
      `}</style>
      <div className="flex h-screen bg-stone-950 text-white">
        <div style={{ width: isSidebarOpen ? `${sidebarWidth}px` : '0', flexShrink: 0, transition: 'width 0.3s ease-in-out' }}>
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            selectedChat={currentChatId}
            handleChatClick={handleChatClick}
            currentUser={null}
            chats={chats}
            setChats={setChats}  // Add this line
            width={sidebarWidth}
            onResize={(newWidth) => setSidebarWidth(newWidth)}
          />
        </div>
        <div className="flex-1 flex flex-col relative">
          <Navbar 
            isSidebarOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar}
            onNewChat={createNewChat}
          />
          <div className="flex-1 overflow-y-auto p-4 mt-4 max-w-3xl mx-auto w-full pb-24 hide-scrollbar">
            {messages.map((message, index) => (
              message.type === 'search_results' ? (
                <SearchResults 
                  key={index} 
                  results={message.results} 
                  summary={message.summary} 
                  onPreviewClick={handlePreviewClick}
                />
              ) : (
                <ChatMessage 
                  key={index} 
                  message={message} 
                  onCopy={handleCopyMessage}
                  onRefresh={() => handleRefreshMessage(index)}
                  onDownload={handleDownloadMessage}
                  onOpenInDocs={openInGoogleDocs}
                  className="chat-message-text"
                />
              )
            ))}
            {isLoading && <div className="text-center text-gray-400">Bot is typing...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            <div ref={messagesEndRef} />
          </div>
          {previewUrl && (
            <WebPreview url={previewUrl} onClose={closePreview} />
          )}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-3xl mx-auto">
              <ChatBox 
                ref={chatBoxRef}
                botName={currentBot.name}
                currentBot={currentBot}
                onSendMessage={handleSendMessage}
                isSearchMode={isSearchMode}
                setIsSearchMode={setIsSearchMode}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatArea;
