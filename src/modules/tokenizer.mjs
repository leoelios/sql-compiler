import { filterExtraSpaces, removeLineBreak } from '../utils/app.mjs';

export default command => {
  return command?.length > 0
    ? command
        .trim()
        .replaceAll(',', ' , ')
        .split(' ')
        .filter(filterExtraSpaces)
        .map(removeLineBreak)
    : [];
};
