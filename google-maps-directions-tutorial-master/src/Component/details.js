import React, { useState, useEffect } from 'react';
import { Box, Text, Select, Divider } from '@chakra-ui/react';
import { ref, child, onValue } from "firebase/database";
import { database } from "./firebase"

export const Detail = React.memo(() => {
    const [selectedVehicle, setSelectedVehicle] = useState('LGE_LM-V350_7417b07941dd5c2a');
    const [firebaseData, setFirebaseData] = useState('')
    const [speed, setSpeed] = useState('');
    const [azimuth, setAzimuth] = useState('')
    const [location, setLocation] = useState('');
    const [time, setTime] = useState('')
    const [warning, setWarning] = useState('')
    const dbRef = ref(database);

    useEffect(() => {
        const device = 'realtime/' + selectedVehicle
        onValue(child(dbRef, `${device}`), (snapshot) => {
            const data = snapshot.val();
            setFirebaseData(data)
        });
        setSpeed(firebaseData.velocity);
        const current = firebaseData.latitude + ' - ' + firebaseData.longitude;
        setLocation(current);
        setAzimuth(firebaseData.azimuth);
        if(firebaseData.behavior !== 'NORMAL'){
            setWarning(firebaseData.behavior)
        }

        const intervalId = setInterval(() => {
            setTime(new Date().toLocaleTimeString() + ' -/- ' + new Date().toLocaleDateString());
        }, 1000);
        return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVehicle, time]);

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
                <option value="LGE_LM-V350_7417b07941dd5c2a">LGE_LM-V350_7417b07941dd5c2a</option>
                <option value="LGE_LM-V350_e9c88b01d291a942">LGE_LM-V350_e9c88b01d291a942</option>
                <option value="samsung_SM-G975F_bca70a5f1c14d30a">samsung_SM-G975F_bca70a5f1c14d30a</option>
            </Select>
            <Box fontSize={20} marginBottom={3} ml={4} mr={2} mt={4}>
                Tốc độ: {speed} m/s
            </Box>
            <Divider orientation='horizontal' mt={2} mb={2} />
            <Box fontSize={20} marginBottom={3} ml={4} mr={2}>
                Vị trí: {location}
            </Box>
            <Divider orientation='horizontal' mt={2} mb={2} />
            <Box fontSize={20} marginBottom={3} ml={4} mr={2}>
                Góc: {azimuth}
            </Box>
            <Divider orientation='horizontal' mt={2} mb={2} />
            <Box fontSize={20} marginBottom={2} ml={4} mr={2}>
                Thời gian: {time}
            </Box>
            <Divider orientation='horizontal' mt={2} mb={2}/>
            {warning && (
                <Box fontSize={20} marginBottom={2} fontWeight={500} ml={4} mr={2} color={'red'}>
                    ! CẢNH BÁO cần duy trì tốc độ ở mức cho phép.
                </Box>
            )}
        </Box>
    );
})

//DONE