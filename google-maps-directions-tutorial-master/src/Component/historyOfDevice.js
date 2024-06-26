import { Box, Select,Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { database } from './firebase';
import { ref, child, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

export const HistoryOfDevice = ({ onHistory }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('samsung_SM-G970U1_77f7f43c97f709ee')
  const dbRef = ref(database);
  
  useEffect(() => {
    //lấy data
    const pathCoordinates = []
    onValue(child(dbRef, `location-history/` + selectedVehicle), (snapshot) => {
      const data = snapshot.val();
      console.log(selectedVehicle);
      for (const key in data) {
        if (typeof data[key] === 'object') {
          const value = { lat: data[key]['latitude'], lng: data[key]['longitude'] };
          pathCoordinates.push(value);
        }
      }
      onHistory(pathCoordinates);
      console.log(pathCoordinates)
    });
  }, [dbRef, selectedVehicle])

  const handleSelectChange = (event) => {
    setSelectedVehicle(event.target.value);
  }
    
    return (
      <Box
        p={4}
      borderRadius='lg'
      m={4}
      bgColor='white'
      shadow='base'
      minW='container.md'
      zIndex='1'
      >
      <Text fontSize={20} mb={2}>Chọn phương tiện muốn hiển thị lịch sử đường đi</Text>
      <Select fontSize={20} value={selectedVehicle} onChange={handleSelectChange}>
          <option value="samsung_SM-G970U1_77f7f43c97f709ee">samsung_SM-G970U1_77f7f43c97f709ee</option>
      </Select>
    </Box>
  );
}