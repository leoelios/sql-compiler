import tokenizer from '../../../modules/tokenizer.mjs';
import parser from '../../../modules/parser/parser.mjs';
import Operator from '../../../constants/operator.mjs';
import Other from '../../../constants/other.mjs';
import ReservedWord from '../../../constants/reserved-words.mjs';

test('Parse tokens with an invalid token type', () => {
  const tokens = tokenizer('SELECT * FROM table');
  tokens[0].type = 'invalid';

  expect(() => parser(tokens)).toThrowError('Unknown token type: invalid');
});

test('Parse tokens with undefined array', () => {
  expect(() => parser(undefined)).toThrowError(
    'No tokens provided to parser, please validate your SQL'
  );
});

test('Parse tokens with empty array', () => {
  expect(() => parser([])).toThrowError(
    'No tokens provided to parser, please validate your SQL'
  );
});

test('Parse SELECT without where clausule', () => {
  const sql = 'SELECT * FROM table';
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);

  expect(ast).toEqual({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'WILDCARD',
          value: Operator.WILDCARD,
        },
      ],
      from: {
        type: Other.IDENTIFIER,
        value: 'table',
      },
    },
  });
});

test('Parse select with where clausule and logical aggregator', () => {
  const sql = 'SELECT * FROM table WHERE a = 1 AND b = 2';
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);

  expect(ast).toEqual({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'WILDCARD',
          value: Operator.WILDCARD,
        },
      ],
      from: {
        type: Other.IDENTIFIER,
        value: 'table',
      },
      where: {
        type: 'WHERE',
        value: {
          type: 'AND',
          left: {
            type: 'EQUALS',
            left: {
              type: Other.IDENTIFIER,
              value: 'a',
            },
            right: {
              type: Other.NUMERIC,
              value: '1',
            },
          },
          right: {
            type: 'EQUALS',
            left: {
              type: Other.IDENTIFIER,
              value: 'b',
            },
            right: {
              type: Other.NUMERIC,
              value: '2',
            },
          },
        },
      },
    },
  });
});

test('Parse SELECT with where clausule', () => {
  const sql = 'SELECT * FROM table WHERE id = 1';
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);

  expect(ast).toEqual({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'WILDCARD',
          value: Operator.WILDCARD,
        },
      ],
      from: {
        type: Other.IDENTIFIER,
        value: 'table',
      },
      where: {
        type: 'WHERE',
        value: {
          type: 'EQUALS',
          left: {
            type: 'IDENTIFIER',
            value: 'id',
          },
          right: {
            type: 'NUMERIC',
            value: '1',
          },
        },
      },
    },
  });
});

test('Parse SELECT with function call column type', () => {
  const sql = 'SELECT COUNT(*) FROM table';
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);

  expect(ast).toEqual({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'FUNCTION_CALL',
          value: {
            arguments: [
              {
                type: 'WILDCARD',
                value: Operator.WILDCARD,
              },
            ],
            name: 'COUNT',
          },
        },
      ],
      from: {
        type: Other.IDENTIFIER,
        value: 'table',
      },
    },
  });
});

test('Parse SELECT without where and with table alias', () => {
  const sql = 'SELECT * as test FROM table t';
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);

  expect(ast).toEqual({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'WILDCARD',
          value: Operator.WILDCARD,
          alias: 'test',
        },
      ],
      from: {
        type: Other.IDENTIFIER,
        value: 'table',
        alias: 't',
      },
    },
  });
});

test('Parse UNION of two select', () => {
  const sql = 'SELECT * as test FROM table t UNION SELECT * FROM table2';
  const tokens = tokenizer(sql);
  const ast = parser(tokens);

  expect(ast).toEqual({
    type: ReservedWord.UNION,
    value: {
      left: {
        type: 'SELECT',
        value: {
          columns: [
            {
              type: 'WILDCARD',
              value: Operator.WILDCARD,
              alias: 'test',
            },
          ],
          from: {
            type: Other.IDENTIFIER,
            value: 'table',
            alias: 't',
          },
        },
      },
      right: {
        type: 'SELECT',
        value: {
          columns: [
            {
              type: 'WILDCARD',
              value: Operator.WILDCARD,
            },
          ],
          from: {
            type: Other.IDENTIFIER,
            value: 'table2',
          },
        },
      },
    },
  });
});

test('Parse UNION All of two select', () => {
  const sql = 'SELECT * as test FROM table t UNION ALL SELECT * FROM table2';
  const tokens = tokenizer(sql);
  const ast = parser(tokens);

  expect(ast).toEqual({
    type: Other.getKeyFromValue(Other.UNION_ALL),
    value: {
      left: {
        type: 'SELECT',
        value: {
          columns: [
            {
              type: 'WILDCARD',
              value: Operator.WILDCARD,
              alias: 'test',
            },
          ],
          from: {
            type: Other.IDENTIFIER,
            value: 'table',
            alias: 't',
          },
        },
      },
      right: {
        type: 'SELECT',
        value: {
          columns: [
            {
              type: 'WILDCARD',
              value: Operator.WILDCARD,
            },
          ],
          from: {
            type: Other.IDENTIFIER,
            value: 'table2',
          },
        },
      },
    },
  });
});
