import { Box, Button, ButtonGroup, Flex, HStack, IconButton, Input, SkeletonText, Text, Divider } from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'
import { useRef, useState } from 'react'
import { ref, child, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { database } from "./Component/firebase"
import { DropdownSelect } from './Component/DropdownSelect';
import { PolyLineOfDevice } from './Component/PolyLineOfDevice';
import { PolyLineComponent } from './Component/PolyLine';
import React from 'react'
import { Detail } from './Component/details'

const libraries = ['places'];
function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC8kwhZ2AEEkMRAJExCe0jZrVKxR4sm7CU",
    libraries: libraries,
  })
  
  const [showPolyline, setShowPolyline] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [showWay, setShowWay] = useState(false);
  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [check, setCheck] = useState(false);
  // const [checkPolyLine, setCheckPolyLine] = useState(false);
  const coordinates = useRef([]);
  //test
  
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()
  
  if (!isLoaded) {
    return <SkeletonText />
  }
  
  const pathCoordinates = [];
  let  center = { lat: 20.981159951655183, lng: 105.78742447634367 };
  // lấy data
  const dbRef = ref(database);
  // Lấy dữ liệu vị trí hiện tại
  onValue(child(dbRef, `realtime/LGE_LM-V350_e9c88b01d291a942`), (snapshot) => {
    const data = snapshot.val();
    // console.log(data)
    center = { lat: data.latitude, lng: data.longitude }
  });
  // const coordinates = [];

  // Tính khoảng cách thời gian
  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
    const route = results.routes[0]; // Lấy tuyến đường đầu tiên
    const overviewPath = route.overview_path;
    const newCoordinates = overviewPath.map(path => ({
      lat: path.lat(),
      lng: path.lng(),
    }));
    // Danh sách tọa độ sẽ nằm trong biến coordinates
    coordinates.current = newCoordinates;
    setCheck(true)
    if(check){
      console.log(coordinates.current);
    }
  }
  
  //clear data input
  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  // function show...
  function polyLineFunction() {
    console.log('1')
    setShowPolyline(!showPolyline);
  }

  function infoFunction() {
    setShowInfo(!showInfo);
    setShowBox(false);
    setShowWay(false);
  }

  function wayFunction(){
    setShowWay(!showWay)
    setShowBox(false);
    setShowInfo(false);
  }

  function boxFunction() {
    setShowBox(!showBox);
    setShowWay(false);
    setShowInfo(false);
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box className='menu' position='absolute' left={0} top={0} h='100%' w='10%' bgColor='white' zIndex={100} display='flex' alignItems='center' flexDirection='column' gap={50}>
        <Button colorScheme='pink' type='submit' paddingBottom='30px' paddingTop='30px' width={'80%'} fontSize={20} marginTop={50} onClick={boxFunction}>
          Tìm đường
        </Button>
        <Button colorScheme='pink' type='submit' paddingBottom='30px' paddingTop='30px' width={'80%'} fontSize={20} onClick={wayFunction}>
          Hiển thị đường đi
        </Button>
        <Button colorScheme='pink' type='submit' paddingBottom='30px' paddingTop='30px' width={'80%'} fontSize={20} onClick={infoFunction}>
          Thông tin chi tiết
        </Button>
      </Box>
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {/* đường đi giữa 2 điểm. */}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {/* Đường đi từ dữ liệu firebase theo thiết bị */}
          {showPolyline && (
            <PolyLineComponent data={pathCoordinates}/>
          )}
        </GoogleMap>
      </Box>
      {/* box nhập thông tin tìm đường */}
      {showBox && (
        <Box
          p={4}
          borderRadius='lg'
          m={4}
          bgColor='white'
          shadow='base'
          minW='container.md'
          zIndex='1'
        >
          <HStack spacing={2} justifyContent='space-between'>
            <Box flexGrow={1}>
              <Autocomplete>
                <Input type='text' placeholder='Điểm đầu' ref={originRef} />
              </Autocomplete>
            </Box>
            <Box flexGrow={1}>
              <Autocomplete>
                <Input
                  type='text'
                  placeholder='Điểm cuối'
                  ref={destiantionRef}
                />
              </Autocomplete>
            </Box>

            <ButtonGroup>
              <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
                Tính
              </Button>
              <IconButton
                aria-label='center back'
                icon={<FaTimes />}
                onClick={clearRoute}
              />
            </ButtonGroup>
          </HStack>
          <HStack spacing={4} mt={4} justifyContent='space-between'>
            <Text>Khoảng Cách: {distance} </Text>
            <Text>Khoảng thời gian: {duration} </Text>
            <IconButton
              aria-label='center back'
              icon={<FaLocationArrow />}
              isRound
              onClick={() => {
                map.panTo(center)
                map.setZoom(15)
              }}
            />
          </HStack>
          <Divider orientation='horizontal' mt={4} mb={4} />

          <DropdownSelect data={coordinates.current}/>
        </Box>
      )}
      {showInfo && (
        // <Box
        //   p={4}
        //   borderRadius='lg'
        //   m={4}
        //   bgColor='white'
        //   shadow='base'
        //   minW='container.md'
        //   zIndex='1'
        // >
        //   <Text fontSize={20} mb={2}>Chọn phương tiện muốn hiển thị thông tin</Text>
        //   <Select fontSize={20}>
        //       <option value="LGE_LM-V350_7417b07941dd5c2a">Phương tiện 1</option>
        //       <option value="samsung_SM-G975F_bca70a5f1c14d30a">Phương tiện 2</option>
        //   </Select>
        //   <Box fontSize={20} marginBottom={3} ml={4} mr={2} mt={2}>
        //     Tốc độ:
        //   </Box>
        //   <Box fontSize={20} marginBottom={3} ml={4} mr={2}>
        //     Vị trí:
        //   </Box>
        //   <Box fontSize={20} marginBottom={3} ml={4} mr={2}>
        //     Thông tin:
        //   </Box>
        // </Box>
        <Detail/>
      )}
      {showWay && (
        <PolyLineOfDevice fc={polyLineFunction}/>
      )}
    </Flex>
  )
}

export default App