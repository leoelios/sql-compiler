/**
 * A type of token available in the SQL language.
 */
export class Type {
  static EMPTY_SPACE = 'empty_space';
  static SELECT_STATEMENT = 'select_statement';
  static UNION = 'union';
  static UNION_ALL = 'union_all';
  static WHERE = 'where';
  static FROM_STATEMENT = 'from_statement';
  static WHERE_STATEMENT = 'where_statement';
  static ORDER_BY_STATEMENT = 'order_by_statement';
  static LIMIT_STATEMENT = 'limit_statement';
  static CONCAT_OPERATOR = 'concat_operator';
  static COMMA_DELIMITER = 'comma_delimiter';
  static STRING_LITERAL = 'string_literal';
  static FUNCTION_CALL = 'function_call';
  static UNKNOWN = 'unknown';
  static ASTERISK = 'asterisk';
  static ALL = 'all';

  /**
   * @return {Array<string>} all types of tokens that can indicate a final of WHERE clausule.
   */
  static getWhereEndWords() {
    return [
      Type.UNION,
      Type.ALL,
      Type.LIMIT_STATEMENT,
      Type.ORDER_BY_STATEMENT,
    ];
  }

  /**
   * @param {*} token Token to be checked.
   * @return {Boolean} If the token is a type of token that can indicate a final of WHERE clausule.
   */
  static isEndOfWhere(token) {
    return Type.getWhereEndWords().includes(token?.type?.toLowerCase());
  }

  /**
   * @return {Array<string>} all types of tokens declareted disregarding the empty space.
   */
  static get typesWithoutEmptySpace() {
    return Object.values(Type).filter(type => type !== Type.EMPTY_SPACE);
  }
}

export const tokenTypes = {
  '': Type.EMPTY_SPACE,
  ',': Type.COMMA_DELIMITER,
  SELECT: Type.SELECT_STATEMENT,
  FROM: Type.FROM_STATEMENT,
  WHERE: Type.WHERE_STATEMENT,
  ALL: Type.ALL,
  UNION: Type.UNION,
  WHERE: Type.WHERE,
  'ORDER BY': Type.ORDER_BY_STATEMENT,
  LIMIT: Type.LIMIT_STATEMENT,
  '||': Type.CONCAT_OPERATOR,
  '*': Type.ASTERISK,
};
