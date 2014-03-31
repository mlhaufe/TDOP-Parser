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
        this.pattern = regex.source == "$" ?
            new RegExp("$","g") : new RegExp(regex.source,"g");
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
        //FIXME: The sticky flag of regex: 'y' is not yet reliably available,
        //so a workaround is necessary. Something more efficient is needed 
        lex: function(src){
            var i = this.pattern.lastIndex,
                m = this.match = this.pattern.exec(src);
            if(m && i !== m.index){
                this.match = null;
            }
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

    var EOF = {id:'EOF', pattern:/$/, nud: defaultNud, led: defaultLed },
        UNK = {id: 'UNKNOWN', pattern:/[\s\S]/, nud: Parser.literalNud };

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
        this.symbolTable.defSymbol('(unknown)', unk);
    }
    Parser.prototype = {
        advance: function(id){
            var matchedLexers = this.lexers.map(function(lexer){
                lexer.pattern.lastIndex = this.position.index;
                lexer.lex(this.src);
                return lexer;
            }, this).filter(function(lexer){
                return lexer.match !== null;
            });
            //TODO: Collapse this into a default argument for reduce
            //Is it possible for there to be no match?
            if(matchedLexers.length === 0)
                return;

            var longestLexer = matchedLexers.reduce(function(left,right){
                return left.match[0].length < right.match[0].length ? right : left;
            });

            this.curToken = longestLexer.action(
                this.symbolTable,
                longestLexer.match,
                this.position
            );

            if(id && id != this.curToken.id)
                throw new TypeError("'"+ id +"' expected. Position: " + this.curToken.position);

            return this.curToken;
        },
        constructor: Parser,
        curToken: undefined,
        defLexer: function(id, def){
            this.lexers.push(new Lexer(id, def.pattern, def.action));
        },
        parse: function(src){
            if(src.length === 0) return;
            this.src = src;
            this.position = new Position(0,1,0);
            this.advance();
            return this.parseExpression(0);
        },
        parseExpression: function(rbp){
            var left, t = this.curToken;
            this.advance();
            left = t.nud();
            while(rbp < this.curToken.lbp){
                t = this.curToken;
                this.advance();
                left = t.led(left);
            }
            return left;
        },
        position: undefined,
        src: undefined
    };
    
    function binaryPrint(){
        return "('" + this.id + "', '"+this.left+"', '"+this.right+"')";
    }
    
    Parser.infix = function(id){
        return function(left){
            this.id = id;
            this.left = left;
            this.right = this.parser.parseExpression(this.lbp);
            this.toString = binaryPrint;
            return this;
        };
    };

    function unaryPrint(){
        return "('" + this.id + "', '"+this.left+"')";
    }

    Parser.prefix = function(id){
        return function(){
            this.id = id;
            this.left = this.parser.parseExpression(this.rbp);
            this.toString = unaryPrint;
            return this;
        };
    };
    Parser.infixR = function(id){
        return function(left){
            this.id = id;
            this.left = left;
            this.right = this.parser.parseExpression(this.lbp - 1);
            this.toString = binaryPrint;
            return this;
        };
    };
    
    function literalPrint(){
        return "('" + this.id + "', '"+this.value+"')";
    }
    
    Parser.literal = function(id){
        return function(){
            this.id = id;
            this.toString = literalPrint;
            return this;
        };
    };
    Parser.postfix = function(id){
        return function(left){
            this.id = id;
            this.left = left;
            this.toString = unaryPrint;
            return this;
        };
    };
    return Parser;
})();