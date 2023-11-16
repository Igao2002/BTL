import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

const routeHistory = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    // Khi ngày thay đổi, truy vấn dữ liệu tọa độ từ Realtime Database
    const formatDate = selectedDate.toISOString().split('T')[0]; // Lấy ngày dưới dạng 'YYYY-MM-DD'
    const dbRef = firebase.database().ref(formatDate); // Giả sử dữ liệu tọa độ được lưu dưới tên ngày

    dbRef.on('value', (snapshot) => {
      const data = snapshot.val() || {};
      // Lấy dữ liệu tọa độ và cập nhật state
      setCoordinates(data);
    });

    return () => {
      // Loại bỏ sự kiện lắng nghe khi component bị unmount
      dbRef.off();
    };
  }, [selectedDate]);

  return (
    <div>
      <h1>Chọn ngày:</h1>
      <input
        type="date"
        value={selectedDate.toISOString().split('T')[0]}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />

      <h2>Dữ liệu tọa độ cho ngày {selectedDate.toISOString().split('T')[0]}:</h2>
      <ul>
        {Object.keys(coordinates).map((key) => (
          <li key={key}>{`Lat: ${coordinates[key].lat}, Lng: ${coordinates[key].lng}`}</li>
        ))}
      </ul>
    </div>
  );
}

export default routeHistory;
