var arithmetic = Parser({
    '+': {
        pattern: /\+/,
        infix: {id:'ADD',lbp:2},
        prefix: {id:'POS',rbp:10}
    },
    '-': {
        pattern: /\-/,
        infix: {id:'SUB',lbp:2},
        prefix: {id:'NEG',rbp:10}
    },
    '*': {
        pattern: /\*/,
        infix: {id:'MUL',lbp:4}
    },
    '/': {
        pattern:/\//,
        infix: {id:'DIV',lbp:4}
    },
    '^': {
        pattern: /\^/,
        infixR: {id:'POW',lbp:6}
    },
    '!': {
        pattern:/!/,
        postfix: {id:'FACT',lbp:6}
    },
    '(num)': {
        pattern: /\d+(?:\.\d+)?/,
        literal: {}
    }/*,
    '(': {
        pattern: /\(/
        //TODO (nud: 10)
    },
    ')': {
        pattern: /\)/
        //TODO
    },
    '(sp)': {
        pattern: /\x20+/
        //TODO
    }*/
});