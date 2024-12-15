import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Trash2, Edit, Save, PlusCircle } from 'lucide-react';

function App() {
  // Consolidated state management using a single state object
  // Reduces multiple state variables and simplifies updates
  const [state, setState] = useState({
    videoUrl: '',        // URL of the video to be captioned
    captions: [],        // Array of caption objects
    currentCaption: '',  // Text of the current caption being added/edited
    startTime: '',       // Start time for the current caption
    endTime: '',         // End time for the current caption
    currentTime: 0,      // Current playback time of the video
    editingIndex: null   // Index of caption being edited (null if adding new)
  });

  // Reference to the video element for direct DOM manipulation
  const videoRef = useRef(null);

  // Centralized state update method to ensure consistent state updates
  // Uses functional update to merge new state with existing state
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Add or update a caption in the captions list
  const addCaption = useCallback(() => {
    const { currentCaption, startTime, endTime, captions, editingIndex } = state;

    // Validate input fields
    if (currentCaption && startTime && endTime) {
      const newCaptions = [...captions];
      const captionData = { 
        text: currentCaption, 
        start: parseFloat(startTime), 
        end: parseFloat(endTime) 
      };

      // Update existing caption or add new caption
      if (editingIndex !== null) {
        newCaptions[editingIndex] = captionData;
      } else {
        newCaptions.push(captionData);
      }

      // Reset form and update captions
      updateState({
        captions: newCaptions,
        currentCaption: '',
        startTime: '',
        endTime: '',
        editingIndex: null
      });
    } else {
      alert('Please fill in all fields to add a caption.');
    }
  }, [state, updateState]);

  // Update current video playback time
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      updateState({ currentTime: videoRef.current.currentTime });
    }
  }, [updateState]);

  // Seek video to a specific time (used for caption navigation)
  const seekToCaption = useCallback((start) => {
    if (videoRef.current) {
      videoRef.current.currentTime = start;
    }
  }, []);

  // Memoized calculation of currently visible captions
  // Only recalculates when captions or current time changes
  const visibleCaptions = useMemo(() => 
    state.captions.filter(caption => 
      state.currentTime >= caption.start && state.currentTime <= caption.end
    ), 
    [state.captions, state.currentTime]
  );

  // Export captions to a JSON file
  const exportCaptions = useCallback(() => {
    const captionsJson = JSON.stringify(state.captions, null, 2);
    const blob = new Blob([captionsJson], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'video_captions.json';
    link.click();
  }, [state.captions]);

  // Import captions from a JSON file
  const importCaptions = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Parse imported JSON and update captions
          const importedCaptions = JSON.parse(e.target.result);
          updateState({ captions: importedCaptions });
        } catch {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  }, [updateState]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* App Title */}
      <h1 className="text-2xl font-bold text-center mb-4">Video Captioning App</h1>
      
      {/* Video URL and Import/Export Controls */}
      <div className="flex mb-4 space-x-2">
        <input 
          value={state.videoUrl} 
          onChange={(e) => updateState({ videoUrl: e.target.value })}
          placeholder="Video URL" 
          className="flex-grow p-2 border rounded"
        />
        <button 
          onClick={exportCaptions} 
          className="bg-blue-500 text-white p-2 rounded"
        >
          Export
        </button>
        {/* Hidden file input for importing captions */}
        <input 
          type="file" 
          accept=".json" 
          onChange={importCaptions} 
          className="hidden" 
          id="import-captions"
        />
        <label htmlFor="import-captions" className="cursor-pointer">
          <div className="bg-green-500 text-white p-2 rounded">
            Import
          </div>
        </label>
      </div>

      {/* Video Player with Dynamic Captions */}
      <div className="relative mb-4">
        <video
          ref={videoRef}
          src={state.videoUrl}
          controls
          onTimeUpdate={handleTimeUpdate}
          className="w-full"
        />
        
        {/* Display captions overlaid on video */}
        {visibleCaptions.map(caption => (
          <div 
            key={caption.start} 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 rounded"
          >
            {caption.text}
          </div>
        ))}
      </div>

      {/* Caption Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <input 
          value={state.currentCaption}
          onChange={(e) => updateState({ currentCaption: e.target.value })}
          placeholder="Caption Text"
          className="p-2 border rounded"
        />
        <input 
          type="number"
          value={state.startTime}
          onChange={(e) => updateState({ startTime: e.target.value })}
          placeholder="Start Time (s)"
          className="p-2 border rounded"
        />
        <input 
          type="number"
          value={state.endTime}
          onChange={(e) => updateState({ endTime: e.target.value })}
          placeholder="End Time (s)"
          className="p-2 border rounded"
        />
      </div>

      {/* Add/Update Caption Button */}
      <button 
        onClick={addCaption} 
        className="w-full bg-indigo-500 text-white p-2 rounded mb-4"
      >
        {state.editingIndex !== null ? 'Update Caption' : 'Add Caption'}
      </button>

      {/* List of Added Captions */}
      <div className="space-y-2">
        {state.captions.map((caption, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center bg-gray-100 p-2 rounded"
          >
            <div>
              <span>{caption.text}</span>
              <span className="text-gray-500 ml-2">
                ({caption.start}s - {caption.end}s)
              </span>
            </div>
            {/* Caption Action Buttons */}
            <div className="space-x-2">
              {/* Seek to Caption Start Time */}
              <button 
                onClick={() => seekToCaption(caption.start)}
                className="text-blue-500"
              >
                ▶️
              </button>
              {/* Edit Caption */}
              <button 
                onClick={() => updateState({ 
                  currentCaption: caption.text,
                  startTime: caption.start.toString(),
                  endTime: caption.end.toString(),
                  editingIndex: index 
                })}
                className="text-green-500"
              >
                <Edit size={16} />
              </button>
              {/* Delete Caption */}
              <button 
                onClick={() => updateState({ 
                  captions: state.captions.filter((_, i) => i !== index) 
                })}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;