var Parser = (function(){
    var end = /^$/,
        hasOwn = Object.prototype.hasOwnProperty
    
    function expression(rbp){
        //TODO: ...
    }
    
    function infixLed(left){
        this.left = left
        this.right = expression(this.lbp)
    }
    
    function infixRLed(left){
        this.left = left
        this.right = expression(this.lbp - 1)
    }

    function prefixNud(){
        this.left = expression(this.rbp)
    }

    function literalNud(){
        return this
    }

    function Token(position,value){
        this.position = position;
        this.value = value;
    }

    function Parser(symbolTable){
        if(!(this instanceof Parser))
            return new Parser(symbolTable)

        this.table = {}

        var id, def, s;
        for(id in symbolTable){
            if(hasOwn.call(symbolTable,id)){
                def = symbolTable[id]
                s = this.table[id] = {
                    id: id,
                    lbp: def.lbp || 0,
                    rbp: def.rbp || 0
                }
                //TODO: a ^ b ^ c ^ ...
                //if(def.prefix === true && def.literal === true)
                //    throw new TypeError("'" + id + "' cannot be a prefix and a literal")
                
                //TODO: ...
                //prefix, infix, infixR, literal. postfix, group, match
            }
        }
        //TODO: ...
    }

    Parser.expression = expression;

    return Parser;
})();