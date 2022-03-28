import {
  generateFrom,
  generateColumn,
  generateSelect,
  default as codeGenerator,
} from '../../modules/code-generator.mjs';

test('Generate FROM clausule without a from_value', () => {
  const node = {
    type: 'from_object',
    value: null,
  };

  expect(() => generateFrom(node)).toThrow('from_value cannot be null');
});

test('Generate FROM clausule with value', () => {
  const node = {
    type: 'from_object',
    value: 'pessoa',
  };
  const expected = 'FROM pessoa';
  const result = generateFrom(node);
  expect(result).toBe(expected);
});

test('Generate concatenated column with an alias', () => {
  const node = {
    type: 'column',
    columnValue: {
      type: 'concatenation',
      elements: [
        {
          type: 'string_literal',
          value: 'nome',
        },
        {
          type: 'function_call',
          name: 'concat',
          arguments: ['01'],
        },
        {
          type: 'object_value',
          value: 'idade',
        },
      ],
    },
    alias: {
      type: 'column_alias',
      value: {
        type: 'string_literal',
        value: 'nome',
      },
    },
  };
  const expected = "'nome' || concat(01) || idade AS nome";
  const result = generateColumn(node);
  expect(result).toBe(expected);
});

test('Generate select on table people using codeGenerator', () => {
  const node = {
    type: 'select',
    columns: [
      {
        type: 'column',
        columnValue: {
          type: 'object_value',
          value: 'nome',
        },
        alias: {
          type: 'column_alias',
          value: {
            type: 'string_literal',
            value: 'nome',
          },
        },
      },
      {
        type: 'column',
        columnValue: {
          type: 'object_value',
          value: 'idade',
        },
        alias: {
          type: 'column_alias',
          value: {
            type: 'string_literal',
            value: 'idade',
          },
        },
      },
    ],
    from: {
      type: 'from_object',
      value: 'pessoa',
    },
  };
  const expected = 'SELECT nome AS nome, idade AS idade FROM pessoa';
  const result = codeGenerator(node);
  expect(result).toBe(expected);
});

test('Generate select on table people', () => {
  const node = {
    type: 'select',
    columns: [
      {
        type: 'column',
        columnValue: {
          type: 'string_literal',
          value: 'Roberto',
        },
        alias: {
          type: 'column_alias',
          value: {
            type: 'string_literal',
            value: 'nome',
          },
        },
      },
    ],
    from: {
      type: 'from_object',
      value: 'pessoa',
    },
  };
  const result = generateSelect(node);
  expect(result).toBe("SELECT 'Roberto' AS nome FROM pessoa");
});

test('Generate asterisk (all) column', () => {
  const node = {
    type: 'column',
    columnValue: {
      type: 'asterisk',
    },
    alias: null,
  };
  const expected = '*';
  const result = generateColumn(node);
  expect(result).toBe(expected);
});

test('Generate concatenated string column', () => {
  const node = {
    type: 'column',
    columnValue: {
      type: 'concatenation',
      elements: [
        {
          type: 'string_literal',
          value: 'Roberto',
        },
        {
          type: 'string_literal',
          value: 'Silva',
        },
      ],
    },
    alias: null,
  };
  const expected = `'Roberto' || 'Silva'`;

  const result = generateColumn(node);
  expect(result).toBe(expected);
});

test('Generate simple text unique column', () => {
  const node = {
    type: 'column',
    columnValue: {
      type: 'string_literal',
      value: 'Roberto',
    },
    alias: null,
  };
  const result = generateColumn(node);
  expect(result).toBe(`'Roberto'`);
});

test('Generate simple text unique column with an alias', () => {
  const node = {
    type: 'column',
    columnValue: {
      type: 'string_literal',
      value: 'Roberto',
    },
    alias: {
      type: 'alias',
      value: {
        type: 'alias_value',
        value: 'nome',
      },
    },
  };
  const result = generateColumn(node);
  expect(result).toBe(`'Roberto' AS nome`);
});

