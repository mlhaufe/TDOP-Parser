//requires: /src/Parser.js; ./ast.js
var parser = new Parser({
    '+': {
        lexer: [/\+/],
        prefix: [10,Pos],
        infix:[2,Add]
    },
    '-': {
        lexer: [/\-/],
        prefix: [10,Neg],
        infix: [2,Sub]
    },
    '*': {
        lexer: [/\*/],
        infix: [4,Mul]
    },
    '/': {
        lexer: [/\//],
        infix: [4,Div]
    },
    '^': {
        lexer: [/\^/],
        infixR: [6,Pow]
    },
    '!': {
        lexer: [/!/],
        postfix: [6,Fact]
    },
    'NUM': {
        lexer: [/\d+(?:\.\d+)?/],
        literal: Num
    },
    //FIXME: one-off error
    '(': {
        lexer: [/\(/],
        prefix: [10,function(position,value){
            parser.advance(')');
            return value;
        }]
    },
    ')': {
        lexer: [/\)/]
    },
    'LT': {
        lexer: [/\r\n?/,function(position,match){
            var len = match[0].length;
            position.index += len;
            position.col = 1;
            position.line++;
            return parser.advance();
        }]
    },
    'SP': {
        lexer: [/\x20/,function(position,match){
            var len = match[0].length;
            position.index += len;
            position.col += len;
            return parser.advance();
        }]
    },
    'UNK': {
        lexer: [/[\s\S]/],
        literal: Unk
    },
    'EOF': {
        lexer: [/$/],
        literal: Eof
    }
});