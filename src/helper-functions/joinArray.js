const joinArray = array => {
  let string = array.length > 1 ? array.join(', ') : array.join();
  return string;
};

export default joinArray;
