import { Box, Button, ButtonGroup, Flex, HStack, IconButton, Input, SkeletonText, Text } from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'
import { useRef, useState } from 'react'
// Import the functions you need from the SDKs you need
import { ref, child, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { database } from "./Component/firebase"
import { PolyLineComponent } from "./Component/PolyLine"

const libraries = ['places'];

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC8kwhZ2AEEkMRAJExCe0jZrVKxR4sm7CU",
    libraries: libraries,
  })

  const [showPolyline, setShowPolyline] = useState(false);
  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

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
  }

  // const pathCoordinates = []
  let  center = { lat: 20.981159951655183, lng: 105.78742447634367 };
  //lấy data
  const dbRef = ref(database);

  // Vị trí
  // Lấy dữ liệu
  onValue(child(dbRef, `realtime/LGE_LM-V350_7417b07941dd5c2a`), (snapshot) => {
    const data = snapshot.val();
    center = { lat: data.latitude, lng: data.longitude }
  });
  console.log(center)
  // get(child(dbRef, `realtime/LGE_LM-V350_7417b07941dd5c2a`)).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     const data = snapshot.val()
  //     center = { lat: data.latitude, lng: data.longitude }
  //   } else {
  //     console.log("No data available");
  //   }
  // }).catch((error) => {
  //   console.error(error);
  // });

  //clear data input
  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  const box1 = document.querySelector('.directionBox')
  function displayDirectionsFunction() {
    box1.style.display = (box1.style.display === 'none') ? 'block' : 'none';
  }

  // PolyLine function displayDirections
  function polyLineFunction() {
    setShowPolyline(!showPolyline);
  }

  //display info
  const box3 = document.querySelector('.info');
  function displayInfo() {
    box3.style.display = (box3.style.display === 'none') ? 'flex' : 'none';
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
        <Button colorScheme='pink' type='submit' paddingBottom='30px' paddingTop='30px' width={'80%'} fontSize={20} marginTop={50} onClick={displayDirectionsFunction}>
          Tìm đường
        </Button>
        <Button colorScheme='pink' type='submit' paddingBottom='30px' paddingTop='30px' width={'80%'} fontSize={20} onClick={polyLineFunction}>
          Hiển thị đường đi
        </Button>
        <Button colorScheme='pink' type='submit' paddingBottom='30px' paddingTop='30px' width={'80%'} fontSize={20} onClick={displayInfo}>
          Thông tin
        </Button>
        {/*chỗ này sau đẩy dữ liệu vận tốc các thứ lên thì push vào đây.*/}
        <Box className='info' display='none' flexDirection={'column'} mt={200}>
          <Box fontSize={20} marginBottom={6} ml={4} mr={2}>
            Thông tin 1: mot hai ba bon nam sau bay tam
          </Box>
          <Box fontSize={20} marginBottom={6} ml={4} mr={2}>
            Tốc độ:
          </Box>
          <Box fontSize={20} marginBottom={6} ml={4} mr={2}>
            Vị trí:
          </Box>
          <Box fontSize={20} marginBottom={6} ml={4} mr={2}>
            Thông tin:
          </Box>
        </Box>
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
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}

          {/* {showPolyline && (
            <Polyline
              path={pathCoordinates}
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
              }}
            />
          )} */}
          {showPolyline && (
            <PolyLineComponent/>
          )}

        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
        className='directionBox'
        display={'none'}
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
      </Box>
    </Flex>
  )
}

export default App
