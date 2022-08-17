const splitString = string => {
  const array = string.length > 2 ? string.split(', ') : string.split();
  return array;
};
export default splitString;
