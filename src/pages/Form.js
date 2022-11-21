import axios from 'axios';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import { HOSTNAME, APIHOST } from '../config';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),

    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '300px',
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
}));

const Form = ({ handleClose }) => {
  const classes = useStyles();
  //  create state variables for each input
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  
  const verifyEmail = e =>{
    axios.get(`${APIHOST}/api/user/verify-email`, {
      params: {
        "email": email
      }
    }).then((response) => {
      alert(response.data.msg); 
    }).catch((err) => alert("Email address is already used"));
  }
  const handleSubmit = e => {
    // username must be 3 characters
    e.preventDefault();
    let error = "";
    if (firstName.trim().length < 3 || lastName.trim().length < 3){
      error += "First and Last name should be 3 characters or more\n";
    }
    if (!regex.test(email)){
      error += "Invalid email address\n";
    }
    if (password !== confirmPassword){
      error+= "Password and Confirm Password do not match\n";
    }
    if (password.toLowerCase() === password){
      error += "Password must have at least one Uppercase Letter\n";
    }
    if (password.length < 8){
      error += "Password must be 8 characters or longer\n";
    }
    if (error.length > 1){
    alert(error);
    }
    else{
    //  API call with all of the inputs.
    const userName = `${firstName.trim()} ${lastName.trim()}`;
    axios.post(`${APIHOST}/api/user/create`, {
      "email": email,
      "password": password,
      "password_confirm": confirmPassword,
      "user_name": userName
    })
    .then((response)=> {
      handleClose();
      navigate('/login', { replace: true});
      alert("Account Succesfully Created! Please log-in!")
    })
    .catch((error) => {
      alert(error);
    });
    
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField
        label="First Name"
        variant="filled"
        required
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />
      <TextField
        label="Last Name"
        variant="filled"
        required
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      />
      <TextField
        label="Email"
        variant="filled"
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Button variant="contained" onClick={verifyEmail}>
          Verify Email
        </Button>
      <TextField
        label="Password"
        variant="filled"
        type="password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <TextField
        label="Confirm Password"
        variant="filled"
        type="password"
        required
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <div>
        <Button variant="contained" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Signup
        </Button>
      </div>
    </form>
  );
};

export default Form;