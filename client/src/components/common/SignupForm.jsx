import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import userApi from '../../api/modules/user.api';
import { setUser } from '../../app/features/userSlice';
import { setAuthModalOpen } from '../../app/features/authModalSlice';
import { toast } from 'react-toastify';
import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const SignupForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();
  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const signinForm = useFormik({
    initialValues: {
      password: '',
      username: '',
      displayName: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, 'Le nom doit faire au moins 8 caractères')
        .required('Le nom est requis'),
      password: Yup.string()
        .min(8, 'Le mot de passe doit faire au moins 8 caractères')
        .required('Le mot de passe est requis'),
      displayName: Yup.string()
        .min(8, 'Le pseudonyme doit faire au moins 8 caractères')
        .required('Le pseudonyme est requis'),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref('confirmPassword')],
          'La confirmation du nouveau mot de passe ne correspond pas'
        )
        .min(
          8,
          'La confirmation du mot de passe doit faire au moins 8 caractères'
        )
        .required('La confirmation du mot de passe est requise'),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      const { response, error } = await userApi.signup(values);
      setIsLoginRequest(false);

      if (response) {
        signinForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success('Inscription réussie');
      }
      if (error) setErrorMessage(error.message);
    },
  });

  return (
    <Box component="form" onSubmit={signinForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="text"
          placeholder="Nom"
          name="username"
          fullWidth
          value={signinForm.values.username}
          onChange={signinForm.handleChange}
          color="success"
          error={
            signinForm.touched.username &&
            signinForm.errors.username !== undefined
          }
          helperText={signinForm.touched.username && signinForm.errors.username}
        />
        <TextField
          type="text"
          placeholder="Pseudonyme"
          name="displayName"
          fullWidth
          value={signinForm.values.displayName}
          onChange={signinForm.handleChange}
          color="success"
          error={
            signinForm.touched.displayName &&
            signinForm.errors.displayName !== undefined
          }
          helperText={
            signinForm.touched.displayName && signinForm.errors.displayName
          }
        />
        <TextField
          type="password"
          placeholder="Mot de passe"
          name="password"
          fullWidth
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
          color="success"
          error={
            signinForm.touched.password &&
            signinForm.errors.password !== undefined
          }
          helperText={signinForm.touched.password && signinForm.errors.password}
        />
        <TextField
          type="password"
          placeholder="Confirmez le mot de passe"
          name="confirmPassword"
          fullWidth
          value={signinForm.values.confirmPassword}
          onChange={signinForm.handleChange}
          color="success"
          error={
            signinForm.touched.confirmPassword &&
            signinForm.errors.confirmPassword !== undefined
          }
          helperText={
            signinForm.touched.confirmPassword &&
            signinForm.errors.confirmPassword
          }
        />
      </Stack>
      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
      >
        inscription
      </LoadingButton>
      <Button fullWidth sx={{ marginTop: 1 }} onClick={() => switchAuthState()}>
        connexion
      </Button>
      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined">
            {errorMessage}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default SignupForm;
