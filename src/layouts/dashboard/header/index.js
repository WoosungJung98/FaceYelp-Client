import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import { HOSTNAME } from '../../../config';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const [open, setOpen] = useState(false);
  const [restaurantList, setRestaurantList] = useState([]);

  const getSearchSuggestListItems = () => {
    if(!open) return null;
    return restaurantList.map(item => (
      <ListItem disablePadding key={item.businessID}>
        <ListItemButton onClick={()=>{window.open(`${HOSTNAME}/restaurant/${item.businessID}`, '_blank');}}>
        <ListItemText primary={item.businessName} secondary={item.address} />
          <ListItemText primary={`${(item.distance * 0.000621371).toFixed(1)} mi`} />
        </ListItemButton>
      </ListItem>
    ));
  };

  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Searchbar open={open} setOpen={setOpen} setRestaurantList={setRestaurantList}/>
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <LanguagePopover />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
      <Box sx={{ width: '100%', maxWidth: 500, color: '#5A5A5A'}}>
        <List>
          {getSearchSuggestListItems()}
        </List>
      </Box>
    </StyledRoot>
  );
}
