import axios from 'axios';
import { useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Input, Slide, Button, IconButton, InputAdornment, ClickAwayListener } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// component
import Iconify from '../../../components/iconify';

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

export default function Searchbar({ userCurrPosition, setRestaurantList }) {
  const client = axios.create({
    baseURL: "http://localhost:5000/restaurant" 
  });

  const [open, setOpen] = useState(false);
  const [inputRestaurant, setInputRestaurant] = useState('');

  useEffect(() => {
    async function fetchRestaurantList() {
      const response = await client.get('/list', {
        params: {
          business_name: inputRestaurant,
          latitude: userCurrPosition.latitude,
          longitude: userCurrPosition.longitude,
          radius: 10000,
          length: 8
        }
      });
      setRestaurantList(response.data.businessList);
    }
    if(inputRestaurant.length >= 3) {
      fetchRestaurantList();
    }
    else {
      setRestaurantList([]);
    }
  }, [inputRestaurant, userCurrPosition]);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setRestaurantList([]);
    setOpen(false);
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
              placeholder="Search…"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
              onChange={(e) => setInputRestaurant(e.target.value)}
            />
            <Button variant="contained" onClick={handleClose}>
              Search
            </Button>
          </StyledSearchbar>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
