import Command from '../../../../constants/command.mjs';
import Comparator from '../../../../constants/comparator.mjs';
import Delimiter from '../../../../constants/delimiter.mjs';
import Operator from '../../../../constants/operator.mjs';
import Other from '../../../../constants/other.mjs';
import ReservedWord from '../../../../constants/reserved-words.mjs';
import parser from '../../../../modules/parser/parser.mjs';
import {
  getIndexNextSelect,
  getUnionType,
  isUnion,
  processColumn,
  processWhereIdentifier,
} from '../../../../modules/parser/walkers/select.mjs';

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

test('Process column with invalid empty parts', () => {
  expect(() => processColumn({ parts: [] })).toThrow(
    'Unsupported column type: []'
  );
});

test('Parse select with two columns', () => {
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
      type: 'COMMA',
      value: Delimiter.COMMA,
    },
    {
      type: 'DOUBLE_QUOTE',
      value: Delimiter.DOUBLE_QUOTE,
    },
    {
      type: 'IDENTIFIER',
      value: 'Eduardo',
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
        {
          type: Other.QUOTED_IDENTIFIER,
          value: 'Eduardo',
        },
      ],
      from: {
        type: Other.IDENTIFIER,
        value: 'dual',
      },
    },
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

test('Is union with undefined current token', () => {
  expect(isUnion([], 0)).toBe(false);
});

test('Is union with union all tokens', () => {
  expect(
    isUnion(
      [
        {
          type: ReservedWord.UNION,
          value: 'Union',
        },
        {
          type: ReservedWord.ALL,
          value: 'all',
        },
      ],
      0
    )
  ).toBe(true);
});

test('Is union with union token', () => {
  expect(
    isUnion(
      [
        {
          type: ReservedWord.AS,
          value: 'as',
        },
        {
          type: ReservedWord.UNION,
          value: 'union',
        },
        {
          type: ReservedWord.BY,
          value: 'by',
        },
      ],
      1
    )
  ).toBe(true);
});

test('Get union type from empty tokens', () => {
  expect(() => getUnionType([], 0)).toThrow(
    'Union statement not found in current query'
  );
});

test('Get union type from union token', () => {
  expect(
    getUnionType(
      [
        {
          type: ReservedWord.UNION,
          value: 'union',
        },
      ],
      0
    )
  ).toBe(ReservedWord.UNION);
});

test('Get union all type from [union, all] tokens', () => {
  expect(
    getUnionType(
      [
        {
          type: ReservedWord.UNION,
          value: 'union',
        },
        {
          type: ReservedWord.ALL,
          value: 'all',
        },
      ],
      0
    )
  ).toBe(Other.getKeyFromValue(Other.UNION_ALL));
});

test('Get index of right select on union clausule', () => {
  expect(
    getIndexNextSelect(
      [
        {
          type: ReservedWord.UNION,
          value: 'union',
        },
        {
          type: Command.SELECT,
          value: 'Select',
        },
      ],
      0
    )
  ).toBe(1);
});

test('Get index of right select on union all clausule', () => {
  expect(
    getIndexNextSelect(
      [
        {
          type: ReservedWord.UNION,
          value: 'union',
        },
        {
          type: ReservedWord.ALL,
          value: 'all',
        },
        {
          type: Command.SELECT,
          value: 'Select',
        },
      ],
      0
    )
  ).toBe(2);
});

test('Process where identifiers (simple equals)', () => {
  const processedTokens = processWhereIdentifier(
    [
      {
        type: Other.IDENTIFIER,
        value: 'name',
      },
      {
        type: Comparator.getKeyFromValue(Comparator.EQUALS),
        value: '=',
      },
      {
        type: Delimiter.getKeyFromValue(Delimiter.QUOTE),
        value: "'",
      },
      {
        type: Other.IDENTIFIER,
        value: 'Roberto',
      },
      {
        type: Delimiter.getKeyFromValue(Delimiter.QUOTE),
        value: "'",
      },
    ],
    0
  );

  expect(processedTokens).toEqual([
    {
      type: Other.IDENTIFIER,
      value: 'name',
    },
    {
      type: Comparator.getKeyFromValue(Comparator.EQUALS),
      value: '=',
    },
    {
      type: Other.STRING,
      value: 'Roberto',
    },
  ]);
});

test('Process where identifiers (logical aggregator + compare two numeric values)', () => {
  const processedTokens = processWhereIdentifier(
    [
      {
        type: Other.IDENTIFIER,
        value: 'age',
      },
      {
        type: Comparator.getKeyFromValue(Comparator.GREATER_THAN),
        value: '>',
      },
      {
        type: Other.NUMERIC,
        value: '18',
      },
      {
        type: Operator.getKeyFromValue(Operator.AND),
        value: 'and',
      },
      {
        type: Other.IDENTIFIER,
        value: 'age',
      },
      {
        type: Comparator.getKeyFromValue(Comparator.LESS_THAN),
        value: '<',
      },
      {
        type: Other.NUMERIC,
        value: '30',
      },
    ],
    0
  );

  expect(processedTokens).toEqual([
    {
      type: Other.IDENTIFIER,
      value: 'age',
    },
    {
      type: Comparator.getKeyFromValue(Comparator.GREATER_THAN),
      value: '>',
    },
    {
      type: Other.NUMERIC,
      value: '18',
    },
    {
      type: Operator.getKeyFromValue(Operator.AND),
      value: 'and',
    },
    {
      type: Other.IDENTIFIER,
      value: 'age',
    },
    {
      type: Comparator.getKeyFromValue(Comparator.LESS_THAN),
      value: '<',
    },
    {
      type: Other.NUMERIC,
      value: '30',
    },
  ]);
});

test('Process where identifier (compare identifier with sub-query)', () => {
  const processedTokens = processWhereIdentifier(
    [
      {
        type: Other.IDENTIFIER,
        value: 'age',
      },
      {
        type: Comparator.getKeyFromValue(Comparator.EQUALS),
        value: '=',
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
    ],
    0
  );

  expect(processedTokens).toEqual([
    {
      type: Other.IDENTIFIER,
      value: 'age',
    },
    {
      type: Comparator.getKeyFromValue(Comparator.EQUALS),
      value: '=',
    },
    {
      type: Other.PARENTHESIS,
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
  ]);
});
