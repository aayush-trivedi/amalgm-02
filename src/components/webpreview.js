import React from 'react';
import { X } from 'lucide-react';

const WebPreview = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-stone-900 rounded-lg overflow-hidden w-full max-w-3xl h-3/4 flex flex-col">
        <div className="flex justify-between items-center p-2 bg-stone-800">
          <h3 className="text-lg font-semibold">Web Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={url}
            title="Web Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
};

export default WebPreview;

