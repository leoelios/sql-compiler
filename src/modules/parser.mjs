import { ReservedWord } from '../constants/reserved-words.mjs';
import { Type, tokenTypes } from '../constants/type.mjs';
import { isNotEmptySpace } from '../utils/app.mjs';

export default tokens => syntaticAnalysis(lexer(tokens));

/**
 * @param {*} tokens Tokens to be analyzed.
 * @param {*} index Index of current token.
 * @return {Boolean} If the current token is the init of WHERE clausule.
 */
export function isWhere(tokens, index) {
  return tokens[index]?.type === Type.WHERE;
}

/**
 * @param {Array<String>} tokens an array of tokens.
 * @param {Integer} index index of the token to be analyzed.
 * @return {Boolean} If the current token is an union operator.
 */
export function isUnion(tokens, index) {
  return (
    tokens[index]?.type === Type.UNION ||
    (tokens[index]?.type === Type.UNION && tokens[index + 1]?.type === Type.ALL)
  );
}

/**
 * @param {*} token current token.
 * @param {*} conjuntion The conjunctor to be used (e.g. AND or OR).
 * @return {Boolean} If the current token is an and conjunctor.
 */
export function isConjunction(token, conjuntion) {
  return (
    (token.type === Type.UNKNOWN &&
      token?.value?.toUpperCase() === conjuntion) ||
    (token.type === Type.UNKNOWN &&
      !conjuntion &&
      ReservedWord.conjunctors.includes(token?.value?.toUpperCase()))
  );
}

/**
 * @param {Array<String>} tokens an array of tokens.
 * @param {Integer} index current index of the token to be analyzed.
 * @return {Type} the type of the union operator (e. g. UNION, UNION_ALL).
 */
export function getUnionType(tokens, index) {
  return tokens[index]?.type === Type.UNION &&
    tokens[index + 1]?.type === Type.ALL
    ? Type.UNION_ALL
    : Type.UNION;
}

/**
 * Make the lexical analysis of the tokens.
 *
 * @param {Array<String>} tokens Tokens to be analyzed.
 * @return {Array<Object>} The AST (Abstract Syntax Tree).
 */
export function lexer(tokens) {
  const isString = token => token.startsWith("'") && token.endsWith("'");
  const isFunctionCall = token => token.match(/^([a-zA-Z0-9_]+)\((.*)\)$/);

  return tokens.map(token => {
    if (isString(token)) {
      return {
        type: Type.STRING_LITERAL,
        value: token.slice(1, -1),
      };
    }

    if (isFunctionCall(token)) {
      return {
        type: Type.FUNCTION_CALL,
        value: token,
      };
    }

    return {
      type: tokenTypes[token.toUpperCase()] || Type.UNKNOWN,
      value: token,
    };
  });
}

/**
 * Make the syntatic analysis of the "lexed" tokens.
 *
 * @param {List<Object>} tokens tokens.
 * @return {List<Object>} The AST (Abstract Syntax Tree).
 */
