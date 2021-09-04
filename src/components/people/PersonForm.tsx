import { FormHelperText } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Stack from '@material-ui/core/Stack';
import TextField from '@material-ui/core/TextField';
import { LoadingButton } from '@material-ui/lab';
import ApiErrors from 'components/feedback/ApiErrors';
import CircularLoader from 'components/loading/CircularLoader';
import Consola from 'consola';
import { Form, FormikProvider, useFormik } from 'formik';
import { CreatePersonRequest } from 'modules/people/Models';
import { createPerson } from 'modules/people/Service';
import { useRoles } from 'modules/users/hooks';
import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import translateRole from 'utils/translateRole';
import * as Yup from 'yup';

const PersonForm = (): ReactElement => {
  const [roles, userUiStatus] = useRoles();

  const RegisterPersonScheme = Yup.object().shape({
    id: Yup.string()
      .required('Este campo es requerido')
      .max(10, 'No se permiten más de 10 caracteres'),
    firstName: Yup.string().required('Este campo es requerido'),
    secondName: Yup.string().required('Este campo es requerido'),
    lastName: Yup.string().required('Este campo es requerido'),
    secondLastName: Yup.string().required('Este campo es requerido'),
    email: Yup.string()
      .required('Este campo es requerido')
      .email('Digite un email válido'),
    phoneNumber: Yup.string()
      .required('Este campo es requerido')
      .min(10, 'Se deben digitar mínimo 10 caracteres')
      .max(10, 'No se permiten más de 10 caracteres'),
    roleName: Yup.string().required('Este campo es requerido'),
  });

  const navigate = useNavigate();
  const formik = useFormik<CreatePersonRequest>({
    initialValues: {
      id: '',
      firstName: '',
      secondName: '',
      lastName: '',
      secondLastName: '',
      email: '',
      phoneNumber: '',
      roleName: '',
    },
    validationSchema: RegisterPersonScheme,
    onSubmit: async values => {
      try {
        await createPerson(values);
        navigate('/dashboard/people/all');
      } catch (err: unknown) {
        Consola.error(err);
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Identificación"
            placeholder="Ejemplo: 1234567890"
            helperText={
              errors.id && touched.id
                ? errors.id
                : 'Digite la identificación del comandante'
            }
            error={!!(errors.id && touched.id)}
            disabled={isSubmitting}
            {...getFieldProps('id')}
            required
            fullWidth
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Primer nombre"
              placeholder="Ejemplo: Manolo"
              helperText={
                errors.firstName && touched.firstName
                  ? errors.firstName
                  : 'Digite el primer nombre del comandante'
              }
              error={!!(errors.firstName && touched.firstName)}
              disabled={isSubmitting}
              {...getFieldProps('firstName')}
              required
              fullWidth
            />
            <TextField
              label="Segundo nombre"
              placeholder="Ejemplo: Juan"
              helperText={
                errors.secondName && touched.secondName
                  ? errors.secondName
                  : 'Digite el segundo nombre del comandante'
              }
              error={!!(errors.secondName && touched.secondName)}
              disabled={isSubmitting}
              {...getFieldProps('secondName')}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Primer apellido"
              placeholder="Ejemplo: Peréz"
              helperText={
                errors.lastName && touched.lastName
                  ? errors.lastName
                  : 'Digite el primer apellido del comandante'
              }
              error={!!(errors.lastName && touched.lastName)}
              disabled={isSubmitting}
              {...getFieldProps('lastName')}
              required
              fullWidth
            />
            <TextField
              label="Segundo apellido"
              placeholder="Ejemplo: Torres"
              helperText={
                errors.secondLastName && touched.secondLastName
                  ? errors.secondLastName
                  : 'Digite el segundo apellido del comandante'
              }
              error={!!(errors.secondLastName && touched.secondLastName)}
              disabled={isSubmitting}
              {...getFieldProps('secondLastName')}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Email"
              placeholder="example@example.com"
              helperText={
                errors.email && touched.email
                  ? errors.email
                  : 'Digite el email del comandante'
              }
              error={!!(errors.email && touched.email)}
              disabled={isSubmitting}
              {...getFieldProps('email')}
              fullWidth
            />
            <TextField
              label="Número de teléfono"
              placeholder="3000000000"
              helperText={
                errors.phoneNumber && touched.phoneNumber
                  ? errors.phoneNumber
                  : 'Digite el número de teléfono del comandante'
              }
              error={!!(errors.phoneNumber && touched.phoneNumber)}
              disabled={isSubmitting}
              {...getFieldProps('phoneNumber')}
              fullWidth
            />
          </Stack>
          <FormControl fullWidth>
            <InputLabel id="role-label">Rol del comandante</InputLabel>
            <Select
              labelId="role-label"
              label="Rol del comandante"
              defaultValue=""
              {...getFieldProps('roleName')}
              fullWidth
            >
              {userUiStatus === 'loading' && (
                <MenuItem value="">
                  <CircularLoader size={40} message="Cargando roles..." />
                </MenuItem>
              )}
              {userUiStatus === 'loaded' &&
                roles &&
                roles.length > 0 &&
                roles
                  .filter(r => r.name !== 'Developer')
                  .map(r => {
                    return (
                      <MenuItem value={r.name} key={r.name}>
                        {translateRole(r.name)}
                      </MenuItem>
                    );
                  })}
            </Select>
            <FormHelperText error={!!(errors.roleName && touched.roleName)}>
              {errors.roleName && touched.roleName
                ? errors.roleName
                : 'Seleccione el rol del comandante'}
            </FormHelperText>
          </FormControl>

          <ApiErrors />

          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Registrar
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
};

export default PersonForm;