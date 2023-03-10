import React, { useState } from 'react';
import { auth, storage } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { Link } from 'react-router-dom';

function Header() {
  const [user] = useAuthState(auth);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [photoList, setPhotoList] = useState([]);

  const handleLogin = async (event) => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then(() => {
        console.log('Signed in with Google successfully');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error signing in with Google', error);
      });
  };

  const handleLogout = async () => {
    await auth.signOut();
    setShowLogoutModal(false);
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    const uploadPromises = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name;
      const storageRef = ref(storage, `images/${fileName}`);
      const uploadPromise = uploadBytes(storageRef, file)
        .then(async () => {
          const downloadUrl = await getDownloadURL(storageRef);
          return downloadUrl;
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          return null;
        });
      uploadPromises.push(uploadPromise);
    }

    const urls = await Promise.all(uploadPromises);
    setPhotoList((prevList) => [...prevList, ...urls.filter((url) => url)]);
    setImageUrl(null);
    window.location.reload();
  };

  return (
    <div className="bg-gray-700 py-4 px-8 shadow-sm">
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl text-gray-100 hover:text-blue-200 cursor-pointer"
        >
          My Photo Gallery
        </Link>
        {user && (
          <>
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-gray-800 text-white rounded-md cursor-pointer hover:bg-gray-700"
            >
              Upload Photos
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </>
        )}
        {user ? (
          <img
            className="rounded-full ml-4 cursor-pointer w-10 h-10"
            src={user?.photoURL}
            alt={user?.displayName}
            onClick={() => setShowLogoutModal(true)}
          />
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-gray-800 text-white rounded-md cursor-pointer hover:bg-gray-700"
          >
            Login
          </button>
        )}
        {showLogoutModal && (
          <div className="fixed z-50 inset-0 overflow-y-auto bg-gray-900 bg-opacity-90">
            <div className="flex items-center justify-center min-h-screen">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Logout Confirmation
                </h2>
                <p className="mb-4">Are you sure you want to logout?</p>
                <div className="flex justify-end">
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                    onClick={() => setShowLogoutModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
