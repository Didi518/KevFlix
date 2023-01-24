import { LoadingButton } from '@mui/lab';
import { Box, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import userApi from '../api/modules/user.api';
import { setAuthModalOpen } from '../app/features/authModalSlice';
import { setUser } from '../app/features/userSlice';
import Container from '../components/common/Container';
import uiConfigs from '../configs/ui.configs';

const PasswordUpdate = () => {
  const [onRequest, setOnRequest] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Le mot de passe doit faire au moins 8 caractères')
        .required('Le mot de passe est requis'),
      newPassword: Yup.string()
        .min(8, 'Le nouveau mot de passe doit comporter au moins 8 caractères')
        .required('Le nouveau mot de passe est requis'),
      confirmNewPassword: Yup.string()
        .oneOf(
          [Yup.ref('newPassword')],
          'La confirmation du nouveau mot de passe ne correspond pas'
        )
        .min(
          8,
          'La confirmation du nouveau mot de passe doit comporter au moins 8 caractères'
        )
        .required('La confirmation du nouveau mot de passe est requise'),
    }),
    onSubmit: async (values) => onUpdate(values),
  });

  const onUpdate = async (values) => {
    if (onRequest) return;
    setOnRequest(true);

    const { response, error } = await userApi.passwordUpdate(values);

    setOnRequest(false);
    if (error) toast.error(error.message);
    if (response) {
      form.resetForm();
      navigate('/');
      dispatch(setUser(null));
      dispatch(setAuthModalOpen(true));
      toast.success('Mot de passe mis à jour. Merci de vous reconnecter');
    }
  };

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header="mise à jour du mot de passe">
        <Box component="form" maxWidth="400px" onSubmit={form.handleSubmit}>
          <Stack spacing={2}>
            <TextField
              type="password"
              placeholder="Mot de passe"
              name="password"
              fullWidth
              value={form.values.password}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.password && form.errors.password !== undefined
              }
              helperText={form.touched.password && form.errors.password}
            />
            <TextField
              type="password"
              placeholder="Nouveau mot de passe"
              name="newPassword"
              fullWidth
              value={form.values.newPassword}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.newPassword &&
                form.errors.newPassword !== undefined
              }
              helperText={form.touched.newPassword && form.errors.newPassword}
            />
            <TextField
              type="password"
              placeholder="Confirmer le nouveau mot de passe"
              name="confirmNewPassword"
              fullWidth
              value={form.values.confirmNewPassword}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.confirmNewPassword &&
                form.errors.confirmNewPassword !== undefined
              }
              helperText={
                form.touched.confirmNewPassword &&
                form.errors.confirmNewPassword
              }
            />
            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 4 }}
              loading={onRequest}
            >
              mise à jour du mot de passe
            </LoadingButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PasswordUpdate;
