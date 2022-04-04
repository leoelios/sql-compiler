import AbstractConstant from "./abstract-constant.mjs";

/**
 * Disposable symbols that can be used to compare values.
 */
export default class Comparator extends AbstractConstant {
  static EQUALS = '=';
  static NOT_EQUALS = '!=';
  static GREATER_THAN = '>';
  static GREATER_THAN_OR_EQUAL = '>=';
  static LESS_THAN = '<';
  static LESS_THAN_OR_EQUAL = '<=';
}