test('Generate function call column with an alias', () => {
  const node = {
    type: 'column',
    columnValue: {
      type: 'function_call',
      name: 'upper',
      arguments: ["'Roberto'"],
    },
    alias: {
      type: 'alias',
      value: {
        type: 'alias_value',
        value: 'nome',
      },
    },
  };
  const result = generateColumn(node);
  expect(result).toBe(`upper('Roberto') AS nome`);
});

test('Generate function call column', () => {
  const node = {
    type: 'column',
    columnValue: {
      type: 'function_call',
      name: 'to_number',
      arguments: ["'33'"],
    },
  };
  const result = generateColumn(node);
  expect(result).toBe(`to_number('33')`);
});

test('Generate a named column', () => {
  const node = {
    type: 'column',
    columnValue: {
      type: 'object_value',
      value: 'nome',
    },
    alias: {
      type: 'alias',
      value: {
        type: 'alias_value',
        value: 'nome',
      },
    },
  };
  const result = generateColumn(node);
  expect(result).toBe(`nome AS nome`);
});

test('Generate union all select', () => {
  const node = {
    type: 'union_all',
    left: {
      type: 'select',
      columns: [
        {
          type: 'column',
          columnValue: {
            type: 'object_value',
            value: 'nome',
          },
          alias: {
            type: 'column_alias',
            value: {
              type: 'string_literal',
              value: 'nome',
            },
          },
        },
        {
          type: 'column',
          columnValue: {
            type: 'object_value',
            value: 'idade',
          },
          alias: {
            type: 'column_alias',
            value: {
              type: 'string_literal',
              value: 'idade',
            },
          },
        },
      ],
      from: {
        type: 'from_object',
        value: 'pessoa',
      },
    },
    right: {
      type: 'select',
      columns: [
        {
          type: 'column',
          columnValue: {
            type: 'object_value',
            value: 'nome',
          },
          alias: {
            type: 'column_alias',
            value: {
              type: 'string_literal',
              value: 'nome',
            },
          },
        },
        {
          type: 'column',
          columnValue: {
            type: 'object_value',
            value: 'idade',
          },
          alias: {
            type: 'column_alias',
            value: {
              type: 'string_literal',
              value: 'idade',
            },
          },
        },
      ],
      from: {
        type: 'from_object',
        value: 'pessoa',
      },
    },
  };
  const expected = `SELECT nome AS nome, idade AS idade FROM pessoa UNION ALL SELECT nome AS nome, idade AS idade FROM pessoa`;
  const result = codeGenerator(node);
  expect(result.toUpperCase()).toBe(expected.toUpperCase());
});

test('Generate union two select', () => {
  const node = {
    type: 'union',
    left: {
      type: 'select',
      columns: [
        {
          type: 'column',
          columnValue: {
            type: 'object_value',
            value: 'nome',
          },
          alias: {
            type: 'column_alias',
            value: {
              type: 'string_literal',
              value: 'nome',
            },
          },
        },
        {
          type: 'column',
          columnValue: {
            type: 'object_value',
            value: 'idade',
          },
          alias: {
            type: 'column_alias',
            value: {
              type: 'string_literal',
              value: 'idade',
            },
          },
        },
      ],
      from: {
        type: 'from_object',
        value: 'pessoa',
      },
    },
    right: {
      type: 'select',
      columns: [
        {
          type: 'column',
          columnValue: {
            type: 'object_value',
            value: 'nome',
          },
          alias: {
            type: 'column_alias',
            value: {
              type: 'string_literal',
              value: 'nome',
            },
          },
        },
        {
          type: 'column',
          columnValue: {
            type: 'object_value',
            value: 'idade',
          },
          alias: {
            type: 'column_alias',
            value: {
              type: 'string_literal',
              value: 'idade',
            },
          },
        },
      ],
      from: {
        type: 'from_object',
        value: 'pessoa',
      },
    },
  };
  const expected = `SELECT nome AS nome, idade AS idade FROM pessoa UNION SELECT nome AS nome, idade AS idade FROM pessoa`;
  const result = codeGenerator(node);
  expect(result.toUpperCase()).toBe(expected.toUpperCase());
});
