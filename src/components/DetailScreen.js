import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteObject } from 'firebase/storage';

import Spinner from './Spinner';

function NavBar({ onBack, onResetZoom, onDelete }) {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-700">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-800 text-white rounded-md cursor-pointer hover:bg-gray-600"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 19L8 12L15 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={onResetZoom}
        className="px-4 py-2 bg-gray-800 text-white rounded-md cursor-pointer hover:bg-gray-600"
      >
        Reset Zoom
      </button>
      <button
        onClick={onDelete}
        className="px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-700"
      >
        Delete
      </button>
    </nav>
  );
}

function DetailScreen() {
  const [photo, setPhoto] = useState(null);
  const location = useLocation();
  const { photoList, selectedIndex } = location.state;
  const [imageScale, setImageScale] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    setPhoto(photoList[selectedIndex]);
  }, [photoList, selectedIndex]);

  const handleWheel = (event) => {
    const newScale = event.deltaY > 0 ? imageScale - 0.1 : imageScale + 0.1;
    setImageScale(newScale);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleResetZoom = () => {
    setImageScale(1);
  };

  const handleDelete = () => {
    const newPhotoList = [...photoList];
    newPhotoList.splice(selectedIndex, 1);
    navigate(-1, { state: { photoList: newPhotoList } });
  };

  return (
    <div className="flex flex-col h-screen">
      <NavBar
        onBack={handleBack}
        onResetZoom={handleResetZoom}
        onDelete={handleDelete}
      />
      <div className="flex justify-center items-center flex-grow overflow-y-auto overflow-x-auto">
        {photo ? (
          <div className="relative">
            <img
              src={photo.url}
              alt={photo.alt}
              className="object-contain max-w-full max-h-full"
              style={{ maxHeight: '90vh', transform: `scale(${imageScale})` }}
              onWheel={handleWheel}
            />
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}

export default DetailScreen;
