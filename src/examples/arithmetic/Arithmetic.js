var arithmetic = Parser()
    .lex(/\+/,'+')
    .lex(/\-/,'-')
    .lex(/\*/,'*')
    .lex(/\//,'/')
    .lex(/\^/,'^')
    .lex(/!/,'!')
    .lex(/\(/,'(')
    .lex(/\)/,')')
    .lex(/\d+(?:\.\d+)?/,'(num)')
    .lex(/\x20+/,'(sp)')

    .prefix('+',10)  .prefix('-',10)
    
    .infix('+',2) .infix('-',2)  .infix('*',4)  .infix('/',4)

    .infixR('^',6)

    .literal('(num)')

    .postfix('!',6)

    .group('(',')')

    .skip('(sp)')