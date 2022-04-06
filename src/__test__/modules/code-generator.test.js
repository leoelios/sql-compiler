import Other from '../../constants/other.mjs';
import ReservedWord from '../../constants/reserved-words.mjs';
import codeGenerator from '../../modules/code-generator.mjs';

test('Generate simple SQL query', () => {
  const sql = codeGenerator({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'STRING',
          value: 'Roberto',
        },
      ],
      from: {
        type: 'IDENTIFIER',
        value: 'dual',
      },
    },
  });

  expect(sql).toBe("SELECT 'Roberto' FROM dual");
});

test('Generate select with column and table alias', () => {
  const sql = codeGenerator({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'STRING',
          value: 'Roberto',
          alias: 'name',
        },
      ],
      from: {
        type: 'IDENTIFIER',
        value: 'dual',
        alias: 'dual_alias',
      },
    },
  });

  expect(sql).toBe("SELECT 'Roberto' AS name FROM dual dual_alias");
});

test('Generate select with string within parenthesis', () => {
  const sql = codeGenerator({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'STRING',
          value: 'Roberto',
        },
      ],
      from: {
        type: 'PARENTHESIS',
        value: {
          type: 'IDENTIFIER',
          value: 'dual',
        },
      },
    },
  });

  expect(sql).toBe("SELECT 'Roberto' FROM (dual)");
});

test('Generate select with subquery column', () => {
  const sql = codeGenerator({
    type: 'SELECT',
    value: {
      columns: [
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
                type: 'IDENTIFIER',
                value: 'dual',
              },
            },
          },
          alias: 'test',
        },
        {
          type: 'CONCATENATION',
          value: [
            {
              type: 'STRING',
              value: ' ',
            },
            {
              type: 'IDENTIFIER',
              value: 'test',
            },
          ],
        },
      ],
      from: {
        type: 'IDENTIFIER',
        value: 'table',
      },
    },
  });

  expect(sql).toBe(
    "SELECT (SELECT 'Roberto' FROM dual) AS test, ' ' || test FROM table"
  );
});

test('Generate select with subquery from', () => {
  const sql = codeGenerator({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'STRING',
          value: 'Roberto',
        },
      ],
      from: {
        type: 'PARENTHESIS',
        alias: 'dual_alias',
        value: {
          type: 'SELECT',
          value: {
            columns: [
              {
                type: 'STRING',
                value: 'Roberto',
                alias: 'name',
              },
            ],
            from: {
              type: 'IDENTIFIER',
              value: 'dual',
            },
          },
        },
      },
    },
  });

  expect(sql).toBe(
    "SELECT 'Roberto' FROM (SELECT 'Roberto' AS name FROM dual) dual_alias"
  );
});

test('Generate select with function call column', () => {
  const sql = codeGenerator({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'STRING',
          value: 'Roberto',
        },
        {
          type: 'FUNCTION_CALL',
          value: {
            name: 'UPPER',
            arguments: [
              {
                type: 'STRING',
                value: 'Roberto',
              },
            ],
          },
        },
      ],
      from: {
        type: 'IDENTIFIER',
        value: 'dual',
      },
    },
  });

  expect(sql).toBe("SELECT 'Roberto', UPPER('Roberto') FROM dual");
});

test('Generate select with concatenation column', () => {
  const sql = codeGenerator({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'CONCATENATION',
          value: [
            {
              type: 'STRING',
              value: 'Roberto',
              alias: 'name',
            },
            {
              type: 'QUOTED_IDENTIFIER',
              value: 'Gonzales',
            },
          ],
        },
      ],
      from: {
        type: 'IDENTIFIER',
        value: 'dual',
      },
    },
  });

  expect(sql).toBe('SELECT \'Roberto\' || "Gonzales" FROM dual');
});

