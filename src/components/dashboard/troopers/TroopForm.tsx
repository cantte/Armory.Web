import { LoadingButton } from '@mui/lab';
import { InputLabel, Select } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useAppDispatch } from 'common/hooks';
import ApiErrors from 'components/feedback/ApiErrors';
import CircularLoader from 'components/loading/CircularLoader';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDegreesByRank } from 'modules/degrees/hooks';
import { useRanks } from 'modules/ranks/hooks';
import { useSquads } from 'modules/squads/hooks';
import { CreateTroopRequest } from 'modules/troopers/Models';
import { createTroop } from 'modules/troopers/Service';
import { apiError, registeredCorrectly } from 'modules/troopers/Slice';
import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

interface RegisterTroopFormValues extends CreateTroopRequest {
  rankId: number;
}

const TroopForm = (): ReactElement => {
  const dispatch = useAppDispatch();
  const [squads, squadsUiStatus] = useSquads();
  const [ranks, ranksUiStatus] = useRanks();

  const navigate = useNavigate();
  const RegisterTroopSchema = Yup.object().shape({
    id: Yup.string()
      .required('Este campo es requerido')
      .min(8, 'Debe digital mínimo 8 caracteres')
      .max(10, 'Solo se permiten 10 caracteres'),
    firstName: Yup.string().required('Este campo es requerido'),
    secondName: Yup.string().required('Este campo es requerido'),
    lastName: Yup.string().required('Este campo es requerido'),
    secondLastName: Yup.string().required('Este campo es requerido'),
    squadCode: Yup.string().required('Este campo es requerido'),
    degreeId: Yup.number()
      .required('Este campo es requerido')
      .min(1, 'Este campo es requerido'),
    rankId: Yup.number()
      .required('Este campo es requerido')
      .min(1, 'Este campo es requerido'),
  });

  const formik = useFormik<RegisterTroopFormValues>({
    initialValues: {
      id: '',
      firstName: '',
      secondName: '',
      lastName: '',
      secondLastName: '',
      squadCode: '',
      degreeId: 0,
      rankId: 0,
    },
    validationSchema: RegisterTroopSchema,
    onSubmit: async values => {
      try {
        await createTroop(values);
        dispatch(registeredCorrectly());
        navigate('/dashboard/troopers', { replace: true });
      } catch (err: unknown) {
        dispatch(apiError((err as Error).message));
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } =
    formik;

  const [degrees, degreesUiStatus] = useDegreesByRank(values.rankId);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Identificación"
            placeholder="Ejemplo: 1007870931"
            helperText={touched.id && errors.id}
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
              helperText={touched.firstName && errors.firstName}
              error={!!(errors.firstName && touched.firstName)}
              disabled={isSubmitting}
              {...getFieldProps('firstName')}
              required
              fullWidth
            />
            <TextField
              label="Segundo nombre"
              placeholder="Ejemplo: Pedro"
              helperText={touched.secondName && errors.secondName}
              error={!!(errors.secondName && touched.secondName)}
              disabled={isSubmitting}
              {...getFieldProps('secondName')}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Primer apellido"
              placeholder="Ejemplo: Perez"
              helperText={touched.lastName && errors.lastName}
              error={!!(errors.lastName && touched.lastName)}
              disabled={isSubmitting}
              {...getFieldProps('lastName')}
              required
              fullWidth
            />
            <TextField
              label="Segundo apellido"
              placeholder="Ejemplo: Pedro"
              helperText={touched.secondLastName && errors.secondLastName}
              error={!!(errors.secondLastName && touched.secondLastName)}
              {...getFieldProps('secondLastName')}
              disabled={isSubmitting}
              fullWidth
            />
          </Stack>
          <FormControl fullWidth>
            <InputLabel id="squad-label">Escuadra</InputLabel>
            <Select
              labelId="squad-label"
              label="Escuadra"
              defaultValue=""
              {...getFieldProps('squadCode')}
            >
              {squadsUiStatus === 'loading' && (
                <MenuItem value="">
                  <CircularLoader size={40} message="Cargando escuadras" />
                </MenuItem>
              )}
              {squadsUiStatus === 'loaded' &&
                squads &&
                squads.length > 0 &&
                squads.map(squad => {
                  const { code, name } = squad;
                  return (
                    <MenuItem key={code} value={code}>
                      {name}
                    </MenuItem>
                  );
                })}
            </Select>
            <FormHelperText error={!!(errors.squadCode && touched.squadCode)}>
              {touched.squadCode && errors.squadCode}
            </FormHelperText>
          </FormControl>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="rank-label">Cargo de operación</InputLabel>
              <Select
                labelId="rank-label"
                label="Cargo de operación"
                defaultValue=""
                {...getFieldProps('rankId')}
              >
                {ranksUiStatus === 'loading' && (
                  <MenuItem value="">
                    <CircularLoader
                      size={40}
                      message="Cargando cargos de operación"
                    />
                  </MenuItem>
                )}
                {ranksUiStatus === 'loaded' &&
                  ranks &&
                  ranks.map(rank => {
                    return (
                      <MenuItem value={rank.id} key={rank.id}>
                        {rank.name}
                      </MenuItem>
                    );
                  })}
              </Select>
              <FormHelperText error={!!(errors.rankId && touched.rankId)}>
                {touched.rankId && errors.rankId}
              </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="degree-label">Grado</InputLabel>
              <Select
                labelId="degree-label"
                label="Grado"
                defaultValue=""
                {...getFieldProps('degreeId')}
              >
                {(degreesUiStatus === 'idle' ||
                  (!!values.rankId && values.rankId === 0)) && (
                  <MenuItem value="">
                    Seleccione un cargo de operación primero
                  </MenuItem>
                )}
                {degreesUiStatus === 'loading' && (
                  <MenuItem value="">
                    <CircularLoader size={40} message="Cargando grados" />
                  </MenuItem>
                )}
                {degreesUiStatus === 'loaded' &&
                  degrees &&
                  degrees.map(degree => {
                    return (
                      <MenuItem value={degree.id} key={degree.id}>
                        {degree.name}
                      </MenuItem>
                    );
                  })}
              </Select>
              <FormHelperText error={!!(errors.degreeId && touched.degreeId)}>
                {touched.degreeId && errors.degreeId}
              </FormHelperText>
            </FormControl>
          </Stack>

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

export default TroopForm;
