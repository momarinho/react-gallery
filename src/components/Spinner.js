import React from 'react';

function Spinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border-4 border-gray-400 rounded-full animate-spin"></div>
    </div>
  );
}

export default Spinner;
