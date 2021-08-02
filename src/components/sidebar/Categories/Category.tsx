import { ReactElement, Fragment } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { CategoryItems } from './index';
import CategoryItem from './CategoryItem';

const styles = (theme: Theme) =>
  createStyles({
    categoryHeader: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    categoryHeaderPrimary: {
      color: theme.palette.common.white,
    },
    divider: {
      marginTop: theme.spacing(2),
    },
  });

export interface CategoryProps extends WithStyles<typeof styles> {
  id: string;
  currentPath: string;
  items: CategoryItems;
}

const Category = (props: CategoryProps): ReactElement => {
  const { classes, id, items, currentPath } = props;
  return (
    <Fragment key={id}>
      <ListItem key={id} className={classes.categoryHeader}>
        <ListItemText classes={{ primary: classes.categoryHeaderPrimary }}>
          {id}
        </ListItemText>
      </ListItem>
      {items.map(child => (
        <CategoryItem
          key={child.id}
          id={child.id}
          path={child.path}
          icon={child.icon}
          currentPath={currentPath}
        />
      ))}
      <Divider className={classes.divider} />
    </Fragment>
  );
};

export default withStyles(styles)(Category);