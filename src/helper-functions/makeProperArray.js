const makeArray = string => {
  const array =
    string.length > 4
      ? Array.from(string.split(', '))
      : Array.from(string.split());
  return array;
};
export default makeArray;
