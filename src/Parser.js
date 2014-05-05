var Parser = (function(){
    function Lexer(id,symbolProto,regex,action){
        this.id = id;
        this.symbolProto = symbolProto;
        this.regex = new RegExp(regex.source,"g");
        if(action) this.action = action;
    }
    Lexer.prototype = {
        action: function(position,match){
            Symbol.prototype = this.symbolProto;
            var len = match[0].length,
                symbol = new Symbol(position.clone(),match[0]);
            position.index += len;
            position.col += len;
            return symbol;
        },
        exec: function(position,src){
            this.regex.lastIndex = position.index;
            return (this.match = this.regex.exec(src));
        }
    };

    function Position(index,line,col){
        this.index = index;
        this.line = line;
        this.col = col;
    }
    Position.prototype = {
        clone: function(){
            return new Position(this.index,this.line,this.col);
        },
        toString: function(){
            return "(index:"+this.index+",line:"+this.line+",col:"+this.col+")";
        }
    };

    function SymbolProto(id,parser,def){
        this.id = id;
        this._parser = parser;
        this.lexer = new Lexer(id,this,def.lexer[0],def.lexer[1]);
        this.nud = def.nud || def.prefix && this._prefix ||
            def.literal && this._literal || this.nud;
        this.led = def.led || def.infix && this._infix ||
            def.infixR && this._infixR || def.postfix && this._postfix ||
            this.led;
        this.rbp = def.prefix && def.prefix[0] || 0;
        this.lbp = def.infix && def.infix[0] ||
            def.infixR && def.infixR[0] || def.postfix && def.postfix[0] || 0; 
        this._nudCons = def.prefix && def.prefix[1] || def.literal;
        this._ledCons = def.infix && def.infix[1] || 
            def.infixR && def.infixR[1] || def.postfix && def.postfix[1];
    }
    SymbolProto.prototype = {
        nud: function(){
            throw new Error("'"+this.id+"' is not a prefix. "+this.position);
        },
        led: function(){
            throw new Error("'"+this.id+"' is not an infix. "+this.position);
        },
        _infix: function(left){
            return new this._ledCons(this.position.clone(),left,
                this._parser.parseExpression(this.lbp));
        },
        _infixR: function(left){
            return new this._ledCons(this.position.clone(),left,
            this._parser.parseExpression(this.lbp-1));
        },
        _literal: function(){
            return new this._nudCons(this.position.clone(),this.value);
        },
        _postfix: function(left){
            return new this._ledCons(this.position.clone(),left);
        },
        _prefix: function(){
            return new this._nudCons(this.position.clone(),
                this._parser.parseExpression(this.rbp));
        }
    };

    function Symbol(position,value){
        this.position = position;
        this.value = value;
    }

    function Parser(def){
        this.symbols = Object.keys(def).map(function(id){
            return new SymbolProto(id,this,def[id]);
        },this);
    }
    Parser.prototype = {
        advance: function(id){
            var self = this, pos = self.position, i = pos.index;
            if(id && this.curSymbol.id !== id)
                throw new TypeError("'"+id+"' expected at: "+pos);
            var longestRule = this.symbols.filter(function(rule){
                var match = rule.lexer.exec(pos,self.src);
                return !!match && match.index === i;
            }).reduce(function(longestRule,nextRule){
                return longestRule.lexer.match[0].length >= 
                       nextRule.lexer.match[0].length ? longestRule : nextRule; 
            });
            return (this.curSymbol = longestRule.lexer.action(pos,longestRule.lexer.match));
        },
        parse: function(src){
            this.src = src;
            this.position = new Position(0,1,1);
            this.advance();
            return this.parseExpression(0);
        },
        parseExpression: function(rbp){
            var s = this.curSymbol;
            this.advance();
            var left = s.nud();
            while(rbp < this.curSymbol.lbp){
                s = this.curSymbol;
                this.advance();
                left = s.led(left);
            }
            return left;
        }
    };

    return Parser;
})();