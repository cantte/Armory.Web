import Container from '@material-ui/core/Container';
import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';
import Page from 'components/Page';
import SquadronForm from 'components/squadrons/SquadronForm';
import { ReactElement } from 'react';

const RegisterSquadron = (): ReactElement => {
  return (
    <Page title="Armería | Registro de escuadrillas">
      <Container>
        <Stack sx={{ mb: 5 }}>
          <Typography variant="h4" gutterBottom>
            Registro de escuadrillas
          </Typography>
        </Stack>

        <SquadronForm />
      </Container>
    </Page>
  );
};

export default RegisterSquadron;
