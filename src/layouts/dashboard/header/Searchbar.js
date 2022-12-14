import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Input, Slide, Button, IconButton, InputAdornment, ClickAwayListener } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// component
import Iconify from '../../../components/iconify';
import { APIHOST } from '../../../config';

// ----------------------------------------------------------------------

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledSearchbar = styled('div')(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Searchbar.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  setRestaurantList: PropTypes.func
};

export default function Searchbar({ open, setOpen, setRestaurantList }) {
  const [inputRestaurant, setInputRestaurant] = useState('');
  const [userCurrPosition, setUserCurrPosition] = useState({
    latitude: 39.9,
    longitude: -75.2
  });

  const navigate = useNavigate();

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((pos) => {
  //     if(pos !== undefined) {
  //       setUserCurrPosition({
  //         latitude: pos.coords.latitude,
  //         longitude: pos.coords.longitude
  //       });
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if(inputRestaurant.length < 3) {
      setRestaurantList([]);
      return;
    }
    axios.get(`${APIHOST}/api/restaurant/list`, {
      params: {
        business_name: inputRestaurant,
        latitude: userCurrPosition.latitude,
        longitude: userCurrPosition.longitude,
        radius: 10000,
        length: 8
      }
    }).then((response) =>
      setRestaurantList(response.data.businessList)
    ).catch((err) => alert(err));
  }, [inputRestaurant, userCurrPosition, setRestaurantList]);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    const navState = {inputRestaurant};
    setOpen(false);
    navigate('/dashboard/app', { replace: true, state: navState });
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!open && (
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" />
          </IconButton>
        )}
        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Search Restaurant???"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
              value={inputRestaurant}
              onChange={(e) => setInputRestaurant(e.target.value.replace(/^\s+/,""))}
              onKeyPress={(e) => {
                if(e.key === "Enter") {
                  handleSearch();
                  e.preventDefault();
                }
              }}
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </StyledSearchbar>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
