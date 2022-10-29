/* eslint-disable */
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import GoogleMapReact from 'google-map-react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [userCurrPosition, setUserCurrPosition] = useState({
    latitude: 39.9,
    longitude: -75.2
  });
  const mapsApi = useRef(null);
  const mapInstance = useRef(null);
  const mapInfoWindow = useRef(null);
  const markerClusterer = useRef(null);

  const theme = useTheme();
  const { state } = useLocation();

  const locations = [
    { lat: -31.56391, lng: 147.154312, key: 'asdf0' },
    { lat: -33.718234, lng: 150.363181, key: 'asdf1' },
    { lat: -33.727111, lng: 150.371124, key: 'asdf2' },
    { lat: -33.848588, lng: 151.209834, key: 'asdf3' },
    { lat: -33.851702, lng: 151.216968, key: 'asdf4' },
    { lat: -34.671264, lng: 150.863657, key: 'asdf5' },
    { lat: -35.304724, lng: 148.662905, key: 'asdf6' },
    { lat: -36.817685, lng: 175.699196, key: 'asdf7' },
    { lat: -36.828611, lng: 175.790222, key: 'asdf8' },
    { lat: -37.75, lng: 145.116667, key: 'asdf9' },
    { lat: -37.759859, lng: 145.128708, key: 'asdf10' },
    { lat: -37.765015, lng: 145.133858, key: 'asdf11' },
    { lat: -37.770104, lng: 145.143299, key: 'asdf12' },
    { lat: -37.7737, lng: 145.145187, key: 'asdf13' },
    { lat: -37.774785, lng: 145.137978, key: 'asdf14' },
    { lat: -37.819616, lng: 144.968119, key: 'asdf15' },
    { lat: -38.330766, lng: 144.695692, key: 'asdf16' },
    { lat: -39.927193, lng: 175.053218, key: 'asdf17' },
    { lat: -41.330162, lng: 174.865694, key: 'asdf18' },
    { lat: -42.734358, lng: 147.439506, key: 'asdf19' },
    { lat: -42.734358, lng: 147.501315, key: 'asdf20' },
    { lat: -42.735258, lng: 147.438, key: 'asdf21' },
    { lat: -43.999792, lng: 170.463352, key: 'asdf22' },
  ];

  const client = axios.create({
    baseURL: "http://localhost:5000/restaurant" 
  });

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

  const fetchRestaurantList = () => {
    return client.get('/list', {
      params: {
        business_name: state.inputRestaurant,
        latitude: userCurrPosition.latitude,
        longitude: userCurrPosition.longitude,
        radius: 100000
      }
    });
  };

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
        mapInfoWindow.current.setContent(business.businessName);
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
        (async () => {
          const fetchedData = await fetchRestaurantList();
          addRestaurantMarkers(fetchedData.data.businessList);
        })()
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

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>
      
      <GoogleMapReact
        bootstrapURLKeys={{
          key: 'AIzaSyD_7nejf5R7RW9oJi55Y8Cu_LDr_picFxY',
          language: 'en', }}
        defaultZoom={10}
        defaultCenter={[userCurrPosition.latitude, userCurrPosition.longitude]}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => mapApiIsLoaded(map, maps)}
      />

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Sales" total={714000} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Users" total={1352831} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Item Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
