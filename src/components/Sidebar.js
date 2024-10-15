import React, { useState, useEffect, useRef } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { SidebarIcon, Search, Newspaper, Pickaxe, User, History, Trash2, DotSquare, OptionIcon, Option, DropletsIcon, Ellipsis } from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure to import your Firebase db instance

const Sidebar = ({ 
  isSidebarOpen, 
  toggleSidebar, 
  selectedChat, 
  handleChatClick, 
  currentUser, 
  chats, 
  setChats,  // Add this line
  width, 
  onResize 
}) => {
  const [activeSection, setActiveSection] = useState('history');
  const sidebarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newWidth = e.clientX;
    if (newWidth < 200) {
      toggleSidebar();
    } else if (newWidth > window.innerWidth * 0.3) {
      onResize(window.innerWidth * 0.3);
    } else {
      onResize(newWidth);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const deleteChat = async (chatId) => {
    try {
      await deleteDoc(doc(db, 'chats', chatId));
      
      // Update local state
      setChats(prevChats => {
        const updatedChats = { ...prevChats };
        Object.keys(updatedChats).forEach(date => {
          updatedChats[date] = updatedChats[date].filter(chat => chat.id !== chatId);
          if (updatedChats[date].length === 0) {
            delete updatedChats[date];
          }
        });
        return updatedChats;
      });

      // If the deleted chat was the current chat, inform the parent component
      if (selectedChat === chatId) {
        handleChatClick(null); // Assuming null indicates no chat is selected
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return 'TODAY';
    } else if (isYesterday(date)) {
      return 'YESTERDAY';
    } else {
      return format(date, "MMMM do, yyyy");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'history':
        return (
          <>
            {Object.entries(chats).length > 0 ? (
              Object.entries(chats)
                .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                .map(([date, dateChats]) => (
                  <div key={date}>
                    <div className="px-4 py-2 text-xs text-gray-400">{formatDate(date)}</div>
                    {dateChats
                      .sort((a, b) => b.createdAt - a.createdAt)
                      .map((chat) => (
                        <div
                          key={chat.id}
                          className={`group relative w-full text-left px-4 py-2 hover:bg-stone-800 rounded-lg transition-colors duration-150 mb-1 ${
                            selectedChat === chat.id ? 'bg-stone-800' : ''
                          }`}
                        >
                          <button
                            className="w-full h-full flex items-center"
                            onClick={() => handleChatClick(chat.id)}
                          >
                            <span className="truncate text-sm">{chat.title}</span>
                          </button>
                          <button
                            className="absolute right-2 px-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(chat.id);
                            }}
                          >
                            <Ellipsis size={20} className="text-stone-400 hover:text-white " />
                          </button>
                        </div>
                      ))}
                  </div>
                ))
            ) : (
              <p className="text-xs text-gray-400 px-4 py-2">No recent interactions</p>
            )}
          </>
        );
      case 'search':
        return <p className="text-sm text-gray-400 p-4">Search functionality coming soon</p>;
      case 'news':
        return <p className="text-sm text-gray-400 p-4">News section coming soon</p>;
      case 'tools':
        return <p className="text-sm text-gray-400 p-4">Tools section coming soon</p>;
      default:
        return null;
    }
  };

  return (
    <div 
      ref={sidebarRef}
      className={`fixed top-4 left-4 bottom-4 bg-stone-900 text-white transition-all duration-300 ease-in-out rounded-3xl shadow-lg ${
        isSidebarOpen ? '' : 'w-0 overflow-hidden'
      }`}
      style={{ 
        width: isSidebarOpen ? `${width}px` : '0',
        maxWidth: 'calc(100% - 32px)', // Ensure it doesn't overflow the screen
        maxHeight: 'calc(100vh - 32px)' // Ensure it doesn't overflow the screen
      }}
    >
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 flex items-center">
          <button 
            className={`text-stone-400 hover:text-gray-300 mr-4 ${activeSection === 'history' ? 'text-white' : ''}`}
            onClick={() => setActiveSection('history')}
          >
            <History size={20} />
          </button>
          <button 
            className={`text-stone-400 hover:text-gray-300 mr-4 ${activeSection === 'news' ? 'text-white' : ''}`}
            onClick={() => setActiveSection('news')}
          >
            <Newspaper size={20} />
          </button>
          <button 
            className={`text-stone-400 hover:text-gray-300 mr-4 ${activeSection === 'tools' ? 'text-white' : ''}`}
            onClick={() => setActiveSection('tools')}
          >
            <Pickaxe size={20} />
          </button>
          
          <button onClick={toggleSidebar} className="text-stone-400 hover:text-gray-300 ml-auto">
            <SidebarIcon size={20} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto px-3">
          {renderContent()}
        </div>
        {currentUser && (
          <div className="p-3 border-t border-stone-700 flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-500 flex-shrink-0 mr-2">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-full h-full rounded-full" />
              ) : (
                <User className="w-full h-full p-1.5 text-white" />
              )}
            </div>
            <div className="flex-grow">
              <p className="text-xs font-medium">{currentUser.displayName}</p>
              <p className="text-xs text-gray-400">{currentUser.email}</p>
            </div>
          </div>
        )}
      </div>
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-gray-600 opacity-0 hover:opacity-100 transition-opacity rounded-r-2xl"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default Sidebar;