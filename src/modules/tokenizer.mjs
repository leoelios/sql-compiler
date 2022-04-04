import ReservedWord from '../constants/reserved-words.mjs';
import { isNumeric, removeLineBreak } from '../utils/string.mjs';
import Operator from '../constants/operator.mjs';
import Delimiter from '../constants/delimiter.mjs';
import Comparator from '../constants/comparator.mjs';
import Command from '../constants/command.mjs';
import { isValidObjectName } from '../utils/sql.mjs';
import Other from '../constants/other.mjs';

export default command => {
  if (!command) {
    throw new Error('The passed SQL query is not valid');
  }

  const tokens = Delimiter.separeByDelimiter(command.trim())
    .map(removeLineBreak)
    .filter(a => a);

  return tokens.map(classifier);
};

/**
 * Classifier a token.
 * @param {*} token
 * @return {{type: Type, value: string}} Token classified.
 */
function classifier(token) {
  const type = getTokenType(token);

  return {
    type,
    value: token,
  };
}

/**
 * @param {String} token Token to classify.
 * @return {Type} Token type.
 */
export function getTokenType(token) {
  if (!token) {
    throw new Error('Token not can be undefined');
  }

  const upperCaseToken = token.toUpperCase();
  const { key: type } =
    Operator.getTypeFromValue(upperCaseToken) ||
    Command.getTypeFromValue(upperCaseToken) ||
    Delimiter.getTypeFromValue(upperCaseToken) ||
    Comparator.getTypeFromValue(upperCaseToken) ||
    ReservedWord.getTypeFromValue(upperCaseToken) ||
    {};

  if (!type) {
    return handleOtherTypes(token);
  }

  return type;
}

export const handleOtherTypes = token => {
  if (isNumeric(token)) {
    return Other.NUMERIC;
  } else if (isValidObjectName(token)) {
    return Other.IDENTIFIER;
  } else {
    throw new Error(
      `The word ${token} is not part of the language, please check the query syntax`
    );
  }
};
