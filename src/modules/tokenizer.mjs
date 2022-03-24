const removeLineBreak = str => str.replace(/\r?\n/g, '');

const filterExtraSpaces = (token, index, tokens) => {
  return !(token == '' && tokens[index + 1] == '');
};

export default command => {
  if (command.length === 0) {
    return [];
  }

  return command
    .trim()
    .replaceAll(',', ' , ')
    .split(' ')
    .filter(filterExtraSpaces)
    .map(removeLineBreak);
};
