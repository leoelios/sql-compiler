const { default: tokenizer } = require('../../modules/tokenizer.mjs');

test('Tokenize undefined string', () => {
  const tokens = tokenizer(undefined);
  expect(tokens).toEqual([]);
});

test('Tokenize empty string', () => {
  const tokens = tokenizer('');
  expect(tokens).toEqual([]);
});

test('Tokenize valid SQL query', () => {
  const tokens = tokenizer('SELECT * FROM table');
  expect(tokens).toEqual(['SELECT', '*', 'FROM', 'table']);
});
