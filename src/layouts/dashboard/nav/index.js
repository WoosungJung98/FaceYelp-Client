import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Input, InputAdornment, Box, Link, Button, Drawer, Typography, Avatar, Stack, ClickAwayListener, IconButton, Slide} from '@mui/material';
import Iconify from '../../../components/iconify';
import { getCookie } from '../../../common/helpers/api/session';
import { callWithToken } from '../../../common/helpers/utils/common';
import { HOSTNAME, APIHOST } from '../../../config';
// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import Searchbar from '../header/Searchbar';
import { bgBlur } from '../../../utils/cssStyles';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const navigate = useNavigate();
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
  
  const NAV_WIDTH = 280;
  
  const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    backgroundColor: alpha(theme.palette.grey[500], 0.12),
  }));
  const accessToken = getCookie("accessToken");
  const [username, setUsername] = useState(null);
  const [navConfig, setNavConfig] = useState([]);
  const [friend, setInputFriend] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() =>{
  if(accessToken !== undefined){
    callWithToken('get', `${APIHOST}/api/friend/list`, {})
    .then((response)=>{
      setNavConfig(response.data.friendList);
    })
  }}
, []);

const handleOpen = () => {
  setOpen(!open);
};

const handleClose = () => {
  setOpen(false);
};
const handleSearch = () => {
  const navState = {friend};
  setOpen(false);
  navigate('/dashboard/app', { replace: true, state: navState });
};


  useEffect(() => {
    if (accessToken !== undefined){
    callWithToken('get', `${APIHOST}/api/user/info`, {})
    .then((response) => {
      setUsername(response.data.userName);
      if(accessToken !== undefined){
        callWithToken('get', `${APIHOST}/api/friend/list`, {})
        .then((response)=>{
          setNavConfig(response.data.friendList);
    })}
  })

  }}, [accessToken])

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={account.photoURL} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {username}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account.role}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>
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
              placeholder="Search Friends"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
              value={friend}
              onChange={(e) => setInputFriend(e.target.value)}
              onKeyPress={(e) => {
                if(e.key === "Enter") {
                  handleSearch();
                  e.preventDefault();
                }
              }}
            />
            {/* <Button variant="contained" onClick={handleSearch}>
              Search
            </Button> */}
          </StyledSearchbar>
        </Slide>
      </div>
    </ClickAwayListener>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
