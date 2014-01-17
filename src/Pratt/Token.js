//TODO: each value is a copy of the string in the original source.
// instead, hold on to the position only and derive the value
function Token(position,value){
    this.position = position;
    this.value = value;
}
Token.prototype = {
    constructor: Token,
    toString: function(){
        return "Token(" + this.value + ")";
    }
}