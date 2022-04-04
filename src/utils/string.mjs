export const nonExtraWhiteSpace = (token, index, tokens) =>
  !(token == '' && tokens[index + 1] == '');

export const nonBlank = str => str?.replaceAll(' ', '').length;

export const removeLineBreak = str => str.replace(/\r?\n/g, '');

export const isAlphanumeric = str => str.match(/^[a-z0-9]+$/i) !== null;

export const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);
