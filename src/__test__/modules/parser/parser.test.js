import tokenizer from '../../../modules/tokenizer.mjs';
import parser from '../../../modules/parser/parser.mjs';
import Operator from '../../../constants/operator.mjs';
import Other from '../../../constants/other.mjs';

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
