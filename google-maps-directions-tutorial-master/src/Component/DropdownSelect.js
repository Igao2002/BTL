import { Box, Button, Select, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { database } from './firebase';
import { ref, update } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

export const DropdownSelect = (coordinates) => {
    const [selectedOption, setSelectedOption] = useState('samsung_SM-G970U1_77f7f43c97f709ee')
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
                <option value="samsung_SM-G970U1_77f7f43c97f709ee">samsung_SM-G970U1_77f7f43c97f709ee</option>
            </Select>
            <Button colorScheme='pink' type='submit' paddingBottom='25px' paddingTop='25px' width={'15%'} fontSize={20} marginTop={3} onClick={handleSaveData}>Save</Button>
        </Box>
    );
}
