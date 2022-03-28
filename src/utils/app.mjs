import { Type } from '../constants/type.mjs';

export const isNotEmptySpace = token => token.type !== Type.EMPTY_SPACE;
export const removeLineBreak = str => str.replace(/\r?\n/g, '');
export const filterExtraSpaces = (token, index, tokens) => {
  return !(token == '' && tokens[index + 1] == '');
};
