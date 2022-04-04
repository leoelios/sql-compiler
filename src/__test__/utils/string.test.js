import { nonExtraWhiteSpace } from '../../utils/string.mjs';

test('Remove extra spaces from string', () => {
  const tokens = ['dls', '', '', '', 'é', 'maravilhoso'];

  expect(tokens.filter(nonExtraWhiteSpace)).toEqual([
    'dls',
    '',
    'é',
    'maravilhoso',
  ]);
});

test('Filter whitespace from string without whitespace', () => {
  const tokens = ['dls', 'é', 'maravilhoso'];

  expect(tokens.filter(nonExtraWhiteSpace)).toEqual([
    'dls',
    'é',
    'maravilhoso',
  ]);
});
