function Nilfix(o){
    Symbol.call(this,o);
}
Nilfix.prototype = Object.create(Symbol.prototype);
Nilfix.prototype.nud = function(){
    return this
};