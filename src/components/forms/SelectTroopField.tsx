import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CircularLoader from 'components/loading/CircularLoader';
import { useField } from 'formik';
import { FieldInputProps } from 'formik/dist/types';
import { useTroopersByFireTeam } from 'modules/troopers/hooks';
import { ReactElement } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface SelectTroopFieldProps extends FieldInputProps<any> {
  fireteamCode: string;
  disabled: boolean;
}

const SelectTroopField = (props: SelectTroopFieldProps): ReactElement => {
  const { fireteamCode, disabled, ...others } = props;
  const [field, meta] = useField(others);
  const [troopers, troopersUiStatus] = useTroopersByFireTeam(fireteamCode);

  return (
    <FormControl fullWidth>
      <InputLabel id="troopId-label">Entrega a</InputLabel>
      <Select
        labelId="troopId-label"
        label="Entrega a"
        error={!!(meta.error && meta.touched)}
        disabled={disabled}
        defaultValue=""
        {...field}
        {...others}
      >
        {troopersUiStatus === 'loading' && (
          <MenuItem value="">
            <CircularLoader
              size={40}
              message="Cargando oficiales, suboficiales o soldados"
            />
          </MenuItem>
        )}
        {troopersUiStatus === 'apiError' && (
          <MenuItem value="">No hay datos</MenuItem>
        )}
        {troopers &&
          troopers.map(troop => {
            const {
              id,
              firstName,
              secondName,
              lastName,
              secondLastName,
              degreeName,
            } = troop;
            return (
              <MenuItem key={id} value={id}>
                {id} - {degreeName}. {firstName} {secondName} {lastName}{' '}
                {secondLastName}
              </MenuItem>
            );
          })}
        {troopers && troopers.length === 0 && (
          <MenuItem value="">No hay datos</MenuItem>
        )}
      </Select>
      <FormHelperText error={!!(meta.error && meta.touched)}>
        {meta.error && meta.touched
          ? meta.error
          : 'Seleccione un oficial, suboficial o soldado'}
      </FormHelperText>
    </FormControl>
  );
};

export default SelectTroopField;
