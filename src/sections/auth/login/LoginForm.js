import axios from 'axios';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { setCookie } from '../../../common/helpers/api/session';
import { APIHOST } from '../../../config';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const inputEmail = useRef("");
  const inputPassword = useRef("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  
  const handleSubmit = () => {
    if(inputEmail.current.length < 3) {
      alert("Email is invalid.");
      return;
    }
    if(inputPassword.current.length < 8) {
      alert("Password is invalid.");
      return;
    }
    console.log(inputEmail.current);
    console.log(inputPassword.current);
    axios.post(`${APIHOST}/api/user/login`, {
      email: inputEmail.current,
      password: inputPassword.current
    }).then((response) => {
      setCookie("accessToken", response.data.accessToken);
      setCookie("refreshToken", response.data.refreshToken);
      navigate('/', { replace: true });
    }).catch((err) => {
      console.log(err)
      if(err.response.status === 401) alert(err.response.data.msg);
      else alert(err);
    });
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={(e) => {inputEmail.current = e.target.value}} />
        <TextField
          name="password"
          label="Password"
          onChange={(e) => {inputPassword.current = e.target.value}}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" sx={{ my: 3 }} onClick={handleSubmit}>
        Login
      </LoadingButton>
    </>
  );
}
