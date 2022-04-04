import Command from '../../../constants/command.mjs';
import Comparator from '../../../constants/comparator.mjs';
import Delimiter from '../../../constants/delimiter.mjs';
import Operator from '../../../constants/operator.mjs';
import Other from '../../../constants/other.mjs';
import ReservedWord from '../../../constants/reserved-words.mjs';
import { walk } from '../parser.mjs';
import { isQuote } from './identifier.mjs';

/**
 * @param {*} tokens Tokens to be analyzed.
 * @param {*} index Index of current token.
 * @return {Boolean} If the current token is the init of WHERE clausule.
 */
export function isWhere(tokens, index) {
  return tokens[index]?.type === ReservedWord.WHERE;
}

const walkWhereParts = (tokens, index) => {
  let comparation;

  while (!ReservedWord.isEndOfWhere(tokens[index])) {
    if (Operator.isLogical(tokens[index]?.type)) {
      return {
        type: tokens[index].type,
        left: comparation,
        right: walkWhereParts(tokens, index + 1),
      };
    }

    if (Comparator.is(tokens[index + 1]?.type)) {
      const rightIndex = isQuote(tokens[index + 2]) ? 3 : 2;
      const { value: right } = walk(tokens, index + rightIndex);

      comparation = {
        type: tokens[index + 1].type,
        left: tokens[index],
        right,
      };
      index += rightIndex === 3 ? 4 : 3;
    } else {
      index++;
    }
  }

  return comparation;
};

/**
 * @param {Array<Token>} parts Tokens to be analyzed that are part of Select column.
 * @return {Object} The AST (Abstract Syntax Tree) of column.
 */
export function processColumn({ parts, alias }) {
  if (
    parts.some(({ type }) => Operator.getKeyFromValue(Operator.CONCAT) === type)
  ) {
    return {
      type: Other.CONCATENATION,
      value: parts.filter(
        ({ type }) => Operator.getKeyFromValue(Operator.CONCAT) !== type
      ),
      alias,
    };
  }

  if (
    parts.length >= 3 &&
    parts[0]?.type === Other.IDENTIFIER &&
    parts[1]?.type === Delimiter.getKeyFromValue(Delimiter.LEFT_PARENTHESIS)
  ) {
    const args = parts.slice(2, parts.indexOf(Delimiter.RIGHT_PARENTHESIS));

    return {
      type: Other.FUNCTION_CALL,
      value: {
        name: parts[0].value,
        arguments: args,
      },
      alias,
    };
  }

  if (
    parts[0]?.type === Delimiter.getKeyFromValue(Delimiter.LEFT_PARENTHESIS)
  ) {
    const subTokens = parts.slice(
      1,
      parts.indexOf({
        type: Delimiter.getKeyFromValue(Delimiter.RIGHT_PARENTHESIS),
        value: Delimiter.RIGHT_PARENTHESISI,
      })
    );

    return {
      type: Other.PARENTHESIS,
      value: subTokens[0],
      alias,
    };
  }

  if (parts.length === 1) {
    return {
      type: parts[0].type,
      value: parts[0].value,
      alias,
    };
  }

  throw new Error('Unsupported column type: ' + JSON.stringify(parts));
}

/**
 * @param {*} tokens Tokens to be analyzed.
 * @param {*} index Current index of the token to be analyzed.
 * @return {*} If exist an alias, return the alias or undefined;
 */
export function getObjectAlias(tokens, index) {
  if (tokens[index]?.type === Command.AS) {
    return {
      type: Other.AS_ALIAS,
      value: tokens[index + 1],
    };
  }

  if (
    tokens[index]?.type === Other.IDENTIFIER &&
    tokens[index - 2]?.type === ReservedWord.FROM
  ) {
    return {
      type: Other.SHORT_ALIAS,
      value: tokens[index].value,
    };
  }
}

export default (tokens, index) => {
  const walkColumns = () => {
    const columns = [];
    let columnTmp;
    index++;

    const reset = () => {
      columnTmp = undefined;
    };

    const addColumn = (column, nextIndex) => {
      if (!columnTmp) {
        columnTmp = {
          columns: [column],
        };
      } else {
        columnTmp.columns.push(column);
      }
      index = nextIndex;
    };

    const addAlias = ({ value: alias }) => {
      columnTmp.alias = alias;
    };

    const buildColumn = () => {
      const { columns: parts, alias } = columnTmp;

      columns.push(
        processColumn({
          parts,
          alias,
        })
      );
      reset();
    };

    while (tokens[index]?.type !== ReservedWord.FROM) {
      if (tokens[index]?.type === Delimiter.getKeyFromValue(Delimiter.COMMA)) {
        buildColumn();
      } else if (tokens[index]?.type === ReservedWord.AS) {
        addAlias(walk(tokens, ++index).value);
      } else if (!isQuote(tokens[index])) {
        const { value: column, index: asd } = walk(tokens, index);
        addColumn(column, asd);
      }
      index++;
    }

    buildColumn();

    return columns;
  };

  const walkFrom = () => {
    index++;

    const { value: from } = walk(tokens, index);

    index++;

    const { value: alias, type: aliasType } =
      getObjectAlias(tokens, index) || {};

    switch (aliasType) {
      case Other.AS_ALIAS:
        index += 2;
        break;
      case Other.SHORT_ALIAS:
        index++;
    }

    return {
      type: Other.IDENTIFIER,
      value: from.value,
      alias: alias,
    };
  };

  const walkWhere = () => {
    return {
      type: ReservedWord.WHERE,
      value: walkWhereParts(tokens, ++index),
    };
  };

  return {
    value: {
      type: Command.SELECT,
      value: {
        columns: walkColumns(),
        from: walkFrom(),
        where: isWhere(tokens, index) ? walkWhere() : undefined,
      },
    },
    index: index - 1,
  };
};
