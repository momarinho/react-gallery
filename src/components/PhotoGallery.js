import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from '../config/firebase';
import Header from './Header';

function PhotoGallery() {
  const [photoList, setPhotoList] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Create a reference to the images folder
    const imagesRef = ref(storage, 'images/');

    // List all the images in the folder
    listAll(imagesRef)
      .then((result) => {
        // Create a new list of photos with their download URLs
        const promises = result.items.map((item) =>
          getDownloadURL(item).then((url) => ({
            url,
            alt: item.name,
          }))
        );
        return Promise.all(promises);
      })
      .then((urls) => {
        // Set the list of photos
        setPhotoList(urls);
      })
      .catch((error) => {
        console.error('Error getting list of images:', error);
      });
  }, [imageUrl]);

  const handleUpload = (e) => {
    const files = e.target.files;
    const promises = [];

    // Loop through all selected files and upload each one
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, 'images/' + file.name);
      const uploadPromise = uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log('Image uploaded successfully');
          return getDownloadURL(storageRef);
        })
        .then((url) => {
          console.log('Image URL:', url);
          setImageUrl(url); // set imageUrl state variable
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
        });
      promises.push(uploadPromise);
    }

    // Wait for all uploads to finish before updating the photo list
    Promise.all(promises).then(() => {
      const imagesRef = ref(storage, 'images/');
      listAll(imagesRef)
        .then((result) => {
          const promises = result.items.map((item) =>
            getDownloadURL(item).then((url) => ({
              url,
              alt: item.name,
            }))
          );
          return Promise.all(promises);
        })
        .then((urls) => {
          setPhotoList(urls);
        })
        .catch((error) => {
          console.error('Error getting list of images:', error);
        });
    });
  };
  
  return (
    <div className="flex flex-col mx-auto">
      <Header handleUpload={handleUpload} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {photoList.map((photo, index) => (
          <div
            key={index}
            onClick={() =>
              navigate(`/detail/${index}`, {
                state: { photoList, selectedIndex: index },
              })
            }
            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer"
          >
            <img
              src={photo.url}
              className="object-cover w-full h-full"
              style={{
                height: '100%',
              }}
              onError={() => {
                console.log(`Error loading image ${photo.url}`);
              }}
              alt={photo.alt}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoGallery;
