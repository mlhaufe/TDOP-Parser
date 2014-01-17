function InfixR(o){
    Symbol.call(this,o);
}
InfixR.prototype = Object.create(Symbol.prototype);
InfixR.prototype.constructor = InfixR;
InfixR.prototype.led = function(left){
    this.left = left;
    this.right = new Expression(this.lbp - 1);
    return this;
}