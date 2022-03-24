import codeGenerator from './modules/code-generator.js';
import parser from './modules/parser.mjs';
import tokenizer from './modules/tokenizer.mjs';

const tokens = tokenizer(`
SELECT name, age FROM person
`);

const ast = parser(tokens);
const code = codeGenerator(ast);

console.log(code);
