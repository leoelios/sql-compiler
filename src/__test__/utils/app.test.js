const { Type } = require('../../constants/type.mjs');
const { isNotEmptySpace } = require('../../utils/app.mjs');

test('Validate if node not is an empty type (is empty)', () => {
  expect(isNotEmptySpace({ type: Type.EMPTY_SPACE })).toBe(false);
});

test('Validate if node not is an empty type (All other types)', () => {
  const otherTypes = Type.typesWithoutEmptySpace;

  otherTypes.forEach(type => {
    expect(isNotEmptySpace({ type })).toBe(true);
  });
});