export function syntaticAnalysis(tokens) {
  const processUniqueColumn = column => {
    if (column.type === Type.FUNCTION_CALL) {
      return column;
    }

    return {
      type: column.type,
      value: column.value,
    };
  };

  const processColumnValueFromParts = columnParts => {
    if (columnParts.some(part => part.type === Type.CONCAT_OPERATOR)) {
      return {
        type: 'concatenation',
        elements: columnParts.filter(
          part => part.type !== Type.CONCAT_OPERATOR
        ),
      };
    }

    if (columnParts.length === 1) {
      return processUniqueColumn(columnParts[0]);
    }
  };

  const walk = (tokens, index) => {
    const token = tokens[index];
    const lastToken = tokens[index - 1];
    const nextToken = tokens[index + 1];

    if (token.type === Type.FUNCTION_CALL) {
      const value = token.value;

      const functionName = value.substring(0, value.indexOf('('));

      const functionArguments = value
        .substring(value.indexOf('(') + 1, value.indexOf(')'))
        .split(',');

      return {
        type: 'function_call',
        name: functionName,
        arguments: functionArguments,
      };
    }

    if (token.type == Type.CONCAT_OPERATOR) {
      return token;
    }

    if (token.type == Type.STRING_LITERAL) {
      return {
        type: 'string_literal',
        value: token.value,
      };
    }

    if (token.type === Type.ASTERISK) {
      return {
        type: 'asterisk',
        value: token.value,
      };
    }

    if (token.type === Type.UNKNOWN) {
      if (
        lastToken.type === Type.UNKNOWN &&
        lastToken.value.toUpperCase() === ReservedWord.AS
      ) {
        return {
          type: 'alias_value',
          value: token.value,
        };
      }

      if (
        nextToken?.type === Type.UNKNOWN &&
        nextToken?.value.toUpperCase() === ReservedWord.EQUALS
      ) {
        const idx = index + 2;

        return {
          idx,
          element: {
            type: 'equals',
            left: tokens[index],
            right: walk(tokens, idx),
          },
        };
      }

      if (token.value.toUpperCase() === ReservedWord.AS) {
        return {
          type: 'column_alias',
          value: walk(tokens, index + 1),
        };
      }

      if (lastToken.type === Type.FROM_STATEMENT) {
        return {
          type: 'from_object',
          value: token.value,
        };
      }

      return {
        type: 'object_value',
        value: token.value,
      };
    }

    if (token.type === Type.SELECT_STATEMENT) {
      let i = index + 1;
      const columns = [];
      let columnParts = [];
      let alias = null;

      while (tokens[i].type !== Type.FROM_STATEMENT) {
        if (tokens[i].type === Type.COMMA_DELIMITER) {
          columns.push({
            type: 'column',
            columnValue: processColumnValueFromParts(columnParts),
            alias,
          });
          alias = null;
          columnParts = [];
        } else if (
          tokens[i].type === Type.UNKNOWN &&
          tokens[i].value.toUpperCase() === ReservedWord.AS
        ) {
          alias = walk(tokens, i);
        } else {
          const element = walk(tokens, i);
          if (element.type !== 'alias_value') columnParts.push(element);
        }
        i++;
      }

      if (columnParts.length > 0) {
        columns.push({
          type: 'column',
          columnValue: processColumnValueFromParts(columnParts),
          alias,
        });
      }

      const currentSelect = {
        type: 'select',
        columns: columns,
        from: walk(tokens, ++i),
      };

      if (isWhere(tokens, i + 1)) {
        const { idx, value } = walk(tokens, i + 1);
        currentSelect.where = value;
        i = idx - 1;
      }

      if (!isUnion(tokens, ++i)) {
        return currentSelect;
      }

      const unionType = getUnionType(tokens, i);

      index = unionType === Type.UNION_ALL ? i + 2 : i + 1;

      return {
        type: unionType,
        left: currentSelect,
        right: walk(tokens, index++),
      };
    }

    if (token.type === Type.WHERE) {
      let condition;
      let conjunction;
      let i = index + 1;

      const walkConjunction = () => {
        const { element, idx } = walk(tokens, i + 1);
        const conjunctionType = tokens[i].value?.toLowerCase();

        if (!conjunction) {
          conjunction = {
            type: conjunctionType,
            left: condition,
            right: element,
          };
        } else {
          conjunction.right = {
            type: conjunctionType,
            left: conjunction.right,
            right: element,
          };
        }

        i = idx;
        condition = undefined;
      };

      while (tokens[i] && !Type.isEndOfWhere(tokens[i])) {
        if (isConjunction(tokens[i])) {
          walkConjunction();
        } else {
          const { element, idx } = walk(tokens, i);
          i = idx;
          condition = element;
        }
        i++;
      }

      if (condition) {
        conjunction = condition;
      }

      return {
        idx: i,
        value: {
          type: 'where',
          conjunction,
        },
      };
    }
  };

  return walk(tokens.filter(isNotEmptySpace), 0);
}
