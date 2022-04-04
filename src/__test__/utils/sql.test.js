import { isValidObjectName } from '../../utils/sql.mjs';

test('Is invalid object name empty string', () => {
  expect(isValidObjectName('')).toBe(false);
});

test('Is invalid object name alphanumeric', () => {
  expect(isValidObjectName('322123')).toBe(true);
});

test('Is invalid object name double quoted', () => {
  expect(isValidObjectName('"delimiter"')).toBe(true);
});

test('Is invalid object name with string starts with underscore', () => {
  expect(isValidObjectName('_asd')).toBe(true);
});
