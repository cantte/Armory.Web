import { ReactElement, useEffect } from 'react';
import { withStyles, WithStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Helmet } from 'react-helmet';
import CircularLoader from '../../components/loading/CircularLoader';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import { displayData } from '../../common/styles';
import DisplayDataHeader from '../../components/data/DisplayDataHeader';
import { getTroopers } from '../../modules/troopers/Service';
import { selectTroopers, selectUiStatus } from '../../modules/troopers/Slice';

export type TroopersProps = WithStyles<typeof displayData>;

const Troopers = (props: TroopersProps): ReactElement => {
  const { classes } = props;
  const dispatch = useAppDispatch();
  const troopers = useAppSelector(selectTroopers);
  const uiStatus = useAppSelector(selectUiStatus);

  useEffect(() => {
    (async () => {
      await getTroopers(dispatch);
    })();
  }, [dispatch]);

  const handleRefresh = async () => {
    await getTroopers(dispatch);
  };

  return (
    <>
      <Helmet>
        <title>Armería | Troopas</title>
      </Helmet>
      <Paper>
        <DisplayDataHeader
          placeholder="Buscar tropa"
          handleRefresh={handleRefresh}
        />
        <Paper elevation={0}>
          {uiStatus === 'loading' && (
            <CircularLoader size={150} message="Cargando tropas..." />
          )}
          {uiStatus === 'loaded' && (
            <TableContainer className={classes.container}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Identificación</TableCell>
                    <TableCell>Nombre completo</TableCell>
                    <TableCell>Escuadrón</TableCell>
                    <TableCell>Grado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {troopers.map(troop => {
                    return (
                      <TableRow key={troop.id}>
                        <TableCell>{troop.id}</TableCell>
                        <TableCell>
                          {troop.firstName} {troop.secondName} {troop.lastName}{' '}
                          {troop.secondLastName}
                        </TableCell>
                        <TableCell>{troop.squadCode}</TableCell>
                        <TableCell>{troop.degreeId}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Paper>
    </>
  );
};

export default withStyles(displayData)(Troopers);
