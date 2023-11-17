import { Box, Button, Select,Text } from '@chakra-ui/react';
import React from 'react';
import { Polyline } from '@react-google-maps/api';
import { database } from './firebase';
import { ref, child, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { PolyLineComponent } from './PolyLine';

export class PolyLineOfDevice extends React.Component {
    state = {
        selectedVehicle: 'LGE_LM-V350_7417b07941dd5c2a', // Giá trị mặc định được chọn
        coordinates: []
    }

    handleSelectChange = (event) => {
        this.setState({ selectedVehicle: event.target.value });
    }

    handleShow = () => {
      const pathCoordinates = []
      const selectedVehicle = this.state.selectedVehicle;
      //lấy data
      const dbRef = ref(database);
      onValue(child(dbRef, `location-history/` + selectedVehicle), (snapshot) => {
        const data = snapshot.val();
        for (const key in data) {
          if (typeof data[key] === 'object') {
            const value = { lat: data[key]['latitude'], lng: data[key]['longitude'] };
            pathCoordinates.push(value);
          }
        }
        this.setState({ coordinates: pathCoordinates})
      });
    }

    render() {
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
            {this.state.coordinates && (
              <Polyline
                path={this.state.coordinates}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 1.0,
                  strokeWeight: 3,
                }}
              />
            )}
            <Text fontSize={20} mb={2}>Chọn phương tiện muốn hiển thị đường đi</Text>
            <Select fontSize={20} value={this.state.selectedVehicle} onChange={this.handleSelectChange}>
                <option value="LGE_LM-V350_7417b07941dd5c2a">Phương tiện 1</option>
                <option value="LGE_LM-V350_e9c88b01d291a942">Phương tiện 2</option>
            </Select>
            <Button colorScheme='pink' type='submit' paddingBottom='25px' paddingTop='25px' width={'15%'} fontSize={20} marginTop={3} onClick={this.handleShow} >Show</Button>
            <PolyLineComponent dataToPass={this.state.coordinates} />
          </Box>
        );
    }
}