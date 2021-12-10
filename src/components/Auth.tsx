import React, { useState } from 'react';

//material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, Modal } from '@mui/material';

import styled from 'styled-components';

import { auth, provider, storage } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from 'firebase/auth';

const theme = createTheme();

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const signUp = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail('');
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail('');
      });
  };

  const signInGoogle = async () => {
    await signInWithPopup(auth, provider).catch((err) => alert(err.message));
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {isLogin ? 'ログイン' : '新規登録'}
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={
                  isLogin
                    ? async () => {
                        try {
                          await signIn();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                    : async () => {
                        try {
                          await signUp();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                }
              >
                {isLogin ? 'ログインする' : '新規登録'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link onClick={() => setOpenModal(true)}>
                    {isLogin && 'パスワードを忘れた'}
                  </Link>
                </Grid>
                <Grid item>
                  <Link onClick={() => setIsLogin(!isLogin)}>
                    {!isLogin ? 'ログインする' : '新規登録'}
                  </Link>
                </Grid>
              </Grid>

              <IconButton>
                <GoogleIcon onClick={signInGoogle} />
              </IconButton>
            </Box>
          </Box>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <SMDiv style={getModalStyle()}>
              <div>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  type="email"
                  name="email"
                  label="Reset E-mail"
                  value={resetEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setResetEmail(e.target.value);
                  }}
                />
                <IconButton onClick={sendResetEmail}>
                  <SendIcon />
                </IconButton>
              </div>
            </SMDiv>
          </Modal>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

const SMDiv = styled.div`
  outline: none;
  position: absolute;
  width: 500px;
  border-radius: 10;
  background-color: #fff;
  box-shadow: 0 0 10px #8f8b8b;
  padding: 100px;
`;
