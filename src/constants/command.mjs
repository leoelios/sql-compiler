import AbstractConstant from "./abstract-constant.mjs";

/**
 * Available SQL commands.
 */
export default class Command extends AbstractConstant {
  static SELECT = 'SELECT';
  static INSERT = 'INSERT';
  static UPDATE = 'UPDATE';
  static DELETE = 'DELETE';
  static CREATE = 'CREATE';
  static DROP = 'DROP';
  static ALTER = 'ALTER';
  static TRUNCATE = 'TRUNCATE';
  static GRANT = 'GRANT';
  static REVOKE = 'REVOKE';
  static SET = 'SET';
  static SHOW = 'SHOW';
  static USE = 'USE';
  static EXPLAIN = 'EXPLAIN';
  static DESCRIBE = 'DESCRIBE';
  static ANALYZE = 'ANALYZE';
  static OPTIMIZE = 'OPTIMIZE';
  static BACKUP = 'BACKUP';
  static RESTORE = 'RESTORE';
  static START = 'START';
  static STOP = 'STOP';
}
