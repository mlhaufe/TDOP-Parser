var arithmetic = Parser({
    '+': {
        pattern: /\+/,
        lbp: 2,
        rbp: 10,
        led: Parser.infix('ADD'),
        nud: Parser.prefix('POS')
    },
    '-': {
        pattern: /\-/,
        lbp:2,
        rbp:10,
        led: Parser.infix('SUB'),
        nud: Parser.prefix('NEG')
    },
    '*': {
        pattern: /\*/,
        lbp: 4,
        led: Parser.infix('MUL')
    },
    '/': {
        pattern: /\//,
        lbp: 4,
        led: Parser.infix('DIV')
    },
    '^': { 
        pattern: /\^/,
        lbp: 6,
        led: Parser.infixR('POW')
    },
    '!': {
        pattern:/!/,
        lbp: 6,
        led: Parser.postfix('FACT')
    },
    '(num)': {
        pattern: /\d+(?:\.\d+)?/,
        nud: Parser.literal('(num)')
    },
    '(': {
        pattern: /\(/,
        rbp: 10,
        nud: function(){
            var e = this.parser.parseExpression(0);
            this.parser.advance(')');
            return e;
        }
    },
    ')': {
        pattern: /\)/
    },
    '(sp)': {
        pattern: /\x20+/,
        nud: function(){
            this.parser.advance();
            return this.parser.curToken.nud();
        },
        led: function(left){
            return this.parser.curToken.led(left);
        }
    }/*,
    '(lt): {
        nud: function(){
            //TODO
        }
    }'*/
});