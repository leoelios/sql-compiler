import { Type } from '../constants/type.mjs';

export const removeEmptySpace = token => token.type !== Type.EMPTY_SPACE;
