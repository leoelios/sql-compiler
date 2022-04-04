import Command from '../../constants/command.mjs';
import Comparator from '../../constants/comparator.mjs';
import Delimiter from '../../constants/delimiter.mjs';
import Operator from '../../constants/operator.mjs';
import Other from '../../constants/other.mjs';
import identifier from './walkers/identifier.mjs';
import select from './walkers/select.mjs';

export const walk = (tokens, index) => {
  const { type } = tokens[index];

  switch (type) {
    case Command.SELECT:
      return select(tokens, index);
    case Other.IDENTIFIER:
      return identifier(tokens, index);
    case Operator.getKeyFromValue(Operator.WILDCARD):
    case Delimiter.getKeyFromValue(Delimiter.LEFT_PARENTHESIS):
    case Delimiter.getKeyFromValue(Delimiter.RIGHT_PARENTHESIS):
    case Comparator.getKeyFromValue(Comparator.EQUALS):
    case Delimiter.getKeyFromValue(Delimiter.DOUBLE_QUOTE):
    case Operator.AND:
    case Operator.OR:
    case Other.NUMERIC:
      return {
        value: tokens[index],
        index,
      };
  }

  throw new Error(`Unknown token type: ${type}`);
};

export default tokens => {
  if (!tokens?.length) {
    throw new Error('No tokens provided to parser, please validate your SQL');
  }

  return walk(tokens, 0);
};
