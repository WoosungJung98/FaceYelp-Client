import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Grid} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
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
import ReactDOM from "react-dom";
import { Divider, Avatar} from "@material-ui/core";

// ----------------------------------------------------------------------

export default function BlogPage() {
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

  const client = axios.create({
    baseURL: "https://faceyelp.com/api/restaurant"
  });

  useEffect(() => {
    async function fetchRestaurantInfo() {
      const response = await client.get('/sCPx4Sy4I1wMeZwsTzCFRg/info', {});
      if('businessInfo' in response.data) {
        response.data.businessInfo.hours = objectMap(response.data.businessInfo.hours, hourMapFn);
        setRestaurantInfo(response.data.businessInfo);
      }
    }
    fetchRestaurantInfo();
  }, []);

// returns a new object with the values at each key mapped using mapFn(value)
const objectMap = (object, mapFn) => {
  return Object.keys(object).reduce((result, key) => {

    result[key] = mapFn(object[key])
    return result
  }, {})
}

const hourMapFn = (value) => {
  // console.log(value);
  let open = value?.split("-")[0]?.split(":");
  // console.log(open);
  let close = value?.split("-")[1]?.split(":");
  // console.log(close);
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
  return [open, close].join("-")
}

const location = 	
{ lat: restaurantInfo.latitude, lng: restaurantInfo.longitude}

const mapApiIsLoaded = (map, maps) => {
  new maps.Marker({
    position: location,
    map,
    title: "Hello World!",
  });
}
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

const imgLink = "https://www.chipotle.com/content/dam/chipotle/global/menu/meal-types/cmg-10001-burrito/web-desktop/lifestyle.jpg"

const itemData = [
{
  img: 'https://www.chipotle.com/content/dam/chipotle/global/menu/meal-types/cmg-10001-burrito/web-desktop/lifestyle.jpg',
  title: 'burrito',
  author: '@jesiccaromero',
},
{
  img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
  title: 'Coffee',
  author: '@nolanissac',
  cols: 2,
},
{
  img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
  title: 'Hats',
  author: '@hjrc33',
  cols: 2,
},
{
  img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
  title: 'Honey',
  author: '@arwinneil',
  rows: 2,
  cols: 2,
  featured: true,
},
{
  img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
  title: 'Basketball',
  author: '@tjdragotta',
},
{
  img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
  title: 'Fern',
  author: '@katie_wasserman',
},
{
  img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
  title: 'Mushrooms',
  author: '@silverdalex',
  rows: 2,
  cols: 2,
},
{
  img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
  title: 'Tomato basil',
  author: '@shelleypauls',
},
{
  img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
  title: 'Sea star',
  author: '@peterlaster',
},
{
  img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
  title: 'Bike',
  author: '@southside_customs',
  cols: 2,
},
];

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
      restaurantInfo.categories.map((categories) => (
        <div style={{padding:"2px", float:"left"}}>
          <Chip label={categories} />
        </div>
        )
      ) 
    }

    </div>
      <Rating name="read-only" value={restaurantInfo.stars} readOnly />
    <div style={{width:"100%", float:"left", paddingLeft: "5px", paddingTop:"10px"}}>
    
    Open: Closes at 10pm

    </div>

    <div style={{}} >
    <ImageList sx={{ width: 1100, height: 370, margin:"auto"}}>
      <ImageListItem key="Subheader" cols={2}>
        <h1>Images</h1>
      </ImageListItem>
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img
            src={`${item.img}?w=248&fit=crop&auto=format`}
            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.title}
            subtitle={item.author}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`info about ${item.title}`}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
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
            <Avatar alt="Remy Sharp" src={imgLink} />
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
            <Avatar alt="Remy Sharp" src={imgLink} />
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
            <Avatar alt="Remy Sharp" src={imgLink} />
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
