import axios from 'axios';
import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
// components
import Iconify from '../components/iconify';
import { APIHOST } from '../config';
import './CreateAccountForm.css';

// ----------------------------------------------------------------------

export default function CreateAccountForm() {
  const userName = useRef("");
  const inputEmail = useRef("");
  const [inputPassword, setInputPassword] = useState("");
  const confirmPassword = useRef("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const selectedAvatarTarget = useRef(null);
  const selectedAvatarNum = useRef(null);

  const navigate = useNavigate();
  
  const handleSubmit = () => {
    if(userName.current.length < 3) {
      alert("Name must be at least 3 characters in length.");
      return;
    }
    if(inputEmail.current.length < 3) {
      alert("Email is invalid.");
      return;
    }
    if(inputPassword.length < 8) {
      alert("Password must be at least 8 characters in length.");
      return;
    }
    if(inputPassword !== confirmPassword.current) {
      alert("Password does not match confirmation.");
      return;
    }
    if(selectedAvatarNum.current === null) {
      alert("Please select an avatar.");
      return;
    }
    axios.post(`${APIHOST}/api/user/create`, {
      email: inputEmail.current,
      password: inputPassword,
      password_confirm: confirmPassword.current,
      user_name: userName.current,
      avatar_num: selectedAvatarNum.current
    }).then(() => {
      navigate('/login', { replace: true });
    }).catch((err) => {
      if([409, 422].includes(err.response.status)) alert(err.response.data.msg);
      else alert(err);
    });
  };

  const handleAvatarMouseEnter = (event) => {
    event.currentTarget.classList.add('avatar-hovered');
  };

  const handleAvatarMouseLeave = (event) => {
    event.currentTarget.classList.remove('avatar-hovered');
  };

  const handleAvatarClick = (event, idx) => {
    if(selectedAvatarTarget.current !== null) {
      selectedAvatarTarget.current.classList.remove('avatar-clicked');
    }
    event.currentTarget.classList.add('avatar-clicked');
    selectedAvatarTarget.current = event.currentTarget;
    selectedAvatarNum.current = idx;
  };

  const avatarImageListItems = useMemo(() => {
    const avatarIdxList = [...Array(24).keys()];
    return avatarIdxList.map((idx) => {
      const imgURL = `/assets/images/avatars/avatar_${idx + 1}.jpg`;
      return (
        <ImageListItem
          key={idx}
          onMouseEnter={handleAvatarMouseEnter}
          onMouseLeave={handleAvatarMouseLeave}
          onClick={(e) => handleAvatarClick(e, idx + 1)}
        >
          <img
            src={`${imgURL}?w=248&fit=crop&auto=format`}
            srcSet={`${imgURL}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt="unavailable"
            loading="lazy"
          />
        </ImageListItem>
      );
    });
  }, []);

  const confirmPasswordInput = useMemo(() => {
    if(inputPassword.length < 8) {
      confirmPassword.current = "";
      return null;
    }
    return (
      <TextField
        name="confirm-password"
        label="Confirm Password"
        onChange={(e) => {confirmPassword.current = e.target.value}}
        type={showConfirmPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  }, [inputPassword, showConfirmPassword]);

  return (
    <>
      <Stack spacing={3}>
        <TextField name="user-name" label="Name" onChange={(e) => {userName.current = e.target.value}} />
        <TextField name="email" label="Email address" onChange={(e) => {inputEmail.current = e.target.value}} />
        <TextField
          name="password"
          label="Password"
          onChange={(e) => setInputPassword(e.target.value)}
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
        {confirmPasswordInput}
      </Stack>      

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 2,
          m: 1,
          bgcolor: '#F9FAFB',
        }}
      >
        <ImageList variant="quilted" cols={5} gap={8} sx={{ width: '100%', height: 170}}>
          {avatarImageListItems}
        </ImageList>
      </Box>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
        Sign Up
      </LoadingButton>
    </>
  );
}
