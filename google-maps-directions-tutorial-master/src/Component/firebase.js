import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "btl-iot-401114.firebaseapp.com",
  databaseURL: "https://btl-iot-401114-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "btl-iot-401114",
  storageBucket: "btl-iot-401114.appspot.com",
  messagingSenderId: "1048557997036",
  appId: "1:1048557997036:web:e016038cf608ffc5814ec9"
};

export const app = initializeApp(firebaseConfig);

export const database = getDatabase(app)