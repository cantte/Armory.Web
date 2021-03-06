import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Card, TablePagination, Tooltip } from '@mui/material';
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
import UpdateRankDialog from 'components/dashboard/ranks/UpdateRankDialog';
import { HeadLabel } from 'components/data/DataListHead';
import SimpleDataListHead from 'components/data/SimpleDataListHead';
import ApiErrors from 'components/feedback/ApiErrors';
import CircularLoader from 'components/loading/CircularLoader';
import Page from 'components/Page';
import Scrollbar from 'components/scrollbar/Scrollbar';
import { useRanks } from 'modules/ranks/hooks';
import { ReactElement, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTablePagination } from 'shared/hooks/useTablePagination';

const Ranks = (): ReactElement => {
  const [ranks, uiStatus] = useRanks();

  const [page, rowsPerPage, handleChangePage, handleChangeRowsPerPage] =
    useTablePagination();

  const HEAD: HeadLabel[] = [
    { id: 'id', label: 'Id', alignRight: false },
    { id: 'name', label: 'Nombre', alignRight: false },
    { id: '' },
  ];

  const [rankId, setRankId] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const handleClickEdit = (id: number): void => {
    setRankId(id);
    setOpenEditDialog(true);
  };

  const onCloseEditDialog = (): void => {
    setOpenEditDialog(false);
  };

  return (
    <Page title="Armería | Cargos de operación">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Cargos de operación
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/ranks/register"
            startIcon={<AddIcon />}
          >
            Agregar cargo de operación
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, maxHeight: 450 }}>
              <Table>
                <SimpleDataListHead head={HEAD} />
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
                          message="Cargando rangos..."
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  {ranks.length > 0 &&
                    ranks
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map(rank => {
                        const { id, name } = rank;
                        return (
                          <TableRow key={id} tabIndex={-1} hover>
                            <TableCell>{id}</TableCell>
                            <TableCell>{name}</TableCell>

                            <TableCell>
                              <Tooltip title="Editar">
                                <IconButton
                                  aria-label="Editar"
                                  onClick={() => handleClickEdit(id)}
                                >
                                  <EditIcon />
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={ranks.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <UpdateRankDialog
          open={openEditDialog}
          rankId={rankId}
          onClose={onCloseEditDialog}
        />
      </Container>
    </Page>
  );
};

export default Ranks;
