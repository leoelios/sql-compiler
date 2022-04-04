import Delimiter from '../../../../constants/delimiter.mjs';
import Operator from '../../../../constants/operator.mjs';
import Other from '../../../../constants/other.mjs';
import parser from '../../../../modules/parser/parser.mjs';
import { processColumn } from '../../../../modules/parser/walkers/select.mjs';

test('Process unique column parts for new column', () => {
  const parts = [
    {
      type: 'WILDCARD',
      value: Operator.WILDCARD,
    },
  ];

  expect(processColumn({ parts })).toEqual({
    type: 'WILDCARD',
    value: Operator.WILDCARD,
  });
});

test('Process concatenation column parts for new column', () => {
  const parts = [
    {
      type: Operator.getKeyFromValue(Operator.WILDCARD),
      value: Operator.WILDCARD,
    },
    {
      type: Operator.getKeyFromValue(Operator.CONCAT),
      value: Operator.CONCAT,
    },
    {
      type: Operator.getKeyFromValue(Operator.WILDCARD),
      value: Operator.WILDCARD,
    },
  ];

  expect(processColumn({ parts })).toEqual({
    type: Other.CONCATENATION,
    value: [
      {
        type: 'WILDCARD',
        value: Operator.WILDCARD,
      },
      {
        type: 'WILDCARD',
        value: Operator.WILDCARD,
      },
    ],
  });
});

test('Parse select with column named within double quotes', () => {
  const { value: ast } = parser([
    {
      type: 'SELECT',
      value: 'select',
    },
    {
      type: 'DOUBLE_QUOTE',
      value: Delimiter.DOUBLE_QUOTE,
    },
    {
      type: 'IDENTIFIER',
      value: 'Roberto',
    },
    {
      type: 'DOUBLE_QUOTE',
      value: Delimiter.DOUBLE_QUOTE,
    },
    {
      type: 'FROM',
      value: 'from',
    },
    {
      type: 'IDENTIFIER',
      value: 'dual',
    },
  ]);

  expect(ast).toEqual({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: Other.QUOTED_IDENTIFIER,
          value: 'Roberto',
        },
      ],
      from: {
        type: Other.IDENTIFIER,
        value: 'dual',
      },
    },
  });
});

test('Parse select with column type is string', () => {
  const { value: ast } = parser([
    {
      type: 'SELECT',
      value: 'select',
    },
    {
      type: 'QUOTE',
      value: Delimiter.QUOTE,
    },
    {
      type: 'IDENTIFIER',
      value: 'Roberto',
    },
    {
      type: 'QUOTE',
      value: Delimiter.QUOTE,
    },
    {
      type: 'FROM',
      value: 'from',
    },
    {
      type: 'IDENTIFIER',
      value: 'dual',
    },
  ]);

  expect(ast).toEqual({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'STRING',
          value: 'Roberto',
        },
      ],
      from: {
        type: Other.IDENTIFIER,
        value: 'dual',
      },
    },
  });
});

test('Process select with column alias and without where clausule', () => {
  const { value: ast } = parser([
    {
      type: 'SELECT',
      value: 'Select',
    },
    {
      type: 'WILDCARD',
      value: '*',
    },
    {
      type: 'AS',
      value: 'as',
    },
    {
      type: 'IDENTIFIER',
      value: 'test',
    },
    {
      type: 'FROM',
      value: 'from',
    },
    {
      type: 'IDENTIFIER',
      value: 'table',
    },
    {
      type: 'IDENTIFIER',
      value: 't',
    },
  ]);

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

test('Parse Select with column of number type', () => {
  const { value: ast } = parser([
    {
      type: 'SELECT',
      value: 'select',
    },
    {
      type: 'NUMERIC',
      value: '1',
    },
    {
      type: 'FROM',
      value: 'from',
    },
    {
      type: 'IDENTIFIER',
      value: 'table',
    },
  ]);

  expect(ast).toEqual({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'NUMERIC',
          value: '1',
        },
      ],
      from: {
        type: Other.IDENTIFIER,
        value: 'table',
      },
    },
  });
});

