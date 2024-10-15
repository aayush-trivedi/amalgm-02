import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, Search, SearchSlashIcon } from 'lucide-react';

const ChatBox = ({ botName = 'Assistant', currentBot, onSendMessage, isSearchMode, setIsSearchMode }) => {
  const [inputText, setInputText] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('auto');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 36; // Reduced from 60 to 36
      const newHeight = scrollHeight > maxHeight ? maxHeight : scrollHeight;
      setTextareaHeight(`${newHeight}px`);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
  };

  return (
    <div className="w-full bg-stone-900 text-white rounded-3xl mb-4 p-2">
      <div className="flex items-center">
        <button onClick={toggleSearchMode} className={`p-2 rounded-lg hover:bg-stone-800 transition-colors duration-150 ${isSearchMode ? 'bg-stone-800' : ''}`}>
          <SearchSlashIcon size={20} className="text-stone-400 mx-0" strokeWidth={2} />
        </button>
        <div className="flex-grow relative flex items-center">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isSearchMode ? "Live search" : `${botName}`}
            className="w-full bg-stone-900 text-white border-none rounded-lg py-2 px-1 mb-1 resize-none focus:outline-none focus:ring-0"
            style={{ height: textareaHeight, maxHeight: '36px', minHeight: '36px' }}
          />
        </div>
        <button className="p-2 rounded-lg hover:bg-stone-800 transition-colors duration-150 ml-2" onClick={() => {}}>
          <Mic size={20} className="text-stone-400" strokeWidth={2} />
        </button>
        <button className="p-2 rounded-lg hover:bg-stone-800 transition-colors duration-150 ml-2" onClick={triggerFileInput}>
          <Paperclip size={20} className="text-stone-400" strokeWidth={2} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default ChatBox;
