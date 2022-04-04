import AbstractConstant from './abstract-constant.mjs';

/**
 * Reserved words that can be found in SQL Language, but primary this will be @link unknown.
 */
export default class ReservedWord extends AbstractConstant {
  static AS = 'AS';
  static FROM = 'FROM';
  static ALL = 'ALL';
  static GROUP = 'GROUP';
  static BY = 'BY';
  static ORDER = 'ORDER';
  static WHERE = 'WHERE';
  static UNION = 'UNION';
  static LIMIT = 'LIMIT';

  /**
   * @return {Array<string>} all types of tokens that can indicate a final of WHERE clausule.
   */
  static getWhereEndWords() {
    return [this.UNION, this.ALL, this.LIMIT, this.ORDER];
  }

  /**
   * @param {*} token Token to be checked.
   * @return {Boolean} If the token is a type of token that can indicate a final of WHERE clausule.
   */
  static isEndOfWhere(token) {
    return !token || this.getWhereEndWords().includes(token?.type);
  }
}
