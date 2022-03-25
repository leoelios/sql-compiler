export const generateSelect = node => {
  return `SELECT ${node.columns
    .map(column => codeGenerator(column))
    .join(', ')} ${codeGenerator(node.from)}`;
};

export const generateFrom = ({ value }) => {
  if (!value) {
    throw new Error('from_value cannot be null');
  }

  return `FROM ${value}`;
};

export const generateColumn = node => {
  const { columnValue: column, alias } = node;

  const handleColumnType = ({ type, value, name, arguments: argumentos }) => {
    if (type == 'string_literal') {
      return `'${value}'`;
    }

    if (type == 'asterisk') {
      return '*';
    }

    if (type == 'object_value') {
      return value;
    }

    if (type == 'function_call') {
      return `${name}(${argumentos.join(', ')})`;
    }
  };

  let builder = '';

  if (column.type === 'concatenation') {
    builder += column.elements.map(handleColumnType).join(' || ');
  } else {
    builder += handleColumnType(column);
  }

  if (alias && alias !== null) {
    builder += ` AS ${alias.value.value}`;
  }

  return builder;
};

const codeGenerator = node => {
  switch (node.type) {
    case 'select':
      return generateSelect(node);
    case 'from_object':
      return generateFrom(node);
    case 'column':
      return generateColumn(node);
  }
};

export default codeGenerator;
