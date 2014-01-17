//TODO: Need a token recognizer. 
function Tokenizer(src,symbolTable){
    this.src = src;
    this.symbolTable = symbolTable;
}
Tokenizer.prototype = {
    constructor: Tokenizer,
    next: function(){
        //lookup the current token in the symbolTable
    }
}