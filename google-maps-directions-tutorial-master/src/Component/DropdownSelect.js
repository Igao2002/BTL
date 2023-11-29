import { Box, Button, Select, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { database } from './firebase';
import { ref, update } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

export const DropdownSelect = (coordinates) => {
    const [selectedOption, setSelectedOption] = useState('LGE_LM-V350_e9c88b01d291a942') // Giá trị mặc định được chọn
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    }

    const handleSaveData = () => {
        console.log(coordinates)
        update(ref(database, 'route/' + selectedOption), {
          data: coordinates,
        }).then(() => {
            console.log("ok");
        }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <Box>
            <Text fontSize={16} mb={2}>Chọn thiết bị để lưu tuyến đường</Text>
            <Select value={selectedOption} onChange={handleSelectChange}>
                <option value="LGE_LM-V350_e9c88b01d291a942">LGE_LM-V350_e9c88b01d291a942</option>
                <option value="LGE_LM-V350_7417b07941dd5c2a">LGE_LM-V350_7417b07941dd5c2a</option>
                <option value="samsung_SM-G975F_bca70a5f1c14d30a">samsung_SM-G975F_bca70a5f1c14d30a</option>
            </Select>
            <Button colorScheme='pink' type='submit' paddingBottom='25px' paddingTop='25px' width={'15%'} fontSize={20} marginTop={3} onClick={handleSaveData}>Save</Button>
        </Box>
    );
}
