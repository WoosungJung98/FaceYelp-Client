import PropTypes from 'prop-types';
import { set, sub } from 'date-fns';
import { noCase } from 'change-case';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime'; // import plugin
import { callWithToken } from '../../../common/helpers/utils/common';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useInterval } from '../../../hooks/useInterval';
import { APIHOST } from '../../../config';

// ----------------------------------------------------------------------
export default function NotificationsPopover() {
  const [tempNotif, setTempNotif] = useState(null);
  const [tempRestaurantName, setTempRestaurantName] = useState(null);
  const [tempTime, setTempTime] = useState(null);
  const [tempRestaurantAddress, setTempRestaurantAddress] = useState(null);
  const [open, setOpen] = useState(null);
  const [friendNotifications, setFriendNotifications] = useState([]);
  const [mealNotifications, setMealNotifications] = useState([]);
  const [openDialogue, setOpenDialogue] = useState(false);
  const [openDialogueMeal, setOpenDialogueMeal] = useState(false);
  const [tempFriendRequestID, setTempFriendRequestID] = useState(null);
  dayjs.extend(relativeTime);

  useInterval(async () => {
    callWithToken('get', `${APIHOST}/api/friend/requests`, {}).then((response) => {
      setFriendNotifications(response.data.friendRequestList.map(makeNotifs));
      function makeNotifs(obj) {
        return {
          id: obj.friendRequestID,
          title: obj.userName,
          description: "added you as a Friend!",
          avatar: `/assets/images/avatars/avatar_${obj.avatarNum}.jpg`,
          type: null,
          createdAt: dayjs(`${obj.createdAt}Z`).fromNow(),
          isUnRead: true,
          name: obj.userName,
        };
      }
    }).catch((err) => alert(err));
  }, 3000);

  useInterval(async () => {
    callWithToken('get', `${APIHOST}/api/meal/requests`, {}).then((response) => {
      setMealNotifications(response.data.mealRequestList.map(makeNotifs));
      function makeNotifs(obj) {
        return {
          id: obj.mealRequestID,
          title: obj.userName,
          description: "wants to grab a meal with you!",
          avatar: `/assets/images/avatars/avatar_${obj.avatarNum}.jpg`,
          type: null,
          createdAt: dayjs(`${obj.createdAt}Z`).fromNow(),
          isUnRead: true,
          name: obj.userName,
          mealAt: dayjs(`${obj.mealAt}Z`).format('MMM D, YYYY h:mm A'),
          restaurantName: obj.restaurantName,
          restaurantAddress: obj.restaurantAddress
        };
      }
    }).catch((err) => alert(err));
  }, 3000);

  const navigate = useNavigate();
  const handleClickOpen = (notification) => {
    setTempNotif(notification.name);
    setTempFriendRequestID(notification.id);
    setOpenDialogue(true);
  };
  const handleClickOpenMeal = (notification) => {
    setTempRestaurantName(notification.restaurantName);
    setTempTime(notification.mealAt);
    setTempRestaurantAddress(notification.restaurantAddress);
    setTempNotif(notification.name);
    setTempFriendRequestID(notification.id);
    setOpenDialogueMeal(true);
  };
  const handleCloseMeal = (notification) => {
    setTempNotif(notification.name);
    setTempFriendRequestID(notification.id);
    setOpenDialogueMeal(false);
  };
  const handleConfirm = () =>{
    callWithToken('post', `${APIHOST}/api/friend/accept-request`, {friend_request_id: tempFriendRequestID}).then((response) => {
    alert("Succesfully accepted friend request")
    handleClose()
    navigate(0);
    }).catch((err) => {alert(err); handleClose()})
  }

  const handleIgnore = () =>{
    callWithToken('post', `${APIHOST}/api/friend/ignore-request`, {friend_request_id: tempFriendRequestID}).then((response) => {
      alert("Succesfully ignored friend request")
      handleClose()
      navigate(0);
      }).catch((err) => {alert(err); handleClose()})
  }

  const handleConfirmMeal = () =>{
    callWithToken('post', `${APIHOST}/api/meal/accept-request`, {meal_request_id: tempFriendRequestID}).then((response) => {
    alert("Succesfully accepted meal request")
    handleClose()
    navigate(0);
    }).catch((err) => {alert(err); handleClose()})
  }

  const handleIgnoreMeal = () =>{
    callWithToken('post', `${APIHOST}/api/meal/ignore-request`, {meal_request_id: tempFriendRequestID}).then((response) => {
      alert("Succesfully ignored meal request")
      handleClose()
      navigate(0);
      }).catch((err) => {alert(err); handleClose()})
  }

  const handleClose = () => {
    setOpenDialogue(false);
  };

  const totalUnRead = friendNotifications.filter((item) => item.isUnRead === true).length + mealNotifications.filter((item) => item.isUnRead === true).length;

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClosePop = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setFriendNotifications(
      friendNotifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
    setMealNotifications(
      mealNotifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };


  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClosePop}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New Meal Requests
              </ListSubheader>}
            
          >
            {mealNotifications.map((notification) => (
            <Box>
              <ListItemButton onClick={()=>handleClickOpenMeal(notification)}>
              <NotificationItem key={notification.id} notification={notification} />
              </ListItemButton>
              <Dialog
                open={openDialogueMeal}
                onClose={handleCloseMeal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {`Do you want to grab a meal with ${tempNotif}?`}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {tempNotif} wants to grab a meal with you at {tempRestaurantName}: <br />
                    Location: {tempRestaurantAddress} <br />
                    Time: {tempTime} 
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleIgnoreMeal}>Ignore</Button>
                  <Button onClick={handleConfirmMeal} autoFocus>
                    Confirm
                  </Button>
                </DialogActions>
            </Dialog>
              </Box>))}
              <Divider sx={{ borderStyle: 'dashed' }} />
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New Friend Requests
              </ListSubheader>
            
            
            {friendNotifications.map((notification) => (
            <Box>
              <ListItemButton onClick={()=>handleClickOpen(notification)}>
              <NotificationItem key={notification.id} notification={notification}/>
              </ListItemButton>
            
      <Dialog
        open={openDialogue}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Do you want to add ${tempNotif} as a friend?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let {tempNotif} be your friend on FaceYelp and allow them to request 
            meals to you. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIgnore}>Ignore</Button>
          <Button onClick={handleConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
              </Box>
            ))}
          </List>

          
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {notification.createdAt}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.description)}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_package.svg" />,
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_shipping.svg" />,
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
      title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}