test('Parse select with function call argumented column', () => {
  const { value: ast } = parser([
    {
      type: 'SELECT',
      value: 'select',
    },
    {
      type: Other.IDENTIFIER,
      value: 'test',
    },
    {
      type: Delimiter.getKeyFromValue(Delimiter.LEFT_PARENTHESIS),
      value: '(',
    },
    {
      type: Delimiter.getKeyFromValue(Delimiter.QUOTE),
      value: "'",
    },
    {
      type: Other.IDENTIFIER,
      value: 'test',
    },
    {
      type: Delimiter.getKeyFromValue(Delimiter.QUOTE),
      value: "'",
    },
    {
      type: Delimiter.getKeyFromValue(Delimiter.RIGHT_PARENTHESIS),
      value: ')',
    },
    {
      type: 'FROM',
      value: 'from',
    },
    {
      type: 'IDENTIFIER',
      value: 'table',
    },
  ]);

  expect(ast).toEqual({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: Other.FUNCTION_CALL,
          value: {
            name: 'test',
            arguments: [
              {
                type: 'STRING',
                value: 'test',
              },
            ],
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

test('Parse select with function call no-args column', () => {
  const { value: ast } = parser([
    {
      type: 'SELECT',
      value: 'select',
    },
    {
      type: 'IDENTIFIER',
      value: 'MAX',
    },
    {
      type: Delimiter.getKeyFromValue(Delimiter.LEFT_PARENTHESIS),
      value: '(',
    },
    {
      type: Delimiter.getKeyFromValue(Delimiter.RIGHT_PARENTHESIS),
      value: ')',
    },
    {
      type: 'FROM',
      value: 'from',
    },
    {
      type: 'IDENTIFIER',
      value: 'table',
    },
  ]);

  expect(ast).toEqual({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: Other.FUNCTION_CALL,
          value: {
            name: 'MAX',
            arguments: [],
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

test('Parse select with parenthesis column', () => {
  const { value: ast } = parser([
    {
      type: 'SELECT',
      value: 'select',
    },
    {
      type: Delimiter.getKeyFromValue(Delimiter.LEFT_PARENTHESIS),
      value: '(',
    },
    {
      type: 'IDENTIFIER',
      value: 'test',
    },
    {
      type: Delimiter.getKeyFromValue(Delimiter.RIGHT_PARENTHESIS),
      value: ')',
    },
    {
      type: 'FROM',
      value: 'from',
    },
    {
      type: 'IDENTIFIER',
      value: 'table',
    },
  ]);

  expect(ast).toEqual({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'PARENTHESIS',
          value: {
            type: Other.IDENTIFIER,
            value: 'test',
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

test('Parse select with subquery with where as column', () => {
  const { value: ast } = parser([
    {
      type: 'SELECT',
      value: 'select',
    },
    {
      type: Delimiter.getKeyFromValue(Delimiter.LEFT_PARENTHESIS),
      value: '(',
    },
    {
      type: 'SELECT',
      value: 'select',
    },
    {
      type: 'QUOTE',
      value: Delimiter.QUOTE,
    },
    {
      type: 'IDENTIFIER',
      value: 'Roberto',
    },
    {
      type: 'QUOTE',
      value: Delimiter.QUOTE,
    },
    {
      type: 'FROM',
      value: 'from',
    },
    {
      type: 'IDENTIFIER',
      value: 'dual',
    },
    {
      type: Delimiter.getKeyFromValue(Delimiter.RIGHT_PARENTHESIS),
      value: ')',
    },
    {
      type: 'FROM',
      value: 'from',
    },
    {
      type: 'IDENTIFIER',
      value: 'table',
    },
  ]);

  expect(ast).toEqual({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'PARENTHESIS',
          value: {
            type: 'SELECT',
            value: {
              columns: [
                {
                  type: 'STRING',
                  value: 'Roberto',
                },
              ],
              from: {
                type: Other.IDENTIFIER,
                value: 'dual',
              },
            },
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

test('Parse select with parenthesis from', () => {});
