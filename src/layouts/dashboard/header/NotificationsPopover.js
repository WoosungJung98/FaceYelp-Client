import PropTypes from 'prop-types';
import { set, sub } from 'date-fns';
import { noCase } from 'change-case';
import { faker } from '@faker-js/faker';
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
import { callWithToken } from '../../../common/helpers/utils/common'
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
const [rerender, setRerender] = useState(false);

useInterval(async () => {

  callWithToken('get', `${APIHOST}/api/friend/requests`, {}).then((response) => {

    setNotifications(response.data.friendRequestList.map(makeNotifs));
    function makeNotifs(obj) {
    return {
    id: obj.friendRequestID,
    title: `${obj.userName} added you as a Friend!`,
    description: `${obj.timeDiff} minutes ago`,
    avatar: null,
    type: null,
    createdAt: null,
    isUnRead: true,
    name: obj.userName
  }
}
  }).catch((err) => alert(err));
}, 3000)

  const [openDialogue, setOpenDialogue] = useState(false);
  const [tempFriendRequestID, setTempFriendRequestID] = useState(null);
  const navigate = useNavigate();
  const handleClickOpen = (notification) => {
    setTempNotif(notification.name);
    setTempFriendRequestID(notification.id);
    setOpenDialogue(true);
  };
  const handleConfirm = () =>{
    callWithToken('post', `${APIHOST}/api/friend/accept-request`, {friend_request_id: tempFriendRequestID}).then((response) => {
    alert("Succesfully accepted friend request")
    handleClose()
    navigate('/', { replace: true});
    }).catch((err) => {alert(err); handleClose()})

  }
  const handleIgnore = () =>{
    callWithToken('post', `${APIHOST}/api/friend/ignore-request`, {friend_request_id: tempFriendRequestID}).then((response) => {
      alert("Succesfully accepted friend request")
      handleClose()
      navigate('/', { replace: true});
      }).catch((err) => {alert(err); handleClose()})
    
    //  axios call to the api with tempFriendRequestID
  }
  const handleClose = () => {
    setOpenDialogue(false);
  };

  const [notifications, setNotifications] = useState([]);
  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClosePop = () => {
    setOpen(null);
  };


  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
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
                New
              </ListSubheader>}
            
          >
            {notifications.map((notification) => (
            <Box>
              <ListItemButton onClick={()=>handleClickOpen(notification)}>
              <NotificationItem key={notification.id} notification={notification} />
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

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map((notification) => (
              <ListItemButton >
              <NotificationItem key={notification.id} notification={notification} />
              
              </ListItemButton>
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
            {fToNow(notification.createdAt)}
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
