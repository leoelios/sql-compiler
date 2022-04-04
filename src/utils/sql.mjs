import { isAlphanumeric } from './string.mjs';

export const isValidObjectName = objectName => {
  return (
    objectName.length > 0 &&
    (isAlphanumeric(objectName) ||
      (objectName.startsWith('_') && isAlphanumeric(objectName.substring(1))) ||
      (objectName.startsWith('"') &&
        isAlphanumeric(objectName.substring(1, objectName.length - 1)) &&
        objectName.endsWith('"')))
  );
};
