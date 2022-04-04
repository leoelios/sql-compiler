import { nonBlank } from '../utils/string.mjs';
import AbstractConstant from './abstract-constant.mjs';

/**
 * Represents the delimiter used to separate the SQL in parts
 */
export default class Delimiter extends AbstractConstant {
  static COMMA = ',';
  static LEFT_PARENTHESIS = '(';
  static RIGHT_PARENTHESIS = ')';
  static QUOTE = "'";
  static DOUBLE_QUOTE = '"';

  /**
   * @param {String} sql SQL to separe delimiter from other tokens.
   * @return {Array<String>} SQL with delimiter separated by SPACE.
   */
  static separeByDelimiter(sql) {
    let newSQL = sql;

    this._getAllFields().forEach(field => {
      newSQL = newSQL.replaceAll(field.value, ` ${field.value} `);
    });

    return newSQL.split(' ').filter(nonBlank);
  }
}
