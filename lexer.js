const moo = require("moo");

const lexer = moo.compile({
    string: /'[^']*'/,
    xfx: /:-|-->|o-|,/,
    // xf: /,/,
    whitespace: { match: /\s*(?:%.*|\/\*(?:\n|\r|.)*?\*\/|\s+)\s*/, lineBreaks: true },
    variable: /[A-Z_][a-zA-Z0-9_]*/,
    dot: /\./,
    // comma: /\,/,
    atom: /!|,|;|[a-z][0-9a-zA-Z_]*|[#\$\&\*\+\-\.\/\:\<\=\>\?@\^\~\\]+|’(?: [^’] *? (?: \\(?: x ?\d +)?\\)* (?: ’’)* (?: \\’)*)*’/,
    number: /\d+/,
    lbrace: /\[/,
    rbrace: /\]/,
    lbracket: /\{/,
    rbracket: /\}/,
    lparen: /\(/,
    rparen: /\)/,
    bar: /\|/,

    // error: /./,
});

module.exports = lexer