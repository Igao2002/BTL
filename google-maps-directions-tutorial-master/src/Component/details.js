import React, { useState, useEffect } from 'react';
import { Box, Text, Select } from '@chakra-ui/react';
import { ref, child, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { database } from "./firebase"

export const Detail = () => {
    const [selectedVehicle, setSelectedVehicle] = useState('LGE_LM-V350_7417b07941dd5c2a');
    const [firebaseData, setFirebaseData] = useState('')
    const [speed, setSpeed] = useState('');
    const [location, setLocation] = useState('');
    const dbRef = ref(database);

    useEffect(() => {
        const device = 'realtime/' + selectedVehicle
        onValue(child(dbRef, `${device}`), (snapshot) => {
            const data = snapshot.val();
            setFirebaseData(data)
        });
        setSpeed(firebaseData.velocity);
        const current = firebaseData.latitude + ' - ' + firebaseData.longitude 
        setLocation(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVehicle]);

    const handleVehicleChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedVehicle(selectedValue);
    };

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
            <Text fontSize={20} mb={2}>Chọn phương tiện muốn hiển thị thông tin</Text>
            <Select fontSize={20} onChange={handleVehicleChange} value={selectedVehicle}>
                <option value="LGE_LM-V350_e9c88b01d291a942">Phương tiện 1</option>
                <option value="LGE_LM-V350_e9c88b01d291a942">Phương tiện 2</option>
            </Select>
            <Box fontSize={20} marginBottom={3} ml={4} mr={2} mt={2}>
                Tốc độ: {speed} m/s
            </Box>
            <Box fontSize={20} marginBottom={3} ml={4} mr={2}>
                Vị trí: {location}
            </Box>
        </Box>
    );
};