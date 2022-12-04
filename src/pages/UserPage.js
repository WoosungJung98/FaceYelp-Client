import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { filter } from 'lodash';
import { useState, useEffect, useMemo } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  // Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import { APIHOST } from '../config';
import { callWithToken } from '../common/helpers/utils/common';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Email', alignRight: false },
  { id: 'role', label: 'User ID', alignRight: false },
  { id: 'isVerified', label: 'Review Count', alignRight: false },
  { id: 'status', label: 'Add Friend', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fetchedUserList, setFetchedUserList] = useState([]);
  const [userListTotal, setUserListTotal] = useState(0);
  const [friendID, setFriendID] = useState([]);
  
  useEffect(() => {
    const params = {
      page: page + 1,
      length: rowsPerPage,
    };

    if(filterName.length >= 3) {
      params.user_name = filterName;
    }

    callWithToken('get', `${APIHOST}/api/user/list`, params).then((response) =>{
        setFetchedUserList(response.data.user.list);
        setUserListTotal(response.data.user.totalLength);
      })
      .catch((err) => alert(err));
  }, [filterName, page, rowsPerPage]);

  const handleOpenMenu = (event, id) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const addFriend = (event) =>{
  }

  const addUser = (event, friendid) => {
    callWithToken('post', `${APIHOST}/api/friend/send-request`, 
    {
      friend_id: friendid
    })
    .then((response) =>{ navigate(0); })
    .catch((err) => alert(err));
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userListTotal) : 0;

  // const fetchedUserList = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !userListTotal && !!filterName;

  const getAddFriendButton = (userID, friendID, isFriend, hasSentRequest) => {
    if(isFriend) {
      return (<Button variant="contained" disableFocusRipple disableRipple color="success" startIcon={<Iconify icon="material-symbols:check" />}>Friends</Button>);
    }
    if(hasSentRequest) {
      return (<Button variant="contained" disabled startIcon={<Iconify icon="material-symbols:arrow-forward-rounded" />}>Request Sent</Button>);
    }
    return (<Button variant="contained" onClick = {(event)=> addUser(event, userID)} onChange={(event) => addUser(event, friendID)} startIcon={<Iconify icon="eva:plus-fill" />}>Add Friend</Button>);
  }

  const userListTableRows = useMemo(() =>
    fetchedUserList.map((row) => {
      const id = row.userID;
      const name = row.userName;
      const role = row.userID;
      const company = row.email;
      const avatarUrl = `/assets/images/avatars/avatar_${row.avatarNum}.jpg`;
      const isVerified = row.reviewCount;
      const selectedUser = selected.indexOf(name) !== -1;

      return (
        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
          <TableCell component="th" scope="row" padding="none">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar alt={name} src={avatarUrl} sx={{ marginLeft: '15px' }} />
              <Typography variant="subtitle2" noWrap>
                {name}
              </Typography>
            </Stack>
          </TableCell>

          <TableCell align="left">{company}</TableCell>

          <TableCell align="left">{role}</TableCell>

          <TableCell align="left">{isVerified}</TableCell>

          <TableCell component="th" scope="row" padding="none">
          {getAddFriendButton(row.userID, row.friendID, row.isFriend, row.hasSentRequest)}
          </TableCell>
          
          <TableCell align="right">
            <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, id)}>
              <Iconify icon={'eva:more-vertical-fill'} />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    })
  , [fetchedUserList]);

  return (
    <>
      <Helmet>
        <title> Find Friends </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Find Friends
          </Typography>
        </Stack>
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD}
                  rowCount={userListTotal}
                />
                <TableBody>
                  {userListTableRows}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userListTotal}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
