import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function Header({ handleUpload }) {
  const [user] = useAuthState(auth);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  return (
    <div className="bg-gray-700 py-4 px-8 shadow-sm">
      <div className="flex justify-between items-center">
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
