import React from 'react';

const SearchResults = ({ results, summary, onPreviewClick }) => {
  return (
    <div className="mb-4">
      
      <div className="bg-transparent px-0 py-4 rounded-lg mb-0">
        <p className="text-base text-gray-300">{summary}</p>
      </div>

      <h2 className="text-lg font-semibold mb-2 text-white">Sources</h2>
      <div className="grid grid-cols-4 gap-2">
        {results.slice(0, 4).map((result, index) => (
          <div
            key={index}
            className="bg-stone-900 p-3 rounded-lg cursor-pointer hover:bg-stone-800 transition-colors flex flex-col h-full"
            onClick={() => onPreviewClick(result.url)}
          >
            <h4 className="text-sm font-semibold mb-2 line-clamp-2">{result.title}</h4>
            {result.snippet && (
              <p className="text-xs text-gray-300 mb-2 flex-grow line-clamp-3">{result.snippet}</p>
            )}
            <div className="flex items-center text-xs text-gray-400 mt-auto">
              <img
                src={`https://www.google.com/s2/favicons?domain=${new URL(result.url).hostname}&sz=16`}
                alt="favicon"
                className="mr-2 w-4 h-4"
              />
              <span className="truncate">{new URL(result.url).hostname}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
