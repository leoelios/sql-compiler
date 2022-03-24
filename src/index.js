import codeGenerator from "./modules/code-generator.js";
import parser from "./modules/parser.mjs";
import tokenizer from "./modules/tokenizer.mjs";

const tokens = tokenizer(`
  Select 'Leonardo' as nome, 'Silva' as sobrenome, '123456789' as cpf
    from dual
`);

const ast = parser(tokens);
const code = codeGenerator(ast);

console.log(code);
