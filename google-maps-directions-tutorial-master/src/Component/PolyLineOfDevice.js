import { Box, Select,Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { database } from './firebase';
import { ref, child, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

export const PolyLineOfDevice = ({ onCoordinatesChange }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('samsung_SM-G970U1_77f7f43c97f709ee')
  const dbRef = ref(database);
  
  useEffect(() => {
    //lấy data
    const pathCoordinates = []
    onValue(child(dbRef, `route/` + selectedVehicle + `/data/dataSave`), (snapshot) => {
      const data = snapshot.val();
      for (const key in data) {
        if (typeof data[key] === 'object') {
          const value = { lat: data[key]['lat'], lng: data[key]['lng'] };
          pathCoordinates.push(value);
        }
      }
      onCoordinatesChange(pathCoordinates);
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
      <Text fontSize={20} mb={2}>Chọn phương tiện muốn hiển thị lộ trình</Text>
      <Select fontSize={20} value={selectedVehicle} onChange={handleSelectChange}>
          <option value="samsung_SM-G970U1_77f7f43c97f709ee">samsung_SM-G970U1_77f7f43c97f709ee</option>
      </Select>
    </Box>
  );
}