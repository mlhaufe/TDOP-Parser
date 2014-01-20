var lexer = new Lexer({
    '+': [/\+/, Lexer.defaultAction],
    '-': [/\-/, Lexer.defaultAction],
    '*': [/\*/, Lexer.defaultAction],
    '/': [/\//, Lexer.defaultAction],
    '^': [/^/, Lexer.defaultAction],
    'LPAREN': [/\(/, Lexer.defaultAction],
    'RPAREN': [/\)/, Lexer.defaultAction],
    'SPACE': [/\x20/, Lexer.defaultAction],
    'NUM': [/\d+(?:\.\d+)?/, function(match,position){
        return new Lexer.Token('NUM', position, match[0]);
    }],
    'EOF': [ /$/,  Lexer.nullAction]
});