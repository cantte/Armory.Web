import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Consola from 'consola';
import { ReactElement, useState } from 'react';

import QrReader from './QrReader';

export interface QrReaderDialogProps {
  open: boolean;
  onClose: (value: string | null) => void;
}

const QrReaderDialog = (props: QrReaderDialogProps): ReactElement => {
  const { open, onClose } = props;
  const [hasError, setHasError] = useState(false);

  const handleClose = () => {
    setHasError(false);
    onClose(null);
  };

  const handleScan = (value: string | null) => {
    if (value != null) {
      setHasError(false);
      onClose(value);
    }
  };

  const handleError = (err: unknown) => {
    Consola.warn((err as Error).message);
    setHasError(true);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Escanear QR</DialogTitle>
      <DialogContent>
        <Grid container alignItems="center">
          <Grid item xs>
            <QrReader handleScan={handleScan} handleError={handleError} />
          </Grid>
        </Grid>
        {hasError && <Alert severity="error">No se pudo leer la imagen.</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QrReaderDialog;
