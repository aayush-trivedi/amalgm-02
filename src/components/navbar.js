import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { PenBox, SidebarIcon, User } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

const Navbar = ({ isSidebarOpen, toggleSidebar, onNewChat }) => {
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const createNewChat = () => {
    onNewChat();
  };

  return (
    <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-center">
      {!isSidebarOpen && (
        <div className="px-4">
          <button
            onClick={toggleSidebar}
            className="text-stone-400 hover:text-indigo-400 transition-colors duration-150"
          >
            <SidebarIcon size={20} />
          </button>
        </div>
      )}
      <div className="flex items-center bg-none rounded-full py-4 px-4 ml-auto">
        <button 
          onClick={createNewChat}
          className="text-stone-400 hover:text-indigo-400 transition-colors duration-150 mr-4"
        >
          <PenBox size={20} />
        </button>
        <div className="relative">
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center text-stone-400 hover:text-indigo-400 transition-colors duration-150"
          >
            {user && user.photoURL ? (
              <img 
                src={user.photoURL}
                alt="User profile" 
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <User size={20} />
            )}
          </button>
          {isProfileDropdownOpen && (
            <div className="absolute right-0 m-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Profile
              </button>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Settings
              </button>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
