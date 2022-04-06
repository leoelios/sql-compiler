import Command from '../constants/command.mjs';
import Comparator from '../constants/comparator.mjs';
import Operator from '../constants/operator.mjs';
import Other from '../constants/other.mjs';
import ReservedWord from '../constants/reserved-words.mjs';

export const generateSelect = ({ value: node }) => {
  return `SELECT ${node.columns
    .map(column => generateColumn(column))
    .join(', ')} ${generateFrom(node.from)} ${
    node.where ? codeGenerator(node.where) : ''
  }`.trim();
};

export const generateFrom = ({ type, value, alias }) => {
  let builder = `FROM ${codeGenerator({ type, value })}`;

  if (alias) {
    builder += ` ${alias}`;
  }

  return builder;
};

export const generateColumn = column => {
  const { alias } = column;

  let builder = '';

  builder += codeGenerator(column);

  if (alias && alias !== null) {
    builder += ` AS ${alias}`;
  }

  return builder;
};

/**
 * @param {*} node a object that represent a AST node.
 * @return {string} a SQL string.
 */
export function generateUnion(node) {
  return `${codeGenerator(node.left)} ${node.type
    .toUpperCase()
    .replace('_', ' ')} ${codeGenerator(node.right)}`;
}

const codeGenerator = node => {
  const { type } = node;

  if (Command.SELECT === type) {
    return generateSelect(node);
  } else if ([ReservedWord.UNION, Other.UNION_ALL].includes(type)) {
    return generateUnion(node);
  } else if (Other.PARENTHESIS === type) {
    return `(${codeGenerator(node.value)})`;
  } else if (
    [Operator.getKeyFromValue(Operator.WILDCARD), Other.NUMERIC].includes(type)
  ) {
    return node.value;
  } else if (Other.STRING === type) {
    return `'${node.value}'`;
  } else if (Other.FUNCTION_CALL === type) {
    return `${node.value.name}(${node.value.arguments
      .map(arg => codeGenerator(arg))
      .join(', ')})`;
  } else if (Other.QUOTED_IDENTIFIER === type) {
    return `"${node.value}"`;
  } else if (Other.CONCATENATION === type) {
    return node.value.map(codeGenerator).join(' || ');
  } else if ([Other.IDENTIFIER, Operator.WILDCARD].includes(type)) {
    return node.value;
  } else if (ReservedWord.WHERE === type) {
    return `WHERE ${codeGenerator(node.value)}`;
  } else if (Operator.isLogical(type)) {
    return `${codeGenerator(node.left)} ${type} ${codeGenerator(node.right)}`;
  } else if (Comparator.is(type)) {
    return `${codeGenerator(node.left)} ${Comparator.getValueFromKey(
      type
    )} ${codeGenerator(node.right)}`;
  }

  throw new Error(
    "Unsupported node (it's cannot be found as a handled type) " +
      JSON.stringify(node)
  );
};

export default codeGenerator;
