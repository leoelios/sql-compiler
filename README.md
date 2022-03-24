# SQL Compiler

A simple compiler to tokenize, parse and generate SQL code, allowing edit dynamically the query.

## :wrench: How to use?

Here is a simple usage. We'll use to compile the following query:

### Raw SQL

```sql
SELECT
  'UUID' || chr(01)
  'CLIENT' || chr(01)
  'VERSION' || chr(01)
FROM clients
```

### 1. Tokenized version

Split the SQL commands, reserverd words, strings, concatenation

```js
[
  "SELECT",
  "",
  "'UUID'",
  "||",
  "chr(01)",
  "",
  "'CLIENT'",
  "||",
  "chr(01)",
  "",
  "'VERSION'",
  "||",
  "chr(01)",
  "",
  "FROM",
  "clients",
];
```

### 2. Parsed version

Parse the tokens of previous step in abstract schema representation.

### 3. Transformed version

Manipulate the tree representation of the last step (e.g. Add new column to the select)

### 4. Code generation

Generate the updated SQL code, using as reference the released tree of elements.
