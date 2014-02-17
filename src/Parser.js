//TODO: Testing needed
var Parser = (function(){
    function Position(index, line, col){
        this.index = index;
        this.line = line;
        this.col = col;
    }
    Position.prototype = {
        clone: function(){
            return new Position(this.index, this.line, this.col);
        },
        toString: function(){
            return "{index:"+this.index+",line:"+this.line+",col:"+this.col+"}";
        }
    };

    function Lexer(id, regex, action){
        this.id = id;
        this.pattern = new RegExp("^("+regex.source+")");
        if(action) this.action = action;
    }
    Lexer.prototype = {
        constructor: Lexer,
        action: function(symbolTable, match, position){
            var t = symbolTable.create(this.id, position.clone(), match[0]),
                len = match[0].length;
            position.index += len;
            position.col += len;
            return t;
        },
        lex: function(src){
            this.match = this.pattern.exec(src);
        }
    };

    function hasOwn(o,p){ return Object.prototype.hasOwnProperty.call(o,p); }

    function defaultNud(){
        throw new TypeError(
            "'" + this.id + "' cannot appear at the beginning of an expression. Position: " + this.position
        );
    }

    function defaultLed(){
        throw new TypeError(
            "'" + this.id + "' cannot appear after the beginning of an expression. Position: " + this.position
        );
    }

    function SymbolTable(parent){
        this.symbols = Object.create(null);
        this.parent = parent;
    }
    SymbolTable.prototype = {
        constructor: SymbolTable,
        create: function(id,position,value){
            var symbolProto = this.symbols[id];
            if(symbolProto) {
                var t = Object.create(symbolProto);
                t.position = position;
                t.value = value;
                return t;
            } else {
                throw new TypeError("'" + id + "' is undefined");
            }
        },
        defSymbol: function(id, def){
            this.symbols[id] = def;
            def.rbp = def.rbp || 0;
            def.lbp = def.lbp || 0;
            def.nud = def.nud || defaultNud;
            def.led = def.led || defaultLed;
        },
        lookup: function(id){
            return hasOwn(this.symbols,id) ? this.symbols[id] :
                this.parent ? this.parent.lookup(id) : undefined;
        }
    };

    var EOF = {pattern:/$/},
        UNK = {pattern:/[\s\S]/};

    function Parser(defs){
        if(!(this instanceof Parser))
            return new Parser(defs);
        this.symbolTable = new SymbolTable();
        this.lexers = [];

        Object.keys(defs).forEach(function(id){
            var def = defs[id];
            def.parser = this;
            this.defLexer(id, def);
            this.symbolTable.defSymbol(id, def);
        },this);

        var eof = Object.create(EOF);
        this.defLexer('(eof)', eof);
        this.symbolTable.defSymbol('(eof)', eof);
        var unk = Object.create(UNK);
        this.defLexer('(unknown)', unk);
        this.symbolTable.defSymbol('(unknown)', eof);
    }
    Parser.prototype = {
        //TODO: utilize id
        advance: function(id){
            var longestLexer = this.lexers.map(function(lexer){
                lexer.pattern.lastIndex = this.position.index;
                lexer.lex(this.src);
                return lexer;
            }, this).reduce(function(left,right){
                return !left.match || left.match &&
                    left.match[0].length < right.match[0].length ? right : left;
            });

            this.curToken = longestLexer.action(symbolTable, longestLexer.match, this.position);
            return this.curToken;
        },
        constructor: Parser,
        curToken: undefined,
        defLexer: function(id, def){
            this.lexers.push(new Lexer(id, def.pattern, def.action));
        },
        parse: function(src){
            this.src = src;
            this.position = new Position(0,1,0);
            this.advance();
            return this.parseExpression(0);
        },
        parseExpression: function(rbp){
            var left, t = this.curToken;
            this.curToken = this.advance(this.symbolTable);
            left = t.nud();
            while(rbp < this.curToken.lbp){
                t = this.curToken;
                this.curToken = this.advance(this.symbolTable);
                left = t.led(left);
            }
            return left;
        },
        position: undefined,
        src: undefined
    };
    Parser.infix = function(id){
        return function(left){
            this.id = id;
            this.left = left;
            this.right = this.parser.parseExpression(this.lbp);
            return this;
        };
    };
    Parser.prefix = function(id){
        return function(){
            this.id = id;
            this.left = this.parser.parseExpression(this.rbp);
            return this;
        };
    };
    Parser.infixR = function(id){
        return function(left){
            this.id = id;
            this.left = left;
            this.right = this.parser.parseExpression(this.lbp - 1);
            return this;
        };
    };
    Parser.literal = function(id){
        return function(){
            this.id = id;
            return this;
        };
    };
    Parser.postfix = function(id){
        return function(left){
            this.id = id;
            this.left = left;
            return this;
        };
    };
    return Parser;
})();