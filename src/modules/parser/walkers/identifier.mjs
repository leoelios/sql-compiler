import Delimiter from '../../../constants/delimiter.mjs';
import Other from '../../../constants/other.mjs';

export const isQuote = token =>
  [
    Delimiter.getKeyFromValue(Delimiter.QUOTE),
    Delimiter.getKeyFromValue(Delimiter.DOUBLE_QUOTE),
  ].includes(token?.type);

export const isStringLiteral = (tokens, index) => {
  const left = tokens[index - 1];
  const right = tokens[index + 1];

  return [left, right].every(token => isQuote(token));
};

export const getTypeStringLiteral = (tokens, index) => {
  const left = tokens[index - 1];
  const right = tokens[index + 1];

  return left?.type === right?.type && left?.type;
};

export default (tokens, index) => {
  const { value } = tokens[index] || {};

  const withIndex = obj => ({ value: obj, index });

  if (isStringLiteral(tokens, index)) {
    const stringType = getTypeStringLiteral(tokens, index);

    switch (stringType) {
      case Delimiter.getKeyFromValue(Delimiter.QUOTE):
        return withIndex({
          type: Other.STRING,
          value,
        });
      case Delimiter.getKeyFromValue(Delimiter.DOUBLE_QUOTE):
        return withIndex({
          type: Other.QUOTED_IDENTIFIER,
          value,
        });
    }
  }

  return withIndex(tokens[index]);
};
