/* eslint-disable */
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import GoogleMapReact from 'google-map-react';

// @mui
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import { Input, IconButton, InputAdornment, ClickAwayListener, 
        Avatar } from '@mui/material';
        // components
import Iconify from '../components/iconify';
// sections
import { getCookie } from '../common/helpers/api/session';
import { callWithToken } from '../common/helpers/utils/common';
import { HOSTNAME, APIHOST } from '../config';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  
  
  const [userCurrPosition, setUserCurrPosition] = useState({
    latitude: 39.9,
    longitude: -75.2
  });
  const [inputFriend, setInputFriend] = useState('');
  const [friendList, setFriendList] = useState([]);
  const [open, setOpen] = useState(false);

  const mapsApi = useRef(null);
  const mapInstance = useRef(null);
  const mapInfoWindow = useRef(null);
  const markerClusterer = useRef(null);
  
  const theme = useTheme();
  const { state } = useLocation();

  const isAuthenticated = getCookie("refreshToken") !== undefined;

  useEffect(() => {
    // navigator.geolocation.getCurrentPosition((pos) => {
    //   if(pos !== undefined) {
    //     setUserCurrPosition({
    //       latitude: pos.coords.latitude,
    //       longitude: pos.coords.longitude
    //     });
    //   }
    // });
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const addRestaurantMarkers = (businessList) => {
    // Create an array of alphabetical characters used to label the markers.
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Add some markers to the map.
    const markers = businessList.map((business, i) => {
      const label = labels[i % labels.length];
      const position = { lat: business.latitude, lng: business.longitude };
      const marker = new mapsApi.current.Marker({
        position,
        label,
      });

      // markers can only be keyboard focusable when they have click listeners
      // open info window when marker is clicked
      marker.addListener("click", () => {
        mapInfoWindow.current.setContent(`<a href="${HOSTNAME}/restaurant/${business.businessID}" target="_blank" rel="noopener noreferrer">${business.businessName}</a>`);
        mapInfoWindow.current.open(mapInstance.current, marker);
      });
      return marker;
    });

    markerClusterer.current.addMarkers(markers, true);
  };

  useEffect(() => {
    if(mapsApi.current !== null &&
       mapInstance.current !== null &&
       mapInfoWindow.current !== null &&
       markerClusterer.current !== null) {
      markerClusterer.current.clearMarkers(true);
      if(state !== null && 'inputRestaurant' in state) {
        axios.get(`${APIHOST}/api/restaurant/list`, {
          params: {
            business_name: state.inputRestaurant,
            latitude: userCurrPosition.latitude,
            longitude: userCurrPosition.longitude,
            radius: 100000
          }
        }).then((response) => {
          addRestaurantMarkers(response.data.businessList);
          markerClusterer.current.render();
        }).catch((err) => alert(err));
      }
    }
  }, [state, userCurrPosition]);

  const mapApiIsLoaded = (map, maps) => {
    mapsApi.current = maps;
    mapInstance.current = map;
    mapInfoWindow.current = new maps.InfoWindow({
      content: "",
      disableAutoPan: true,
    });
    // Add a marker clusterer to manage the markers.
    const markers = [];
    markerClusterer.current = new window.markerClusterer.MarkerClusterer({markers, map});
  };

  useEffect(() => {
    if(isAuthenticated) {
      const params = inputFriend.length >= 3 ? {friend_name: inputFriend} : {};
      callWithToken('get', `${APIHOST}/api/friend/list`, params).then((response) => {
        setFriendList(response.data.friendList);
      }).catch((err) => alert(err));
    }
  }, [inputFriend, isAuthenticated]);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
    setInputFriend('');
  };

  const getFriendListSidebar = () => {
    if(!isAuthenticated) return null;
    return (
      <>
      <Box sx={{ p: 1, justifyContent: 'space-between' }}>
        <Divider orientation="vertical" />
      </Box>
      <Box width="25%" sx={{ p: 1, justifyContent: 'space-between' }}>
        <Box sx={{ overflow: 'auto' }}>
          <ClickAwayListener onClickAway={handleClose}>
            <Box>
              {!open && (
                <IconButton onClick={handleOpen} sx={{ height: 30 }}>
                  <Iconify icon="eva:search-fill" />
                </IconButton>
              )}
              {open && (
                <Input
                  autoFocus
                  disableUnderline
                  placeholder="Search Friend…"
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                    </InputAdornment>
                  }
                  sx={{ mr: 1, fontWeight: 'fontWeightBold', height: 30 }}
                  value={inputFriend}
                  onChange={(e) => setInputFriend(e.target.value.replace(/^\s+/,""))}
                />
              )}
            </Box>
          </ClickAwayListener>
          <List>
            {friendList !== undefined && friendList.map((friend, index) => (
              <ListItem key={friend.friendID} disablePadding>
                <ListItemButton>
                  <Avatar src={`/assets/images/avatars/avatar_${friend.avatarNum}.jpg`} alt="photoURL" />
                  <ListItemText primary={friend.userName} sx={{ marginLeft: '10px' }}/>
                </ListItemButton>
                
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box width={isAuthenticated ? "75%" : "100%"} sx={{ p: 1, justifyContent: 'space-between' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 1,
              m: 1,
              bgcolor: '#F9FAFB',
            }}
          >
            <div style={{ height: '70vh', width: '100%', float:"left",  paddingLeft: "30px", paddingRight:"30px" }}>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: 'AIzaSyD_7nejf5R7RW9oJi55Y8Cu_LDr_picFxY',
                  language: 'en', }}
                defaultZoom={10}
                defaultCenter={[userCurrPosition.latitude, userCurrPosition.longitude]}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => mapApiIsLoaded(map, maps)}
              />
            </div>
          </Box>

        </Box>
        {getFriendListSidebar()}
      </Box>
    </>
  );
}
