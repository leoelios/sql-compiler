import { isAlphanumeric } from './string.mjs';

export const isValidObjectName = objectName => {
  const acceptedChars = ['_', '"'];

  return (
    objectName.length > 0 &&
    (isAlphanumeric(objectName[0]) ||
      acceptedChars.some(char => char === objectName[0]))
  );
};
