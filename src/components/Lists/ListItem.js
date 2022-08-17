import { Link } from 'react-router-dom';
import classes from './ListItem.module.css';

const ListItem = props => {
  return (
    <Link
      to={`inspect/${props.itemId}`}
      className={classes.item}
      key={props.itemId}>
      {props.name}
    </Link>
  );
};

export default ListItem;
