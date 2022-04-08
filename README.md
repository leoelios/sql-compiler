# SQL Compiler

[![coverage](https://codecov.io/gh/leoelias023/sql-compiler/branch/main/graph/badge.svg?token=1LX21DN4DI)](https://codecov.io/gh/leoelias023/sql-compiler)
![Project dependency free](https://img.shields.io/badge/dependency--free-yes-success)

A simple compiler to tokenize, parse and generate SQL code, allowing edit dynamically the query.

## :wrench: How to use?

Here is a simple usage. We'll use compile the following query:

```js
import Compiler from 'sql-compiler';

/** 1. Parse string SQL to Abstract Syntax Tree */
const { value: ast } = Compiler.parser(
  Compiler.tokenizer(
    `SELECT
    'Leonardo' as name,
    'Dicaprio' as lastname
  FROM
    dual l`
  )
);

/** 2. Manipulate the SQL, add new column. */
ast.value.columns.push({
  type: 'NUMERIC',
  value: '20',
  alias: 'age',
});

/** 3. Generate the manipulated SQL. */
const code = Compiler.codeGenerator(ast);

console.log(code);
// STDOUT: SELECT 'Leonardo' AS name, 'Dicaprio' AS lastname, 20 AS age FROM dual l
```

## :pencil2: How it works?

### Raw SQL

```sql
SELECT
    'Leonardo' as name,
    'Dicaprio' as lastname
  FROM
    dual l
```

### 1. Tokenized version

Split the SQL commands, reserved words, strings, concatenation

```js
[
  'SELECT',
  '',
  "'UUID'",
  '||',
  'chr(01)',
  '',
  "'CLIENT'",
  '||',
  'chr(01)',
  '',
  "'VERSION'",
  '||',
  'chr(01)',
  '',
  'FROM',
  'clients',
];
```

### 2. Parsed version

Parse the tokens of previous step in abstract schema representation.

```json
{
  "type": "SELECT",
  "value": {
    "columns": [
      { "type": "STRING", "value": "Leonardo", "alias": "name" },
      { "type": "STRING", "value": "Dicaprio", "alias": "lastname" }
    ],
    "from": { "type": "IDENTIFIER", "value": "dual", "alias": "l" }
  }
}
```

### 3. Transformed version

Manipulate the tree representation of the last step (e.g. Add new column to the select)

```json
{
  "type": "SELECT",
  "value": {
    "columns": [
      { "type": "STRING", "value": "Leonardo", "alias": "name" },
      { "type": "STRING", "value": "Dicaprio", "alias": "lastname" },
      { "type": "NUMERIC", "value": "20", "alias": "age" }
    ],
    "from": { "type": "IDENTIFIER", "value": "dual", "alias": "l" }
  }
}
```

### 4. Code generation

Generate the updated SQL code, using as reference the released tree of elements.

```sql
SELECT 'Leonardo' AS name, 'Dicaprio' AS lastname, 20 AS age FROM dual l
```
