const makeString = (string, newEl) => {
  const editedString = string.length > 1 ? `${string}, ${newEl}` : `${newEl}`;
  return editedString;
};
export default makeString;
