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
            return symbolTable.create(new Token(this.id, position.clone(), match[0]));
        },
        lex: function(src){
            this.match = this.pattern.exec(src);
        }
    };

    function Token(id,position,value){
        this.id = id;
        this.position = position;
        this.value = value;
    }

    function Tokenizer(){
        this.lexers = [];
    }
    Tokenizer.prototype = {
        constructor: Tokenizer,
        advance: function(symbolTable){
            var longestLexer = this.lexers.map(function(lexer){
                lexer.pattern.lastIndex = this.position.index;
                lexer.lex(this.src);
            }, this).reduce(function(left,right){
                return left.match[0].length >= right.match[0].length ? left : right; 
            });

            return longestLexer.action(symbolTable, longestLexer.match, this.position);
        },
        defLexer: function(id,pattern,action){
            this.lexers.push(new Lexer(id, pattern, action));
        },
        position: undefined,
        src: ""
    };

    function Symbol(id){ this.id = this.value = id; }
    Symbol.prototype = {
        constructor: Symbol,
        lbp:0,
        rbp:0,
        nud: function(){
            throw new TypeError(
                "{id:'"+this.id+",value:'"+this.value+"'}' is not a prefix|literal.\r\n" +
                "position:"+this.position
            );
        },
        led: function(){
            throw new TypeError(
                "{id:'"+this.id+",value:'"+this.value+"'}' is not a infix|infixR|postFix.\r\n" +
                "position:"+this.position
            );
        }
    };

    function hasOwn(o,p){ return Object.prototype.hasOwnProperty.call(o,p); }

    function infixLed(left){
        this.left = left;
        this.right = Parser.parseExpression(this.lbp);
        return this;
    }
    
    function postfixLed(left){
        this.left = left;
        return this;
    }

    function infixRLed(left){
        this.left = left;
        this.right = Parser.parseExpression(this.lbp - 1);
        return this;
    }

    function literalNud(){
        return this;
    }

    function prefixNud(){
        this.left = Parser.parseExpression(this.rbp);
        return this;
    }

    function SymbolTable(parent){
        this.symbols = Object.create(null);
        this.parent = parent;
    }
    SymbolTable.prototype = {
        constructor: SymbolTable,
        create: function(token){
            var symbolProto = this.symbols[token.id];
            if(symbolProto)
                token.prototype = symbolProto;
            else
                throw new TypeError("'" + token.id + "' is undefined");
            return token;
        },
        defInfix: function(def){
            var s = this.defSymbol(def.id);
            s.lbp = def.lbp;
            s.led = def.led || infixLed;
            return s;
        },
        defInfixR: function(def){
            var s = this.defSymbol(def.id);
            s.lbp = def.lbp;
            s.led = def.led || infixRLed;
            return s;
        },
        defLiteral: function(def){
            var s = this.defSymbol(def.id);
            s.nud = def.nud || literalNud;
            return s;
        },
        defPostfix: function(def){
            var s = this.defSymbol(def.id);
            s.lbp = def.lbp;
            s.led = def.led || postfixLed;
            return this;
        },
        defPrefix: function(def){
            var s = this.defSymbol(def.id);
            s.rbp = def.rbp;
            s.nud = def.nud || prefixNud;
            return s;
        },
        defSymbol: function(id){
            return hasOwn(this.symbols,id) ? this.symbols[id] :
                (this.symbols[id] = new Symbol(id));
        },
        lookup: function(id){
            return hasOwn(this.symbols,id) ? this.symbols[id] :
                this.parent ? this.parent.lookup(id) : undefined;
        }
    };

    function Parser(defs){
        if(!(this instanceof Parser))
            return new Parser(defs);
        var s = this.symbolTable = new SymbolTable(),
            t = this.tokenizer = new Tokenizer();
        Object.keys(defs).forEach(function(id){
            var def = defs[id];
            t.defLexer(id, def.pattern, def.action);
            if(def.prefix) s.defPrefix(def.prefix);
            if(def.infix) s.defInfix(def.infix);
            if(def.infixR) s.defInfixR(def.infixR);
            if(def.postfix) s.defPostfix(def.postfix);
            if(def.literal) s.defLiteral(def.literal);
        });
        t.defLexer('(eof)', /$/);
        s.defSymbol('(eof)');
        t.defLexer('(unknown)', /[\s\S]/);
        s.defSymbol('(unknown)');
    }
    Parser.prototype = {
        constructor: Parser,
        //TODO: pass in symbolTable at this point and thread it through?
        parse: function(src){
            this.src = this.tokenizer.src = src;
            this.tokenizer.position = new Position(0,1,0);
            this.curToken = this.tokenizer.advance(this.symbolTable);
            return this.parseExpression(0);
        },
        parseExpression: function(rbp){
            var left, t = this.curToken;
            this.curToken = this.tokenizer.advance(this.symbolTable);
            left = t.nud();
            while(rbp < this.curToken.lbp){
                t = this.curToken;
                this.curToken = this.tokenizer.advance(this.symbolTable);
                left = t.led(left);
            }
            return left;
        }
    };
    
    return Parser;
})();