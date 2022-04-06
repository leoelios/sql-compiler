import AbstractConstant from './abstract-constant.mjs';

/**
 * Generics token type.
 */
export default class Other extends AbstractConstant {
  static IDENTIFIER = 'IDENTIFIER';
  static QUOTED_IDENTIFIER = 'QUOTED_IDENTIFIER';
  static NUMERIC = 'NUMERIC';
  static STRING = 'STRING';
  static CONCATENATION = 'CONCATENATION';
  static UNIQUE = 'UNIQUE';
  static FUNCTION_CALL = 'FUNCTION_CALL';
  static SHORT_ALIAS = 'SHORT_ALIAS';
  static AS_ALIAS = 'AS_ALIAS';
  static PARENTHESIS = 'PARENTHESIS';
  static UNION_ALL = 'UNION_ALL';
}