test('Generate select with where greater than number', () => {
  const sql = codeGenerator({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'STRING',
          value: 'Roberto',
        },
      ],
      from: {
        type: 'IDENTIFIER',
        value: 'dual',
      },
      where: {
        type: 'WHERE',
        value: {
          type: 'GREATER_THAN',
          left: {
            type: 'NUMERIC',
            value: 3,
          },
          right: {
            type: 'NUMERIC',
            value: 1,
          },
        },
      },
    },
  });

  expect(sql).toBe("SELECT 'Roberto' FROM dual WHERE 3 > 1");
});

test('Generate select with logical operator "and"', () => {
  const sql = codeGenerator({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'STRING',
          value: 'Roberto',
        },
      ],
      from: {
        type: 'IDENTIFIER',
        value: 'dual',
      },
      where: {
        type: 'WHERE',
        value: {
          type: 'AND',
          left: {
            type: 'EQUALS',
            left: {
              type: 'STRING',
              value: 'Roberto',
            },
            right: {
              type: 'STRING',
              value: 'Gonzales',
            },
          },
          right: {
            type: 'LESS_THAN',
            left: {
              type: 'NUMERIC',
              value: 3,
            },
            right: {
              type: 'NUMERIC',
              value: 1,
            },
          },
        },
      },
    },
  });

  expect(sql).toBe(
    "SELECT 'Roberto' FROM dual WHERE 'Roberto' = 'Gonzales' AND 3 < 1"
  );
});

test('Generate select with two and conditions in where clausule', () => {
  const sql = codeGenerator({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'STRING',
          value: 'Roberto',
        },
      ],
      from: {
        type: 'IDENTIFIER',
        value: 'dual',
      },
      where: {
        type: 'WHERE',
        value: {
          type: 'AND',
          left: {
            type: 'EQUALS',
            left: {
              type: 'STRING',
              value: 'Roberto',
            },
            right: {
              type: 'STRING',
              value: 'Gonzales',
            },
          },
          right: {
            type: 'OR',
            left: {
              type: 'LESS_THAN',
              left: {
                type: 'NUMERIC',
                value: 3,
              },
              right: {
                type: 'NUMERIC',
                value: 1,
              },
            },
            right: {
              type: 'GREATER_THAN_OR_EQUAL',
              left: {
                type: 'NUMERIC',
                value: 5,
              },
              right: {
                type: 'NUMERIC',
                value: 2,
              },
            },
          },
        },
      },
    },
  });

  expect(sql).toBe(
    "SELECT 'Roberto' FROM dual WHERE 'Roberto' = 'Gonzales' AND 3 < 1 OR 5 >= 2"
  );
});

test('Generate select with parenthesis on where clausule', () => {
  const sql = codeGenerator({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'STRING',
          value: 'Roberto',
        },
      ],
      from: {
        type: 'IDENTIFIER',
        value: 'dual',
      },
      where: {
        type: 'WHERE',
        value: {
          type: 'AND',
          left: {
            type: 'EQUALS',
            left: {
              type: 'STRING',
              value: 'Roberto',
            },
            right: {
              type: 'STRING',
              value: 'Gonzales',
            },
          },
          right: {
            type: 'PARENTHESIS',
            value: {
              type: 'OR',
              left: {
                type: 'LESS_THAN',
                left: {
                  type: 'NUMERIC',
                  value: 3,
                },
                right: {
                  type: 'NUMERIC',
                  value: 1,
                },
              },
              right: {
                type: 'GREATER_THAN_OR_EQUAL',
                left: {
                  type: 'NUMERIC',
                  value: 5,
                },
                right: {
                  type: 'NUMERIC',
                  value: 2,
                },
              },
            },
          },
        },
      },
    },
  });

  expect(sql).toBe(
    "SELECT 'Roberto' FROM dual WHERE 'Roberto' = 'Gonzales' AND (3 < 1 OR 5 >= 2)"
  );
});

