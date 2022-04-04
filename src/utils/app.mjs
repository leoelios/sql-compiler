import { Type } from '../constants/type.mjs';

export const isNotEmptySpace = token => token.type !== Type.EMPTY_SPACE;

export const varName = obj => Object.keys(obj)[0];
