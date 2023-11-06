import React from 'react';
import { Polyline } from '@react-google-maps/api';
import { database } from './firebase';
import { ref, child, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";


export const PolyLineComponent = () => {
  const pathCoordinates = []
  //lấy data
  const dbRef = ref(database);
  onValue(child(dbRef, `location-history/LGE_LM-V350_7417b07941dd5c2a`), (snapshot) => {
    const data = snapshot.val();
    for (const key in data) {
      if (typeof data[key] === 'object') {
        const value = { lat: data[key]['latitude'], lng: data[key]['longitude'] };
        pathCoordinates.push(value);
      }
    }
  });
  return (
      <Polyline
        path={pathCoordinates}
        options={{
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }}
      />
  );
};