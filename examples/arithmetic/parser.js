var arithmetic = new Parser({
    '+': {
        lexer: [/\+/],
        lbp: 2,
        rbp: 10,
        infix: Add,
        prefix: Pos
    },
    '-': {
        lexer: [/\-/],
        lbp: 2,
        rbp: 10,
        infix: Sub,
        prefix: Neg
    },
    '*': {
        lexer: [/\*/],
        lbp: 4,
        infix: Mul
    },
    '/': {
        lexer: [/\\/],
        lbp: 4,
        infix: Div
    },
    '^': {
        lexer: [/\^/],
        lbp: 6,
        infixR: Pow
    },
    '!': {
        lexer: [/!/],
        lbp: 6,
        suffix: Fact
    },
    'num': {
        lexer: [/\d+(?:\.\d+)?/],
        literal: Num
    },
    '(': {
        lexer: [/\(/],
        rbp: 10,
        nud: function(){
            var e = this.parseExpression(),
                s = this.advance(')');
            return e;
        }
    },
    ')': {
        lexer: [/\)/]
    },
    'sp': {
        lexer: [/\x20/,function(position,match){
            var len = match[0].length;
            position.index += len;
            position.col += len;
            return arithmetic.advance();
        }]
    },
    'lt': {
        lexer: [/\r\n?/,function(position,match){
            var len = match[0].length;
            position.index += len;
            position.col = 1;
            position.line++;
            return arithmetic.advance();
        }]
    },
    'unknown': {
        lexer: [/[\s\S]/],
        literal: UNK
    }
});