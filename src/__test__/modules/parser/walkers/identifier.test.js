import Delimiter from '../../../../constants/delimiter.mjs';
import Other from '../../../../constants/other.mjs';
import {
  isQuote,
  isStringLiteral,
} from '../../../../modules/parser/walkers/identifier.mjs';

test('Verify if token is quote (not quote)', () => {
  const token = {
    type: Delimiter.getKeyFromValue(Delimiter.COMMA),
  };

  expect(isQuote(token)).toBe(false);
});

test('Verify if token is quote (valid single quote)', () => {
  const token = {
    type: Delimiter.getKeyFromValue(Delimiter.QUOTE),
  };

  expect(isQuote(token)).toBe(true);
});

test('Verify if token is quote (valid double quote)', () => {
  const token = {
    type: Delimiter.getKeyFromValue(Delimiter.DOUBLE_QUOTE),
  };

  expect(isQuote(token)).toBe(true);
});

test('Validate is string literal (one token Identifier)', () => {
  const tokens = [
    {
      type: Other.IDENTIFIER,
    },
  ];

  expect(isStringLiteral(tokens, 0)).toBe(false);
});

test('Validate is string literal with double quotes', () => {
  const tokens = [
    {
      type: Delimiter.getKeyFromValue(Delimiter.DOUBLE_QUOTE),
    },
    {
      type: Other.IDENTIFIER,
    },
    {
      type: Delimiter.getKeyFromValue(Delimiter.DOUBLE_QUOTE),
    },
  ];

  expect(isStringLiteral(tokens, 1)).toBe(true);
});

test('Validate is string literal with quote', () => {
  const tokens = [
    {
      type: Delimiter.getKeyFromValue(Delimiter.QUOTE),
    },
    {
      type: Other.IDENTIFIER,
    },
    {
      type: Delimiter.getKeyFromValue(Delimiter.QUOTE),
    },
  ];

  expect(isStringLiteral(tokens, 1)).toBe(true);
});
