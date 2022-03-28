const { Type } = require('../../constants/type.mjs');

test('Get all token types without empty space token', () => {
  const otherTypes = Type.typesWithoutEmptySpace;

  otherTypes.forEach(type => {
    expect(type !== Type.EMPTY_SPACE).toBeTruthy();
  });
});
