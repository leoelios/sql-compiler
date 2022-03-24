const codeGenerator = node => {
  const generateSelect = node => {
    return `SELECT
${node.columns
  .map(column => codeGenerator(column))
  .join(',\n')}\n${codeGenerator(node.from)}`;
  };

  const generateFrom = node => {
    return `FROM ${node.value}`;
  };

  const generateColumn = node => {
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

    let builder = '  ';

    if (column.type === 'concatenation') {
      builder += column.elements.map(handleColumnType).join('\n  || ');
    } else {
      builder += handleColumnType(column);
    }

    if (alias && alias !== null) {
      builder += ` AS ${alias.value.value}`;
    }

    return builder;
  };

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
