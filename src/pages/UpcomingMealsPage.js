import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import * as dayjs from 'dayjs';
import { callWithToken } from '../common/helpers/utils/common';
import { APIHOST } from '../config';

export default function UpcomingMealsPage() {
    const [meals, setMeals] = React.useState([]);
    React.useEffect(() => {
        callWithToken('get', `${APIHOST}/api/meal/list`, {}).then((response) => {
            setMeals(response.data.mealList.map(e => ({
                id: e.mealID,
                avatarNum: e.avatarNum,
                friendName: e.friendName,
                mealAt: dayjs(`${e.mealAt}Z`).format('MMM D, YYYY h:mm A'),
                restaurantAddress: e.restaurantAddress,
                restaurantName: e.restaurantName
            })));
        }).catch((err) => alert(err));
    }, [])
  return (
    <div style={{ height: 500, width: '80%', marginLeft: 'auto', marginRight:'auto', marginTop: 'auto', marginBottom: 'auto' }}>
      <DataGrid
        rows={meals}
        columns={columns}
        disableColumnFilter
      />
    </div>
  );
}

const columns = [
  { field: 'friendName', headerName: 'Name', width: 220, editable: false, sortable: false },
  {
    field: 'mealAt',
    headerName: 'Time',
    width: 180,
    editable: false,
    sortable: false
  },
  {
    field: 'restaurantName',
    headerName: 'Restaurant Name',
    width: 220,
    editable: false,
    sortable: false
  },
  {
    field:'restaurantAddress',
    headerName: 'Restaurant Address',
    width: 250,
    editable: false,
    sortable: false
  }
];
