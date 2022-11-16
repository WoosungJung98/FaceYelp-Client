import axios from 'axios';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { setCookie } from '../../../common/helpers/api/session';
import { APIHOST } from '../../../config';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const inputEmail = useRef("");
  const inputPassword = useRef("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    console.log(inputEmail.current.current);
    console.log(inputPassword); 
    axios.post(`${APIHOST}/api/user/login`, {
      email: inputEmail.current,
      password: inputPassword.current
    }).then((response) => {
      console.log(response.data.accessToken);
      setCookie("accessToken", response.data.accessToken);
      setCookie("refreshToken", response.data.refreshToken);
      navigate('/dashboard', { replace: true });
    }).catch((err) => console.log(err));
  };

  function emailOnChange(input) {
    inputEmail.current = input;
  }

  function passwordOnChange(input){
    inputPassword.current = input;
  }
  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={(event) => emailOnChange(event.target.value)} />
        <TextField
          name="password"
          label="Password"
          onChange={(event) => passwordOnChange(event.target.value)}
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
