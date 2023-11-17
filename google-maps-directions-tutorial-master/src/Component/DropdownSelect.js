import { Box, Button, Select, Text } from '@chakra-ui/react';
import React from 'react';
import { database } from './firebase';
import { ref, set } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

export class DropdownSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: 'LGE_LM-V350_7417b07941dd5c2a', // Giá trị mặc định được chọn
        };
    }

    handleSelectChange = (event) => {
        this.setState({ selectedOption: event.target.value });
    }

    handleSaveData = () => {
        const selectedOption = this.state.selectedOption;
        const receivedData = this.props.data;
        const dataToSave = {
            receivedData
        };
        console.log(dataToSave)
        // Thực hiện lưu dữ liệu
        set(ref(database, 'route/' + selectedOption), {
          data: receivedData,
        });
    }

    render() {
        return (
            <Box>
                <Text fontSize={16} mb={2}>Chọn thiết bị để lưu tuyến đường</Text>
                <Select value={this.state.selectedOption} onChange={this.handleSelectChange}>
                    <option value="LGE_LM-V350_e9c88b01d291a942">Thiết bị 1</option>
                    <option value="samsung_SM-G975F_bca70a5f1c14d30a">Thiết bị 2</option>
                </Select>
                <Button colorScheme='pink' type='submit' paddingBottom='25px' paddingTop='25px' width={'15%'} fontSize={20} marginTop={3} onClick={this.handleSaveData}>Save</Button>
            </Box>
            );
        }
}