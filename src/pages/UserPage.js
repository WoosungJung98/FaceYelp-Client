import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
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
  Checkbox,
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
import { callWithToken } from '../common/helpers/utils/common';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import { APIHOST } from '../config'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'edit' },
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
  const [open, setOpen] = useState(null);

  const [myPage, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [fetchedUserList, setFetchedUserList] = useState(null);

  const [orderint, setOrderInt] = useState(1);

  useEffect(() => {
  async function fetchData() { 
    axios.get(`${APIHOST}/api/user/list`,
    {params: {
      page: myPage,
      length: rowsPerPage,
      user_name: null,
      order_column: "user_name",
      order_desc: orderint
      }
    }).then((response) =>{setFetchedUserList(response.data)}) 
    .catch((err) => alert(err))
    }
    fetchData();
    }, [myPage, orderint])

    useEffect(() => {
      async function fetchData() { 
        axios.get(`${APIHOST}/api/user/list`,
        {params: {
          page: myPage + 1,
          length: rowsPerPage,
          user_name: (filterName === null || filterName.length < 3 ? null : filterName),
          order_column: "user_name",
          order_desc: 1
          }
        }).then((response) =>{setFetchedUserList(response.data)}) 
        .catch((err) => alert(err))
        }
        fetchData();
        }, [filterName])
    
    
    const handleOpenMenu = (event) => {
      setOpen(event.currentTarget);
    };  

  const renderedUserList = useMemo(() => {
    if (fetchedUserList === null){
      return null
    };
    return fetchedUserList.user.list.map((row) => { 
      const name = row.userName;
      return (
        <TableRow hover key={row.email} tabIndex={-1} role="checkbox" selected={selected.indexOf(name) !== -1}>
          <TableCell component="th" scope="row" padding="none">
          <Button variant="contained" onClick = {(event)=>  addUser(event, row.userID)} onChange={(event) => addUser(event, row.friendID)} startIcon={<Iconify icon="eva:plus-fill" />}>Add User</Button>
          </TableCell>
          <TableCell component="th" scope="row" padding="none">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar alt={row.userName} src={row.profilePhoto} />
              <Typography variant="subtitle2" noWrap>
                {row.userName}
              </Typography>
            </Stack>
          </TableCell>
          <TableCell align="left">{row.createdAt}</TableCell>
          <TableCell align="left">{row.reviewCount}</TableCell>

          {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}

          <TableCell align="left" />
          <TableCell align="right">
            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
              <Iconify icon={'eva:more-vertical-fill'} />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    })}, [fetchedUserList])

  

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    if (isAsc){
      setOrderInt(0);
    } else{
      setOrderInt(1);
  }};

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(myPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);

  };



  const addUser = (event, friendid) => {
    callWithToken('post', `${APIHOST}/api/friend/add`, 
    {
      friend_id: friendid
    })
    .then((response) =>{alert(response.data.msg)})
    .catch((err) => alert(err))
    
  
  }

  const emptyRows = myPage > 0 ? Math.max(0, (1 + myPage) * rowsPerPage - fetchedUserList.user.list.totalLength) : 0;
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {renderedUserList}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>

                {(
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={5} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        
                          />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={fetchedUserList === null ? 20 : fetchedUserList.totalLength}
            rowsPerPage={rowsPerPage}
            page={myPage + 1}
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
