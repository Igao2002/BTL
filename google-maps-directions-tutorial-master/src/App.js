import React from 'react'
import { Box, Button, ButtonGroup, Flex, HStack, IconButton, Input, SkeletonText, Text, Divider } from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'
import { useEffect, useRef, useState } from 'react'
import { ref, child, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { database } from "./Component/firebase"
import { DropdownSelect } from './Component/DropdownSelect';
import { PolyLineOfDevice } from './Component/PolyLineOfDevice';
import { PolyLineComponent } from './Component/PolyLine';
import { Detail } from './Component/details'
import { HistoryOfDevice } from './Component/historyOfDevice'
import { HistoryComponent } from './Component/history'

const libraries = ['places'];
function App() {
  const { isLoaded } = useJsApiLoader({
    // googleMapsApiKey: "AIzaSyBl28I_AAnRulJ-fWgu74m7J8V5eaClqgs",
    googleMapsApiKey: "AIzaSyBl28I_AAnRulJ-fWgu74m7J8V5eaClqgs",
    libraries: libraries,
  })
  
  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [position, setPosition] = useState('')
  const [showInfo, setShowInfo] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [showWay, setShowWay] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPolyline, setShowPolyline] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [route, setRoute] = useState([])
  const [history, setHistory] = useState([])
  const [dvc, setDvc] = useState('samsung_SM-G970U1_77f7f43c97f709ee')
  
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()
  const dbRef = ref(database);
  
  useEffect(() => {
    onValue(child(dbRef, `realtime/` + dvc), (snapshot) => {
      const data = snapshot.val();
      const now = { lat: data.latitude, lng: data.longitude }
      setPosition(now)
    });
  }, [dbRef, dvc]);

  if (!isLoaded) {
    return <SkeletonText />
  }

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
    setCoordinates(newCoordinates);
  }

  const handleCoordinatesChange = (newCoordinates) => {
    setRoute(newCoordinates);
    map.panTo(newCoordinates[0]);
  };

  const handleHistoryChange = (newHistory) => {
    setHistory(newHistory);
    map.panTo(newHistory[0]);
  };
  
  
  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  function infoFunction() {
    setShowInfo(!showInfo);
    setShowBox(false);
    setShowWay(false);
    setShowPolyline(false);
    setShowHistory(false);
  }

  function wayFunction(){
    setShowPolyline(!showPolyline);
    setShowWay(!showWay);
    setShowBox(false);
    setShowInfo(false);
    setShowHistory(false);
  }

  function historyFunction(){
    setShowHistory(!showHistory);
    setShowWay(false);
    setShowBox(false);
    setShowInfo(false);
    setShowPolyline(false);
  }

  function boxFunction() {
    setShowBox(!showBox);
    setShowWay(false);
    setShowInfo(false);
    setShowHistory(false);
    setShowPolyline(false);
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box 
        className='menu' 
        position='absolute' 
        left={0} 
        top={0} 
        h='100%' 
        w='12%' 
        bgColor='white' 
        zIndex={100} 
        display='flex' 
        alignItems='center' 
        flexDirection='column' 
        gap={50}
      >
        <Button colorScheme='pink' type='submit' paddingBottom='30px' paddingTop='30px' width={'80%'} fontSize={20} marginTop={50} onClick={boxFunction}>
          Tìm đường
        </Button>
        <Button colorScheme='pink' type='submit' paddingBottom='30px' paddingTop='30px' width={'80%'} fontSize={20} onClick={historyFunction}>
          Xem lịch sử đường đi
        </Button>
        <Button colorScheme='pink' type='submit' paddingBottom='30px' paddingTop='30px' width={'80%'} fontSize={20} onClick={wayFunction}>
          Xem lộ trình
        </Button>
        <Button colorScheme='pink' type='submit' paddingBottom='30px' paddingTop='30px' width={'80%'} fontSize={20} onClick={infoFunction}>
          Thông tin chi tiết
        </Button>
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
                  map.panTo(position)
                  map.setZoom(15)
                }}
              />
            </HStack>
            <Divider orientation='horizontal' mt={4} mb={4} />
            <DropdownSelect dataSave={coordinates}/>
          </Box>
        )}
        {showHistory && (
          <HistoryOfDevice onHistory={handleHistoryChange}/>
        )}
        {showWay && (
          <PolyLineOfDevice onCoordinatesChange={handleCoordinatesChange} />
        )}
        {showInfo && (
            <Detail/>
        )}
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={position}
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
          <Marker position={position} />
          {/* đường đi giữa 2 điểm. */}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {/* Đường đi từ dữ liệu firebase theo thiết bị */}
          {showPolyline && (
            <PolyLineComponent coordinates={route}/>
          )}
          {showHistory && (
            <HistoryComponent coordinates={history}/>
          )}
        </GoogleMap>
      </Box>
    </Flex>
  )
}

export default App