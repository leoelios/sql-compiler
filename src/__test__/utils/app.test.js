const { Type } = require('../../constants/type.mjs');
const { isNotEmptySpace, filterExtraSpaces } = require('../../utils/app.mjs');

test('Validate if node not is an empty type (is empty)', () => {
  expect(isNotEmptySpace({ type: Type.EMPTY_SPACE })).toBe(false);
});

test('Validate if node not is an empty type (All other types)', () => {
  const otherTypes = Type.typesWithoutEmptySpace;

  otherTypes.forEach(type => {
    expect(isNotEmptySpace({ type })).toBe(true);
  });
});

test('Remove extra spaces from string', () => {
  const tokens = ['dls', '', '', '', 'é', 'maravilhoso'];

  expect(tokens.filter(filterExtraSpaces)).toEqual([
    'dls',
    '',
    'é',
    'maravilhoso',
  ]);
});

test('Filter whitespace from string without whitespace', () => {
  const tokens = ['dls', 'é', 'maravilhoso'];

  expect(tokens.filter(filterExtraSpaces)).toEqual(['dls', 'é', 'maravilhoso']);
});
