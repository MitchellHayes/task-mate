import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT2miWlhm5ZoutTReyE23xKn7gawqo9rQ",
  authDomain: "taskmate-52120.firebaseapp.com",
  projectId: "taskmate-52120",
  storageBucket: "taskmate-52120.appspot.com",
  messagingSenderId: "1045496763944",
  appId: "1:1045496763944:web:705b3fe672581cd479471d",
  measurementId: "G-3B4HZVVL0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// unregister() or register()
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

