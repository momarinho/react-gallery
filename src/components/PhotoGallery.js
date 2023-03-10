import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

import Header from './Header';

function PhotoGallery() {
  const [photoList, setPhotoList] = useState([]);

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
      } catch (error) {
        console.error('Error getting list of images:', error);
      }
    };
    fetchPhotoList();
  }, []);

  return (
    <div className="flex flex-col mx-auto">
      <Header />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 mx-4">
        {photoList.map((photo, index) => (
          <div
            key={index}
            onClick={() =>
              navigate(`/detail/${index}`, {
                state: { photoList, selectedIndex: index },
              })
            }
            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer hover:scale-105 hover:opacity-90"
          >
            <img
              src={photo.url}
              alt={photo.alt}
              className="object-cover w-full h-full"
              style={{ aspectRatio: '1 / 1' }}
              onError={() => {
                console.log(`Error loading image ${photo.url}`);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoGallery;
