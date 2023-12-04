import { Box, Select,Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { database } from './firebase';
import { ref, child, onValue } from "firebase/database";

export const HistoryOfDevice = ({ onHistory }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('LGE_LM-V350_e9c88b01d291a942')
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
          <option value="LGE_LM-V350_e9c88b01d291a942">LGE_LM-V350_e9c88b01d291a942</option>
          <option value="LGE_LM-V350_7417b07941dd5c2a">LGE_LM-V350_7417b07941dd5c2a</option>
      </Select>
    </Box>
  );
}