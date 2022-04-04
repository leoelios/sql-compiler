import Delimiter from '../../../src/constants/delimiter.mjs';

test('Delimit string SQL with double Quotes', () => {
  const sql = 'SELECT * FROM table WHERE id = "string"';
  const tokens = Delimiter.separeByDelimiter(sql);

  expect(tokens).toEqual([
    'SELECT',
    '*',
    'FROM',
    'table',
    'WHERE',
    'id',
    '=',
    '"',
    'string',
    '"',
  ]);
});
