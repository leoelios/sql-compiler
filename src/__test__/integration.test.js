import tokenizer from '../../src/modules/tokenizer.mjs';
import codeGenerator from '../modules/code-generator.mjs';
import parser from '../modules/parser/parser.mjs';

test('[E2E] Tokenize, parse and generate simple SQL query', () => {
  const sql = 'SELECT "Roberto" FROM dual';
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);
  const generated = codeGenerator(ast);

  expect(generated).toBe('SELECT "Roberto" FROM dual');
});

test('[E2E] Tokenize, parse and generate select with string column', () => {
  const sql = "SELECT 'Eduardo' as nome FROM dual";
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);
  const generated = codeGenerator(ast);

  expect(generated).toBe("SELECT 'Eduardo' AS nome FROM dual");
});

test('[E2E] Tokenize, parse and generate SQL Select with where', () => {
  const sql = 'SELECT "Roberto" FROM dual WHERE name = "Roberto"';
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);
  const generated = codeGenerator(ast);

  expect(generated).toBe('SELECT "Roberto" FROM dual WHERE name = "Roberto"');
});

test('[E2E] Tokenize, parse and generate SQL select with where including logical aggregator', () => {
  const sql = 'SELECT "Roberto" FROM dual WHERE name = "Roberto" AND age = 1';
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);
  const generated = codeGenerator(ast);

  expect(generated).toBe(
    'SELECT "Roberto" FROM dual WHERE name = "Roberto" AND age = 1'
  );
});

test('[E2E] Tokenize, parse and generate SQL select with three logical aggregator', () => {
  const sql =
    'SELECT "Roberto" FROM dual WHERE name = "Roberto" AND age = 1 OR name = "Roberto" AND age = 2';
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);
  const generated = codeGenerator(ast);

  expect(generated).toBe(
    'SELECT "Roberto" FROM dual WHERE name = "Roberto" AND age = 1 OR name = "Roberto" AND age = 2'
  );
});

test('[E2E] Tokenize, parse and generate SQL select with four logical aggregator', () => {
  const sql = `SELECT "Roberto"
     FROM dual
     WHERE
        name = "Roberto"
          OR name = "Roberto" AND age = 1 AND age = 2 AND name = "Roberto"`;
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);
  const generated = codeGenerator(ast);

  expect(generated).toBe(
    'SELECT "Roberto" FROM dual WHERE name = "Roberto" OR name = "Roberto" AND age = 1 AND age = 2 AND name = "Roberto"'
  );
});

test('[E2E] Tokenize, parse and generate SQL selecty with subquery column', () => {
  const sql = `SELECT (SELECT * FROM DUAL) as test
     FROM dual
     WHERE
        name = "Roberto"
          OR name = "Roberto" AND age = 1 AND age = 2 AND name = "Roberto"`;
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);
  const generated = codeGenerator(ast);

  expect(generated).toBe(
    'SELECT (SELECT * FROM DUAL) AS test FROM dual WHERE name = "Roberto" OR name = "Roberto" AND age = 1 AND age = 2 AND name = "Roberto"'
  );
});

test('[E2E] Tokenize, parse and generate SQL concatenation', () => {
  const sql = `SELECT
    "NAME" || CHR(01) ||
    'AGE' || CHR(01) ||
    'WORK' || CHR(01)
    FROM dual
    WHERE
      1 = 1`;
  const tokens = tokenizer(sql);
  const { value: ast } = parser(tokens);
  const generated = codeGenerator(ast);

  expect(generated).toBe(
    `SELECT "NAME" || CHR(01) || 'AGE' || CHR(01) || 'WORK' || CHR(01) FROM dual WHERE 1 = 1`
  );
});

test('[E2E] Tokenize, parse and generate Union SQL', () => {
  const sql = `SELECT "Roberto" FROM dual UNION SELECT "Roberto" FROM dual`;
  const tokens = tokenizer(sql);
  const ast = parser(tokens);
  const generated = codeGenerator(ast);

  expect(generated).toBe(
    `SELECT "Roberto" FROM dual UNION SELECT "Roberto" FROM dual`
  );
});

test('[E2E] Tokenize, parse and generate Union All SQL', () => {
  const sql = `SELECT "Roberto" FROM dual
     UNION
  ALL SELECT "Roberto" FROM dual`;
  const tokens = tokenizer(sql);
  const ast = parser(tokens);
  const generated = codeGenerator(ast);

  expect(generated).toBe(
    `SELECT "Roberto" FROM dual UNION ALL SELECT "Roberto" FROM dual`
  );
});
