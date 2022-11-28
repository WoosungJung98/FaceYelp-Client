import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Grid} from '@mui/material';
import { useState, useEffect, useMemo, useCallback } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ImageList from '@mui/material/ImageList';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import GoogleMapReact from 'google-map-react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip'
import Rating from '@mui/material/Rating'
import { Divider, Avatar} from "@material-ui/core";
import Iconify from '../components/iconify';
import { APIHOST } from '../config';
import { getCookie } from '../common/helpers/api/session';
import { callWithToken } from '../common/helpers/utils/common';

// ----------------------------------------------------------------------
export default function BlogPage() {
  const isAuthenticated = getCookie("refreshToken") !== undefined;
  const [inputFriend, setInputFriend] = useState('');
  const [friendList, setFriendList] = useState([]);
  const [open, setOpen] = useState(false);

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

  const { businessID } = useParams();
  const [restaurantInfo, setRestaurantInfo] = useState({
      "address": "empty",
      "businessID": "empty",
      "businessName": "empty",
      "categories": [
        "empty"
      ],
      "city": "empty",
      "hours": {},
      "isOpen": null,
      "latitude": null,
      "longitude": null,
      "postalCode": "empty",
      "reviewCount": null,
      "stars": null,
      "state": "empty"
  });
  
  const [businessPhotos, setBusinessPhotos] = useState([]);

  // returns a new object with the values at each key mapped using mapFn(value)
  const objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
    result[key] = mapFn(object[key])
    return result
  }, {});

  const toLocaleStr = (hr, min) => {
    const dt = new Date();
    dt.setHours(hr);
    dt.setMinutes(min);
    return dt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  const hourMapFn = useCallback((value) => {
    if(value === "Closed") return "Closed";
    const splitVal = value.split('-');
    if(splitVal.length < 2) return "Data Unavailable";
    const openTime = splitVal[0].split(':');
    const closeTime = splitVal[1].split(':');
    if(openTime.length < 2 || closeTime.length < 2) return "Data Unavailable";
    const openHr = parseInt(openTime[0], 10);
    const openMin = parseInt(openTime[1], 10);
    const closeHr = parseInt(closeTime[0], 10);
    const closeMin = parseInt(closeTime[1], 10);
    if(Number.isNaN(openHr) || Number.isNaN(openMin) || Number.isNaN(closeHr) || Number.isNaN(closeMin)) {
      return "Data Unavailable";
    }
    if((openHr * 60 + openMin) >= (closeHr * 60 + closeMin)) return "Data Unavailable";
    return [toLocaleStr(openHr, openMin), toLocaleStr(closeHr, closeMin)].join(" - ");
  }, []);

  useEffect(() => {
    axios.get(`${APIHOST}/api/restaurant/${businessID}/info`, {}).then((response) => {
      if('businessInfo' in response.data) {
        response.data.businessInfo.hours = objectMap(response.data.businessInfo.hours, hourMapFn);
        setRestaurantInfo(response.data.businessInfo);
      }
    }).catch((err) => alert(err));
    axios.get(`${APIHOST}/api/restaurant/${businessID}/photos`, {}).then((response) => {
      if ('businessPhotoList' in response.data){
        setBusinessPhotos(response.data.businessPhotoList);
      }
    }).catch((err) => alert(err));
  }, [businessID, hourMapFn]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const restaurantImageListItems = useMemo(() => businessPhotos.map((photo) => {
    const imgURL = `${APIHOST}/business-images/${photo.photo_id}.jpg`;
    return (
      <ImageListItem key={photo.photo_id}>
        <img
          src={`${imgURL}?w=248&fit=crop&auto=format`}
          srcSet={`${imgURL}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={photo.label}
          loading="lazy"
        />
        {photo.caption.length > 0 ? (<ImageListItemBar title={photo.caption}/>) : null}
      </ImageListItem>
    );
  }), [businessPhotos]);

  const restaurantImageList = () => {
    if(businessPhotos.length === 0) return null;
    const colsWidthMap = {
      1: '40%',
      2: '60%',
      3: '80%',
    };
    const numCols = businessPhotos.length >= 3 ? 3 : businessPhotos.length;
    const imgWidth = colsWidthMap[numCols];
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 2,
          m: 1,
          bgcolor: '#F9FAFB',
        }}
      >
        <ImageList variant="woven" cols={numCols} gap={8} sx={{ width: imgWidth, height: 420}}>
          {restaurantImageListItems}
        </ImageList>
      </Box>
    );
  };

  const mapApiIsLoaded = (map, maps) => {
    new maps.Marker({
      position: { lat: restaurantInfo.latitude, lng: restaurantInfo.longitude},
      map,
      title: "Hello World!",
    });
  };

  const getGoogleMapLoc = () => {
    if(restaurantInfo.latitude !== null && restaurantInfo.longitude !== null) {
      return (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'AIzaSyD_7nejf5R7RW9oJi55Y8Cu_LDr_picFxY',
            language: 'en', }}
          defaultZoom={13}
          defaultCenter={[restaurantInfo.latitude, restaurantInfo.longitude]}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => mapApiIsLoaded(map, maps)}
        />
      );
    }
    return null;
  };

  const restaurantHoursTableItems = useMemo(() => {
    const dayOfWeekMap = {
      "mon": "Monday",
      "tues": "Tuesday",
      "thurs": "Thursday",
      "fri": "Friday",
      "sat": "Saturday",
      "sun": "Sunday"
    };
    return Object.entries(dayOfWeekMap).map(([key, val]) => (
      <StyledTableRow key={key}>
        <StyledTableCell component="th" scope="row">
          {val}
        </StyledTableCell>
        <StyledTableCell align="left">
          {key in restaurantInfo.hours ? restaurantInfo.hours[key] : "Data Unavailable"}
        </StyledTableCell>
      </StyledTableRow>
    ));
  }, [restaurantInfo.hours]);
  const isAuthenticatedPage = () => {
    if(!isAuthenticated)
    {return (
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 2,
        m: 1,
        bgcolor: '#F9FAFB',
      }}
    >
      <div style={{ height: '42vh', width: '50%', paddingRight:"30px" }} >
        {getGoogleMapLoc()}
      </div>
      <div style={{ height: '38vh', width: '30%', paddingLeft: "30px" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 10 }} style={{alignSelf:"flex-end"}} aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell> Days</StyledTableCell>
                <StyledTableCell align="left">Hours</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurantHoursTableItems}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
      );}
    return(
    <Box
      sx={{
        display: 'flex',
        p: 3,
        m: 1,
        bgcolor: '#F9FAFB',
        flexDirection:'column',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        height: 550
      }}
    >
      <Box style={{order: 1, height: '40vh', width: '60%', p: 1, m:1 }} >
        {getGoogleMapLoc()}
      </Box>
      <Box style={{ order: 2, height: '30vh', width: '60%', p:1, m:1 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 10 }} style={{alignSelf:"flex-end"}} aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell> Days</StyledTableCell>
                <StyledTableCell align="left">Hours</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurantHoursTableItems}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {getFriendListSidebar()}
    </Box>
    

  )}
  
  const getFriendListSidebar = () => {
    return (
      <>
      <Box sx={{ p: 1, width:"25%", order: 3}}>
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
          <List style={{maxHeight: 500, overflow:'auto'}}>
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
      <title> {restaurantInfo.businessName} </title>
    </Helmet>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: '#F9FAFB',
      }}
    >
      <h1>
        {restaurantInfo.businessName}
      </h1>
    </Box>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: '#F9FAFB',
      }}
    >
      <div>
        {
          restaurantInfo.categories.map((category) => (
            <div key={category} style={{padding:"2px", float:"left"}}>
              <Chip label={category} />
            </div>
            )
          ) 
        }
      </div>
    </Box>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: '#F9FAFB',
      }}
    >
      <Rating name="read-only" value={restaurantInfo.stars} readOnly />
    </Box>
    {restaurantImageList()}
    {isAuthenticatedPage()}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 2,
        m: 1,
        bgcolor: '#F9FAFB',
      }}
    >
      <h1> Reviews </h1>
    </Box>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 2,
        m: 1,
        bgcolor: '#F9FAFB',
      }}
    >
      <Paper style={{ width: "80%", padding: "40px 20px" }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp"/> 
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <div>
            <h4 style={{ margin: 0, textAlign: "left" }}>@jessicaromero</h4>
            <Rating name="read-only" value={3} readOnly />
            </div>
            <p style={{ textAlign: "left" }}>
              my name is jessica{" "}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              posted 1 minute ago
            </p>
          </Grid>
        </Grid>
        <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <div>
            <h4 style={{ margin: 0, textAlign: "left" }}>@williamjung</h4>
            <Rating name="read-only" value={3} readOnly />
            </div>
            <p style={{ textAlign: "left" }}>
              my name is william{" "}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              posted 1 minute ago
            </p>
          </Grid>
        </Grid>
        <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <div>
            <h4 style={{ margin: 0, textAlign: "left" }}>@christianchoi</h4>
            <Rating name="read-only" value={3} readOnly />
            </div>
            <p style={{ textAlign: "left" }}>
              my name is christian{" "}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              posted 1 minute ago
            </p>
          </Grid>
        </Grid>
      </Paper>
    </Box>
    </>
  );
}
