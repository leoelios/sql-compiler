/**
 * Class with utils methods for get type of a token with more facilites.
 */
export default class AbstractConstant {
  /**
   * @return {Array} All fields of the class.
   */
  static _getAllFields() {
    return Object.keys(this)
      .filter(key => typeof this[key] === 'string')
      .map(key => ({
        key,
        value: this[key],
      }));
  }

  /**
   * @param {String} value value of token.
   * @return {Constant} The type defined.
   */
  static getTypeFromValue(value) {
    return this._getAllFields().find(
      ({ value: fieldValue }) => fieldValue === value
    );
  }

  /**
   * @param {*} key Key of token.
   * @return {Boolean} if token is a constant.
   */
  static is(key) {
    const field = this._getAllFields().find(field => field.key === key);

    return !!field;
  }

  /**
   * @param {*} key key of token.
   * @return {String} value of type token.
   */
  static getValueFromKey(key) {
    const field = this._getAllFields().find(field => field.key === key);
    return field.value;
  }

  /**
   * @param {String} value value of token.
   * @return {Constant} The type defined.
   */
  static getKeyFromValue(value) {
    return this.getTypeFromValue(value)?.key;
  }
}
