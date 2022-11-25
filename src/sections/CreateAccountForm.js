import axios from 'axios';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../components/iconify';
import { setCookie } from '../common/helpers/api/session';
import { APIHOST } from '../config';

// ----------------------------------------------------------------------

export default function CreateAccountForm() {
  const inputEmail = useRef("");
  const inputPassword = useRef("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  
  const handleClick = () => {
    axios.post(`${APIHOST}/api/user/login`, {
      email: inputEmail.current,
      password: inputPassword.current
    }).then((response) => {
      setCookie("accessToken", response.data.accessToken);
      setCookie("refreshToken", response.data.refreshToken);
      navigate('/', { replace: true });
    }).catch((err) => alert(err));
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

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
