import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import { WithStyles, withStyles } from '@material-ui/styles';
import { displayData } from 'common/styles';
import { MouseEventHandler, ReactElement } from 'react';

export interface DisplayDataHeaderProps extends WithStyles<typeof displayData> {
  handleRefresh: MouseEventHandler<HTMLButtonElement>;
  placeholder: string;
}

const DisplayDataHeader = (props: DisplayDataHeaderProps): ReactElement => {
  const { classes, handleRefresh, placeholder } = props;

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      className={classes.searchBar}
    >
      <Toolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <SearchIcon color="inherit" sx={{ display: 'block' }} />
          </Grid>
          <Grid item xs>
            <TextField
              placeholder={placeholder}
              InputProps={{
                disableUnderline: true,
                className: classes.searchInput,
              }}
              fullWidth
            />
          </Grid>
          <Grid item>
            <Tooltip title="Refrescar datos">
              <IconButton onClick={handleRefresh} size="large">
                <RefreshIcon color="inherit" className={classes.block} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(displayData)(DisplayDataHeader);
