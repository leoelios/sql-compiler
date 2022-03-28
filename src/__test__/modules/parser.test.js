const { Type } = require('../../constants/type.mjs');
const {
  lexer,
  syntaticAnalysis,
  default: parser,
  isUnion,
} = require('../../modules/parser.mjs');
const { default: tokenizer } = require('../../modules/tokenizer.mjs');

test('Make lexical analysis on SQL clausule with function call', () => {
  const sql = 'SELECT MAX(id) FROM table';
  const tokens = tokenizer(sql);
  const lexed = lexer(tokens);
  expect(lexed).toEqual([
    { type: Type.SELECT_STATEMENT, value: 'SELECT' },
    { type: Type.FUNCTION_CALL, value: 'MAX(id)' },
    { type: Type.FROM_STATEMENT, value: 'FROM' },
    { type: Type.UNKNOWN, value: 'table' },
  ]);
});

test('Make syntatic analysis on SQL clausule with function call', () => {
  const sql = 'SELECT MAX(id) FROM table';
  const tokens = tokenizer(sql);
  const lexed = lexer(tokens);
  const ast = syntaticAnalysis(lexed);
  expect(ast).toEqual({
    type: 'select',
    columns: [
      {
        type: 'column',
        alias: null,
        columnValue: {
          type: 'function_call',
          name: 'MAX',
          arguments: ['id'],
        },
      },
    ],
    from: { type: 'from_object', value: 'table' },
  });
});

test('Make lexical analysis on short SQL clausule', () => {
  const tokens = lexer(tokenizer('SELECT * FROM table'));
  expect(tokens).toEqual([
    { type: Type.SELECT_STATEMENT, value: 'SELECT' },
    { type: Type.ASTERISK, value: '*' },
    { type: Type.FROM_STATEMENT, value: 'FROM' },
    { type: Type.UNKNOWN, value: 'table' },
  ]);
});

test('Make syntatic analysis on short SQL clausule tokens', () => {
  const tokens = lexer(tokenizer('SELECT * FROM table'));
  const ast = syntaticAnalysis(tokens);
  expect(ast).toEqual({
    type: 'select',
    columns: [
      {
        type: 'column',
        alias: null,
        columnValue: {
          type: 'asterisk',
          value: '*',
        },
      },
    ],
    from: {
      type: 'from_object',
      value: 'table',
    },
  });
});

test('Make syntatic analysis on short SQL with concatenated column', () => {
  const tokens = lexer(
    tokenizer(`SELECT 'Roberto' || '_USER' as nome FROM table`)
  );
  const ast = syntaticAnalysis(tokens);
  expect(ast).toEqual({
    type: 'select',
    columns: [
      {
        type: 'column',
        alias: {
          type: 'column_alias',
          value: {
            type: 'alias_value',
            value: 'nome',
          },
        },
        columnValue: {
          type: 'concatenation',
          elements: [
            {
              type: 'string_literal',
              value: 'Roberto',
            },
            {
              type: 'string_literal',
              value: '_USER',
            },
          ],
        },
      },
    ],
    from: {
      type: 'from_object',
      value: 'table',
    },
  });
});

test('Parse short SQL with two columns', () => {
  const tokens = tokenizer('SELECT id, nome FROM table');
  const ast = parser(tokens);
  expect(ast).toEqual({
    type: 'select',
    columns: [
      {
        type: 'column',
        alias: null,
        columnValue: {
          type: 'object_value',
          value: 'id',
        },
      },
      {
        type: 'column',
        alias: null,
        columnValue: {
          type: 'object_value',
          value: 'nome',
        },
      },
    ],
    from: {
      type: 'from_object',
      value: 'table',
    },
  });
});

test('Parse short SQL with named column', () => {
  const tokens = tokenizer('SELECT id AS nome FROM table');
  const ast = parser(tokens);
  expect(ast).toEqual({
    type: 'select',
    columns: [
      {
        type: 'column',
        alias: {
          type: 'column_alias',
          value: {
            type: 'alias_value',
            value: 'nome',
          },
        },
        columnValue: {
          type: 'object_value',
          value: 'id',
        },
      },
    ],
    from: {
      type: 'from_object',
      value: 'table',
    },
  });
});

test('Parser short SQL clausule tokens', () => {
  const tokens = tokenizer('SELECT * FROM table');
  const ast = parser(tokens);
  expect(ast).toEqual({
    type: 'select',
    columns: [
      {
        type: 'column',
        alias: null,
        columnValue: {
          type: 'asterisk',
          value: '*',
        },
      },
    ],
    from: {
      type: 'from_object',
      value: 'table',
    },
  });
});

test('Parse SQL union all of two select queries', () => {
  const tokens = tokenizer(
    `SELECT * FROM table1 UNION ALL SELECT * FROM table2`
  );
  const ast = parser(tokens);
  expect(ast).toEqual({
    type: 'union_all',
    left: {
      type: 'select',
      columns: [
        {
          type: 'column',
          alias: null,
          columnValue: {
            type: 'asterisk',
            value: '*',
          },
        },
      ],
      from: {
        type: 'from_object',
        value: 'table1',
      },
    },
    right: {
      type: 'select',
      columns: [
        {
          type: 'column',
          alias: null,
          columnValue: {
            type: 'asterisk',
            value: '*',
          },
        },
      ],
      from: {
        type: 'from_object',
        value: 'table2',
      },
    },
  });
});

test('Parse SQL union of two select queries', () => {
  const tokens = tokenizer(
    `SELECT * FROM table1 UNION SELECT * FROM table2`
  );
  const ast = parser(tokens);
  expect(ast).toEqual({
    type: 'union',
    left: {
      type: 'select',
      columns: [
        {
          type: 'column',
          alias: null,
          columnValue: {
            type: 'asterisk',
            value: '*',
          },
        },
      ],
      from: {
        type: 'from_object',
        value: 'table1',
      },
    },
    right: {
      type: 'select',
      columns: [
        {
          type: 'column',
          alias: null,
          columnValue: {
            type: 'asterisk',
            value: '*',
          },
        },
      ],
      from: {
        type: 'from_object',
        value: 'table2',
      },
    },
  });
});

test('Verify if is union', () => {
  const tokens = [
    {
      type: Type.UNION,
      value: 'Union',
    },
  ];

  expect(isUnion(tokens, 0)).toBe(true);
});

test('Verify if is union All', () => {
  const tokens = [
    {
      type: Type.UNION,
      value: 'Union',
    },
    {
      type: Type.ALL,
      value: 'all',
    },
  ];

  expect(isUnion(tokens, 0)).toBe(true);
});
