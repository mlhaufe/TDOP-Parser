function Prefix(o){
    Symbol.call(this,o);
}
Prefix.prototype = Object.create(Symbol.prototype);
Prefix.prototype.nud = function(){
    this.left = new Expression(this.lbp);
    return this;
}