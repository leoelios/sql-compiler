const {
  default: tokenizer,
  getTokenType,
  handleOtherTypes,
} = require('../../modules/tokenizer.mjs');

test('Tokenize undefined command', () => {
  expect(() => tokenizer(undefined)).toThrow(
    'The passed SQL query is not valid'
  );
});

test('Tokenize null command', () => {
  expect(() => tokenizer(null)).toThrow('The passed SQL query is not valid');
});

test('Tokenize empty string command', () => {
  expect(() => tokenizer('')).toThrow('The passed SQL query is not valid');
});

test('Tokenize valid SQL query', () => {
  const tokens = tokenizer('SELECT * FROM table');
  expect(tokens).toEqual([
    { type: 'SELECT', value: 'SELECT' },
    { type: 'WILDCARD', value: '*' },
    { type: 'FROM', value: 'FROM' },
    { type: 'IDENTIFIER', value: 'table' },
  ]);
});

test('Tokenize SQL query with subquery', () => {
  const tokens = tokenizer('SELECT * FROM (SELECT * FROM table)');
  expect(tokens).toEqual([
    { type: 'SELECT', value: 'SELECT' },
    { type: 'WILDCARD', value: '*' },
    { type: 'FROM', value: 'FROM' },
    { type: 'LEFT_PARENTHESIS', value: '(' },
    { type: 'SELECT', value: 'SELECT' },
    { type: 'WILDCARD', value: '*' },
    { type: 'FROM', value: 'FROM' },
    { type: 'IDENTIFIER', value: 'table' },
    { type: 'RIGHT_PARENTHESIS', value: ')' },
  ]);
});

test('Tokenize SQL query union tables', () => {
  const tokens = tokenizer('SELECT * FROM table1 uNIon SELECT * FROM table2');
  expect(tokens).toEqual([
    { type: 'SELECT', value: 'SELECT' },
    { type: 'WILDCARD', value: '*' },
    { type: 'FROM', value: 'FROM' },
    { type: 'IDENTIFIER', value: 'table1' },
    { type: 'UNION', value: 'uNIon' },
    { type: 'SELECT', value: 'SELECT' },
    { type: 'WILDCARD', value: '*' },
    { type: 'FROM', value: 'FROM' },
    { type: 'IDENTIFIER', value: 'table2' },
  ]);
});

test('Tokenize SQL query with where clausule', () => {
  const tokens = tokenizer('SELECT * FROM table WHERE id = 1');
  expect(tokens).toEqual([
    { type: 'SELECT', value: 'SELECT' },
    { type: 'WILDCARD', value: '*' },
    { type: 'FROM', value: 'FROM' },
    { type: 'IDENTIFIER', value: 'table' },
    { type: 'WHERE', value: 'WHERE' },
    { type: 'IDENTIFIER', value: 'id' },
    { type: 'EQUALS', value: '=' },
    { type: 'NUMERIC', value: '1' },
  ]);
});

test('Tokenize Decimal numeric', () => {
  const tokens = tokenizer('1.1');
  expect(tokens).toEqual([{ type: 'NUMERIC', value: '1.1' }]);
});

test('Tokenize string literal', () => {
  const tokens = tokenizer("'string'");
  expect(tokens).toEqual([
    { type: 'QUOTE', value: "'" },
    { type: 'IDENTIFIER', value: 'string' },
    { type: 'QUOTE', value: "'" },
  ]);
});

test('Tokenize query with column alias', () => {
  const tokens = tokenizer('SELECT * FROM table AS t');
  expect(tokens).toEqual([
    { type: 'SELECT', value: 'SELECT' },
    { type: 'WILDCARD', value: '*' },
    { type: 'FROM', value: 'FROM' },
    { type: 'IDENTIFIER', value: 'table' },
    { type: 'AS', value: 'AS' },
    { type: 'IDENTIFIER', value: 't' },
  ]);
});

test('Tokenize non alphanumeric string', () => {
  const tokens = tokenizer('SELECT * FROM table WHERE id = "string"');
  expect(tokens).toEqual([
    { type: 'SELECT', value: 'SELECT' },
    { type: 'WILDCARD', value: '*' },
    { type: 'FROM', value: 'FROM' },
    { type: 'IDENTIFIER', value: 'table' },
    { type: 'WHERE', value: 'WHERE' },
    { type: 'IDENTIFIER', value: 'id' },
    { type: 'EQUALS', value: '=' },
    { type: 'DOUBLE_QUOTE', value: '"' },
    { type: 'IDENTIFIER', value: 'string' },
    { type: 'DOUBLE_QUOTE', value: '"' },
  ]);
});

test('Get token type from undefined token', () => {
  expect(() => getTokenType(undefined)).toThrow('Token not can be undefined');
});

test('Classifier other type empty string', () => {
  expect(() => handleOtherTypes('')).toThrow(
    'The word  is not part of the language, please check the query syntax'
  );
});

test('Classifier other type invalid token', () => {
  expect(() => handleOtherTypes('$asdasdas')).toThrow(
    'The word $asdasdas is not part of the language, please check the query syntax'
  );
});
