import { useState } from 'react';
import Button from '@material-ui/core/Button';
import ModalDialog from './ModalDialog';

const CreateAccountPage = () => {
  // declare a new state variable for modal open
  const [open, setOpen] = useState(true);

  // function to handle modal open
  const handleOpen = () => {
    setOpen(true);
  };

  // function to handle modal close
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      <ModalDialog open={open} handleClose={handleClose} />
    </div>
  );
};

export default CreateAccountPage;