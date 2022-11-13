import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Grid} from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
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
// import HOSTNAME from '../config.default'
// ----------------------------------------------------------------------
export default function BlogPage() {
  const { businessID } = useParams();
  const [restaurantInfo, setRestaurantInfo] = useState({
      "address": "empty",
      "businessID": "empty",
      "businessName": "empty",
      "categories": [
        "empty"
      ],
      "city": "empty",
      "hours": null,
      "isOpen": null,
      "latitude": null,
      "longitude": null,
      "postalCode": "empty",
      "reviewCount": null,
      "stars": null,
      "state": "empty"
  });

  const [restaurantImages, setRestaurantImages] = useState([]);
  const client = axios.create({
    baseURL: `https://faceyelp.com/api/restaurant`
  });

  useEffect(() => {
    async function fetchRestaurantInfo() {
      const response = await client.get(`/${businessID}/info`, {});
      if('businessInfo' in response.data) {
        response.data.businessInfo.hours = objectMap(response.data.businessInfo.hours, hourMapFn);
        setRestaurantInfo(response.data.businessInfo);
      }
    }
    async function fetchRestaurantPhotos() {
      const responseImages = await client.get(`/${businessID}/photos`, {});
      if ('businessPhotoList' in responseImages.data){
        setRestaurantImages(responseImages.data.businessPhotoList);
      }
    }
    fetchRestaurantInfo();
    fetchRestaurantPhotos();
  }, []);

  // returns a new object with the values at each key mapped using mapFn(value)
  const objectMap = (object, mapFn) => {
    return Object.keys(object).reduce((result, key) => {
      result[key] = mapFn(object[key])
      return result
    }, {})
  };

  const hourMapFn = (value) => {
    if(value === "Closed") return "Closed";
    let open = value?.split("-")[0]?.split(":");
    let close = value?.split("-")[1]?.split(":");
    if (value !== null){
      if (open[0] >= 12){
        if (open[0] > 12){
          open[0] =- 12;
        }
        if (open[1].length === 1){
          open[1] += "0";
        }
        open[1] += "pm" ;
      }
      else{
        if (open[1].length === 1){
          open[1] += "0";
        }
        open[1] += "am";
      }
      if (close[0] >= 12){
        if (close[0] > 12){
          close[0] =- 12;
        }
        if (close[1].length === 1){
          close[1] += "0"
        }
        close[1] += "pm" ;
      }
      else{
        if (close[1].length === 1){
          close[1] += "0"
        }
        close[1] += "am";
      }
      open = open.join(":");
      close = close.join(":");
    }
    return [open, close].join("-");
  };

  const mapApiIsLoaded = (map, maps) => {
    new maps.Marker({
      position: { lat: restaurantInfo.latitude, lng: restaurantInfo.longitude},
      map,
      title: "Hello World!",
    });
  };

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

  const restaurantImageListItems = useMemo(() => restaurantImages.map((img) => {
    const imgURL = `https://faceyelp.com/images/${img.photo_id}.jpg`;
    return (
      <ImageListItem key={img.photo_id}>
        <img
          src={`${imgURL}?w=248&fit=crop&auto=format`}
          srcSet={`${imgURL}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt="Unavailable"
          loading="lazy"
        />
        <ImageListItemBar
          title={img.caption}
          subtitle={img.label}
          actionIcon={
            <IconButton
              sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
              aria-label={`info about ${img.label}`}
            >
              <InfoIcon />
            </IconButton>
          }
        />
      </ImageListItem>
    );
  }), [restaurantImages]);

  return (
    <>
      <Helmet>
        <title> {restaurantInfo.businessName} </title>
      </Helmet>
    <h1>
      {restaurantInfo.businessName}
    </h1>
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
    <Rating name="read-only" value={restaurantInfo.stars} readOnly />
    <div style={{width:"100%", float:"left", paddingLeft: "5px", paddingTop:"10px"}}>
      Open: Closes at 10pm NEED TO CHANGE
    </div>
    <div style={{}} >
      <ImageList sx={{ width: 1100, height: 370, margin:"auto"}}>
        <ImageListItem key="Subheader" cols={2}>
          <h1>Images</h1>
        </ImageListItem>
        {restaurantImageListItems}
      </ImageList>
    </div>
    <div style={{ padding: "30px",}} >
      <div style={{ height: '40vh', width: '50%', float:"left",  paddingLeft: "30px", paddingRight:"30px" }} >
        {getGoogleMapLoc()}
        </div>
        <div style={{ height: '38vh', width: '50%', float:"right", margin:"auto", paddingLeft: "50px", paddingRight:"50px", paddingBottom:"30px"}}>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 10 }} style={{alignSelf:"flex-end"}} aria-label="customized table" size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell> Days</StyledTableCell>
              <StyledTableCell align="left">Hours</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  Monday
                </StyledTableCell>
                <StyledTableCell align="left"> {restaurantInfo.hours === null ? '...' : restaurantInfo.hours.mon}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  Tuesday
                </StyledTableCell>
                <StyledTableCell align="left">{restaurantInfo.hours === null ? '...' : restaurantInfo.hours.tues}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  Wednesday
                </StyledTableCell>
                <StyledTableCell align="left">{restaurantInfo.hours === null ? '...' : restaurantInfo.hours.wed}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  Thursday
                </StyledTableCell>
                <StyledTableCell align="left">{restaurantInfo.hours === null ? '...' : restaurantInfo.hours.thurs}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  Friday
                </StyledTableCell>
                <StyledTableCell align="left">{restaurantInfo.hours === null ? '...' : restaurantInfo.hours.fri}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  Saturday
                </StyledTableCell>
                <StyledTableCell align="left">{restaurantInfo.hours === null ? '...' : restaurantInfo.hours.sat}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  Sunday
                </StyledTableCell>
                <StyledTableCell align="left">{restaurantInfo.hours === null ? '...' : restaurantInfo.hours.sun}</StyledTableCell>
              </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
      </div>
    </div>
    <div style={{paddingTop:250}}>
      <h1>Reviews </h1>
      <div style={{ padding: 14 }} className="App">
        <Paper style={{ padding: "40px 20px" }}>
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
      </div>
    </div>
    </>
  );
}
