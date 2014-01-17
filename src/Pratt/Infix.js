function Infix(o){
    Symbol.call(this,o);
}
Infix.prototype = Object.create(Symbol.prototype);
Infix.prototype.constructor = Infix;
Infix.prototype.led = function(left){
    this.left = left;
    this.right = new Expression(this.lbp);
    return this;
}