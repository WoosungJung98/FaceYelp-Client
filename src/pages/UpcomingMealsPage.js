import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { callWithToken } from '../common/helpers/utils/common';
import { APIHOST } from '../config';

export default function UpcomingMealsPage() {
    const [meals, setMeals] = React.useState([]);
    React.useEffect(() => {
        callWithToken('get', `${APIHOST}/api/meal/list`, {}).then((response) => {
            setMeals(response.data.mealList);
          }).catch((err) => alert(err));
    }, [])
  return (
    <div style={{ height: 500, width: '80%', marginLeft: 'auto', marginRight:'auto', marginTop: 'auto', marginBottom: 'auto' }}>
      <DataGrid
        rows={meals}
        columns={columns}
        //  experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
}

const columns = [
  { field: 'friendName', headerName: 'Name', width: 220, editable: false },
  {
    field: 'mealAt',
    headerName: 'Time',
    width: 180,
    editable: false,
  },
  {
    field: 'restaurantName',
    headerName: 'Restaurant Name',
    width: 220,
    editable: false,
  },
  {
    field:'address',
    headerName: 'Restaurant Address',
    width: 250,
    editable: false
  }
];
