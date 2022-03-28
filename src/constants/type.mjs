/**
 * A type of token available in the SQL language.
 */
export class Type {
  static EMPTY_SPACE = 'empty_space';
  static SELECT_STATEMENT = 'select_statement';
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
  'ORDER BY': Type.ORDER_BY_STATEMENT,
  LIMIT: Type.LIMIT_STATEMENT,
  '||': Type.CONCAT_OPERATOR,
  '*': Type.ASTERISK,
};
