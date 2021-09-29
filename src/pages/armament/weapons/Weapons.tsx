import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import { Card, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import DataListHead, { HeadLabel } from 'components/data/DataListHead';
import DataListToolbar from 'components/data/DataListToolbar';
import ApiErrors from 'components/feedback/ApiErrors';
import Label from 'components/Label';
import CircularLoader from 'components/loading/CircularLoader';
import Page from 'components/Page';
import Scrollbar from 'components/scrollbar/Scrollbar';
import Consola from 'consola';
import FileSaver from 'file-saver';
import { useWeapons } from 'modules/armament/weapons/hooks';
import { generateQr } from 'modules/armament/weapons/service';
import { ChangeEvent, MouseEvent, ReactElement, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Weapons = (): ReactElement => {
  const [weapons, uiStatus] = useWeapons();

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');

  const handleRequestSort = (
    event: MouseEvent<HTMLSpanElement>,
    property: string,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterByName = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setFilterName(event.target.value);
  };

  const HEAD: HeadLabel[] = [
    { id: 'serial', label: 'Número de serie', alignRight: false },
    { id: 'type', label: 'Tipo', alignRight: false },
    { id: 'mark', label: 'Marca', alignRight: false },
    { id: 'model', label: 'Modelo', alignRight: false },
    { id: 'caliber', label: 'Calibre', alignRight: false },
    { id: 'holder', label: 'Asignado a', alignRight: false },
    { id: '' },
  ];

  const generateWeaponQr = async (series: string) => {
    try {
      const result = await generateQr(series);
      FileSaver.saveAs(result, `qr-${series}.pdf`);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        Consola.error(err);
      }
    }
  };

  return (
    <Page title="Armería | Armas">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Armas
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/weapons/register"
            startIcon={<AddIcon />}
          >
            Agregar arma
          </Button>
        </Stack>

        <Card>
          <DataListToolbar
            filterName={filterName}
            placeholder="Buscar arma"
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DataListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={HEAD}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {uiStatus === 'loading' && (
                    <TableRow>
                      <TableCell
                        align="center"
                        colSpan={HEAD.length}
                        sx={{ py: 3 }}
                      >
                        <CircularLoader
                          size={150}
                          message="Cargando armas..."
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  {uiStatus === 'loaded' &&
                    weapons.length > 0 &&
                    weapons.map(weapon => {
                      const { serial, type, mark, model, caliber, holderName } =
                        weapon;
                      return (
                        <TableRow key={serial} tabIndex={-1} hover>
                          <TableCell>{serial}</TableCell>
                          <TableCell>{type}</TableCell>
                          <TableCell>{mark}</TableCell>
                          <TableCell>{model}</TableCell>
                          <TableCell>{caliber}</TableCell>
                          <TableCell>
                            <Label color="info" variant="ghost">
                              {holderName || 'Arma no asinada'}
                            </Label>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Generar y descargar código QR">
                              <IconButton
                                onClick={() => generateWeaponQr(serial)}
                                size="large"
                              >
                                <GetAppIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={HEAD.length}
                      sx={{ py: 3 }}
                    >
                      <ApiErrors />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
};

export default Weapons;
