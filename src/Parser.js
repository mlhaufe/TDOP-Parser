var Parser = (function(){
    function Symbol(position,value){
        this.position = position;
        this.value = value;
    }

    function SymbolDef(id,lexer,lbp,rbp){
        this.id = id;
        this.lexer = lexer;
        this.lbp = lbp || 0;
        this.rbp = rbp || 0;
    } 
    SymbolDef.prototype = {
        nud: function(){
            throw new Error("'"+this.id+"' is not a prefix. "+this.position);
        },
        led: function(){
            throw new Error("'"+this.id+"' is not an infix. "+this.position);
        }
    };

    function Lexer(rule,regex,action){
        this.regex = new RegExp(regex.source,"g");
        this.rule = rule;
        if(action) this.action = action;
    }
    Lexer.prototype = {
        action: function(){
            Symbol.prototype = this.rule;
            var position = this.position,
                len = this.match[0].length,
                symbol = new Symbol(position.clone(),this.match[0]);
            position.index += len;
            position.col += len;
            return symbol;
        },
        exec: function(src){
            this.regex.lastIndex = this.position.index;
            this.match = this.regex.exec(src);
            return this;
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

    //FIXME: not very OO...
    function prefix(self,Cons){
        return function(){ 
            return new Cons(
                self.position.clone(),
                self.parseExpression(this.rbp)
            );
        };
    }

    function literal(self,Cons){
        return function(){
            return new Cons(
                self.position.clone(),
                self.value
            );
        };
    }

    function infix(self,Cons){
        return function(left){
            return new Cons(
                self.position.clone(),
                left,
                self.parseExpression(self.lbp)
            );
        };
    }

    function infixR(self,Cons){
        return function(left){
            return new Cons(
                self.position.clone(),
                left,
                self.rbp
            );
        };
    }

    function suffix(self,Cons){
        return function(left){
            return new Cons(
                self.position.clone(),
                left
            );
        };
    }

    var EOF = new SymbolDef('EOF');
    EOF.lexer = new Lexer(EOF,/$/);
    EOF.nud = function(){ return this; }

    function Parser(rules){
        this.rules = Object.keys(rules).map(function(id){
            var rule = rules[id],
                def = new SymbolDef(id,undefined,rule.lbp,rule.rbp),
                lexer = new Lexer(def,rule.lexer[0],rule.lexer[1]);
            def.lexer = lexer;
            //TODO: decorators wanted?
            if(rule.nud) def.nud = rule.nud;
            if(rule.led) def.led = rule.led;
            if(rule.prefix) def.nud = prefix(def,rule.prefix);
            if(rule.literal) def.nud = literal(def,rule.literal);
            if(rule.infix) def.nud = infix(def,rule.infix);
            if(rule.infixR) def.led = infixR(def,rule.infixR);
            if(rule.suffix) def.led = suffix(def,rule.suffix);
            return def;
        }).concat(EOF);
    }
    Parser.prototype = {
        advance: function(id){
            var self = this, pos = self.position, i = pos.index;

            if(id && this.curSymbol.id !== id)
                throw new TypeError("'"+id+"' expected at: " + pos);

            var longestRule = this.rules.filter(function(rule){
                var lexer = rule.lexer;
                lexer.position = pos;
                var match = lexer.exec(self.src).match;
                return !!match && match.index === i;
            }).reduce(function(longestRule,nextRule){
                return longestRule.lexer.match[0].length >= 
                       nextRule.lexer.match[0].length ? longestRule : nextRule; 
            },EOF);

            return (this.curSymbol = longestRule.lexer.action(self.position));
        },
        parse: function(src){
            this.src = src;
            this.position = new Position(0,1,1);
            this.advance();
            if(this.curSymbol.id == 'EOF') return '';
            return this.parseExpression(0);
        },
        //FIXME: refactor to SymbolDef
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