import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

import Header from './Header';
import Spinner from './Spinner';

function PhotoGallery() {
  const [photoList, setPhotoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [showNoPhotosMessage, setShowNoPhotosMessage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotoList = async () => {
      try {
        const imagesRef = ref(storage, 'images/');
        const result = await listAll(imagesRef);
        const promises = result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { url, alt: item.name };
        });
        const urls = await Promise.all(promises);
        setPhotoList(urls);
        setShowNoPhotosMessage(urls.length === 0);
      } catch (error) {
        console.error('Error getting list of images:', error);
      }
    };
    fetchPhotoList();
  }, []);

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }
    setLoading(true);
    setDeletingIndex(index);
    const itemToDelete = photoList[index];
    const imageRef = ref(storage, `images/${itemToDelete.alt}`);
    try {
      await deleteObject(imageRef);
      const updatedList = photoList.filter((photo, i) => i !== index);
      setPhotoList(updatedList);
      setShowNoPhotosMessage(updatedList.length === 0);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
    setLoading(false);
    setDeletingIndex(null);
  };

  return (
    <div className="flex flex-col mx-auto">
      <Header />
      {loading && <Spinner />}
      {showNoPhotosMessage && (
        <p className="text-center text-gray-500 mt-8">No photos available.</p>
      )}
      {!loading && !showNoPhotosMessage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 mx-4">
          {photoList.map((photo, index) => (
            <div
              key={index}
              onClick={() =>
                navigate(`/detail/${index}`, {
                  state: { photoList, selectedIndex: index },
                })
              }
              className="relative overflow-hidden rounded-lg shadow-md cursor-pointer"
              style={{ aspectRatio: '1 / 1' }}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="object-cover w-full h-full"
                onError={() => {
                  console.log(`Error loading image ${photo.url}`);
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(index);
                }}
                className={`absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline
                -none ${
                  deletingIndex === index
                    ? 'opacity-50 cursor-not-allowed'
                    : 'opacity-100 cursor-pointer'
                }`}
                disabled={deletingIndex === index}
              >
                {deletingIndex === index ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      X
                    </circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm10 0a2 2 0 11-4 0 2 2 0 014 0zm5.657 5.657a2 2 0 010 2.828l-1.414 1.4B8r3B4p7yhRXuBWLqsQ546WR43cqQwrbXMDFnBi6vSJBeif8tPW85a7r7DM961Jvk4hdryZoByEp8GC8HzsqJpRN4FxGM9 12l-4.414-4.414a2 2 0 010-2.828l1.414-1.414a2 2 0 012.828 0L12 9.172l4.414-4.414a2 2 0 012.828 0l1.414 1.414a2 2 0 010 2.828L16.828 12l4.414 4.414z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;
