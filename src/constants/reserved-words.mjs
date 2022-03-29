/**
 * Reserved words that can be found in SQL Language, but primary this will be @link unknown.
 *
 */
export class ReservedWord {
  static AS = 'AS';
  static EQUALS = '=';
  static AND = 'AND';
  static OR = 'OR';

  /**
   * Conjuctors reserved words
   */
  static get conjunctors() {
    return [ReservedWord.AND, ReservedWord.OR];
  }
}
