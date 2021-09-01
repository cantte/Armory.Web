import { Theme } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { WithStyles } from '@material-ui/styles';
import createStyles from '@material-ui/styles/createStyles';
import withStyles from '@material-ui/styles/withStyles';
import { ReactElement } from 'react';

const fallBackStyles = (theme: Theme) =>
  createStyles({
    backdrop: {
      color: '#fff',
      zIndex: theme.zIndex.drawer + 1,
      backdropFilter: 'blur(7px)',
    },
  });

export type FallbackProps = WithStyles<typeof fallBackStyles>;

const Fallback = (props: FallbackProps): ReactElement => {
  const { classes } = props;

  return (
    <Backdrop open className={classes.backdrop}>
      <CircularProgress color="inherit" size={100} />
    </Backdrop>
  );
};

export default withStyles(fallBackStyles)(Fallback);
