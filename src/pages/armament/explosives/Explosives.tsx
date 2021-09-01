import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { WithStyles } from '@material-ui/styles';
import withStyles from '@material-ui/styles/withStyles';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from 'common/hooks';
import { displayData } from 'common/styles';
import DisplayDataHeader from 'components/data/DisplayDataHeader';
import ApiErrors from 'components/feedback/ApiErrors';
import CircularLoader from 'components/loading/CircularLoader';
import { getExplosives } from 'modules/armament/explosives/Service';
import {
  apiError,
  loadExplosives,
  loadingExplosives,
  selectExplosives,
  selectUiStatus,
} from 'modules/armament/explosives/Slice';
import { ReactElement, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';

export type ExplosivesProps = WithStyles<typeof displayData>;

const Explosives = (props: ExplosivesProps): ReactElement => {
  const { classes } = props;
  const dispatch = useAppDispatch();
  const explosives = useAppSelector(selectExplosives);
  const uiStatus = useAppSelector(selectUiStatus);

  const fetchExplosives = useCallback(async () => {
    try {
      dispatch(loadingExplosives());
      const result = await getExplosives();
      dispatch(loadExplosives(result));
    } catch (err: unknown) {
      dispatch(apiError((err as Error).message));
    }
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      await fetchExplosives();
    })();
  }, [fetchExplosives]);

  const handleRefresh = async () => {
    await fetchExplosives();
  };

  return (
    <>
      <Helmet>
        <title>Armería | Explosivos</title>
      </Helmet>
      <Paper>
        <DisplayDataHeader
          placeholder="Buscar explosivo"
          handleRefresh={handleRefresh}
        />
        <Paper
          elevation={0}
          className={clsx(
            (uiStatus === 'loading' || uiStatus === 'apiError') &&
              classes.withoutData,
          )}
        >
          {uiStatus === 'loading' && (
            <CircularLoader size={150} message="Cargando explosivos" />
          )}
          {uiStatus === 'loaded' && (
            <TableContainer className={classes.container}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Marca</TableCell>
                    <TableCell>Calibre</TableCell>
                    <TableCell>Número de serie</TableCell>
                    <TableCell>Candidad disponible</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {explosives.map(explosive => {
                    return (
                      <TableRow key={explosive.code}>
                        <TableCell>{explosive.code}</TableCell>
                        <TableCell>{explosive.type}</TableCell>
                        <TableCell>{explosive.mark}</TableCell>
                        <TableCell>{explosive.caliber}</TableCell>
                        <TableCell>{explosive.series}</TableCell>
                        <TableCell>{explosive.quantityAvailable}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <ApiErrors />
        </Paper>
      </Paper>
    </>
  );
};

export default withStyles(displayData)(Explosives);
