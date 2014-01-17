function SymbolTable(){
    if(!(this instanceof SymbolTable))
        return new SymbolTable();
    this.table = {};
}
SymbolTable.prototype = {
    constructor: SymbolTable,
    infix: function(){
        
        return this;
    },
    infixR: function(){
        
        return this;
    },
    literal: function(){
        
        return this;
    },
    lookup: function(){
        
    },
    prefix: function(o){
        
        
        return this;
    },
    symbol: (function() {
        var hasOwn = Object.prototype.hasOwnProperty;

        function nud(){
            throw new TypeError("nud is undefined for " + this.id);
        }
        
       function led(){
           throw new TypeError("led is undefined for " + this.id);
       }
        
        return function(o) {
            var id = o.id, table = this.table, s = table[id], lbp = o.lbp || 0;

            if(hasOwn.call(table,id)) {
                if(lbp >= s.lbp)
                    s.lbp = lbp;
                if(o.nud)
                    s.nud = o.nud;
                if(o.led)
                    s.led = o.led;
            } else {
                table[id] = {
                    id: id,
                    lbp: lbp || 0,
                    nud: o.nud || nud,
                    led: o.led || led
                };
            }

            return this;
        };
    })();
}
