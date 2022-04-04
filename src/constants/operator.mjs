import AbstractConstraint from './abstract-constant.mjs';

/**
 * Representation of operator symbols.
 */
export default class Operator extends AbstractConstraint {
  static PLUS = '+';
  static MINUS = '-';
  static DIVIDE = '/';
  static MODULO = '%';
  static WILDCARD = '*';
  static UNION = 'UNION';
  static CONCAT = '||';
  static AND = 'AND';
  static OR = 'OR';

  /**
   * @param {*} key Key of operator to be analyzed.
   * @return {Boolean} If the operator is of logical type.
   */
  static isLogical(key) {
    return [
      this.getKeyFromValue(this.AND),
      this.getKeyFromValue(this.OR),
    ].includes(key);
  }
}