test('Generate select with where and clausule', () => {
  const sql = codeGenerator({
    type: 'SELECT',
    value: {
      columns: [
        {
          type: 'STRING',
          value: 'Roberto',
        },
      ],
      from: {
        type: 'IDENTIFIER',
        value: 'dual',
      },
      where: {
        type: 'WHERE',
        value: {
          type: 'EQUALS',
          left: {
            type: 'STRING',
            value: 'Roberto',
          },
          right: {
            type: 'STRING',
            value: 'Gonzales',
          },
        },
      },
    },
  });

  expect(sql).toBe("SELECT 'Roberto' FROM dual WHERE 'Roberto' = 'Gonzales'");
});

test('Generate SQL union two select', () => {
  const sql = codeGenerator({
    type: ReservedWord.UNION,
    left: {
      type: 'SELECT',
      value: {
        columns: [
          {
            type: 'STRING',
            value: 'Roberto',
          },
        ],
        from: {
          type: 'IDENTIFIER',
          value: 'dual',
        },
        where: {
          type: 'WHERE',
          value: {
            type: 'EQUALS',
            left: {
              type: 'STRING',
              value: 'Roberto',
            },
            right: {
              type: 'STRING',
              value: 'Gonzales',
            },
          },
        },
      },
    },
    right: {
      type: 'SELECT',
      value: {
        columns: [
          {
            type: 'STRING',
            value: 'Roberto',
          },
        ],
        from: {
          type: 'IDENTIFIER',
          value: 'dual',
        },
        where: {
          type: 'WHERE',
          value: {
            type: 'EQUALS',
            left: {
              type: 'STRING',
              value: 'Roberto',
            },
            right: {
              type: 'STRING',
              value: 'Gonzales',
            },
          },
        },
      },
    },
  });

  expect(sql).toBe(
    "SELECT 'Roberto' FROM dual WHERE 'Roberto' = 'Gonzales' UNION SELECT 'Roberto' FROM dual WHERE 'Roberto' = 'Gonzales'"
  );
});

test('Generate SQL union all two select', () => {
  const sql = codeGenerator({
    type: Other.UNION_ALL,
    left: {
      type: 'SELECT',
      value: {
        columns: [
          {
            type: 'STRING',
            value: 'Roberto',
          },
        ],
        from: {
          type: 'IDENTIFIER',
          value: 'dual',
        },
        where: {
          type: 'WHERE',
          value: {
            type: 'EQUALS',
            left: {
              type: 'STRING',
              value: 'Roberto',
            },
            right: {
              type: 'STRING',
              value: 'Gonzales',
            },
          },
        },
      },
    },
    right: {
      type: 'SELECT',
      value: {
        columns: [
          {
            type: 'STRING',
            value: 'Roberto',
          },
        ],
        from: {
          type: 'IDENTIFIER',
          value: 'dual',
        },
        where: {
          type: 'WHERE',
          value: {
            type: 'EQUALS',
            left: {
              type: 'STRING',
              value: 'Roberto',
            },
            right: {
              type: 'STRING',
              value: 'Gonzales',
            },
          },
        },
      },
    },
  });

  expect(sql).toBe(
    "SELECT 'Roberto' FROM dual WHERE 'Roberto' = 'Gonzales' UNION ALL SELECT 'Roberto' FROM dual WHERE 'Roberto' = 'Gonzales'"
  );
});

test('Try generate SQL with invalid node type', () => {
  expect(() => {
    codeGenerator({
      type: 'INVALID_TYPE',
      value: {
        columns: [
          {
            type: 'STRING',
            value: 'Roberto',
          },
        ],
        from: {
          type: 'IDENTIFIER',
          value: 'dual',
        },
        where: {
          type: 'WHERE',
          value: {
            type: 'EQUALS',
            left: {
              type: 'STRING',
              value: 'Roberto',
            },
            right: {
              type: 'STRING',
              value: 'Gonzales',
            },
          },
        },
      },
    });
  }).toThrow("Unsupported node (it's cannot be found as a handled type) ");
});
