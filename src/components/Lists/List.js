import ListItem from './ListItem';
import classes from './List.module.css';

const List = props => {
  // fetchedData - получаем ее из родительского компонента MainMenu. Состояние redux.
  const fetchedData = props.data;
  const processedData = [];
  for (const key in fetchedData) {
    processedData.push({
      id: fetchedData[key].id,
      name: fetchedData[key].name,
    });
  }
  const output = processedData.map(item => (
    <ListItem key={item.id} name={item.name} itemId={item.id}></ListItem>
  ));
  return <ul className={classes.list}>{output}</ul>;
};

export default List;
