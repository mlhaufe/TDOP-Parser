function Literal(o){
    Symbol.call(this,o);
}
Literal.prototype = Object.create(Symbol.prototype);
Literal.prototype.constructor = Symbol;
Literal.prototype.nud = function(){
    return this;
}
