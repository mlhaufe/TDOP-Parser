function Lexer(def){
    this.rules = []
    var hasOwn = Object.prototype.hasOwnProperty,
        rule
    for(var p in def){
        if(hasOwn.call(def,p)){
            rule = def[p]
            this.rules.push(new Lexer.Rule(rule[0],rule[1]))
        }
    }
}
Lexer.prototype = {
    constructor: Lexer,
    lex: function(input){
        this.position = new Lexer.Position(1,0)
        this.input = input
        var result = []
        //TODO: ...
    },
    lexIterator: function(input){
        this.position = new Lexer.Position(1,0)
        this.input = input
        return this.iterator()
    },
    iterator: function(){
        var self = this;
        return {
            next: function(){
                //TODO: value, done
            }
        }
    }
}
Lexer.defaultAction = function(match, position){
    var m = match[0]
    return new Lexer.Token(m, position, m)
}
Lexer.nullAction = function(){ return null }
Lexer.lineAction = function(match, position){
    //TODO: ...
}
Lexer.Rule = function(regex,action){
    this.regex = new RegExp("^(" + regex.source + ")")
    this.action = action;
}
Lexer.Position = function(line, col){
    this.line = line
    this.col = col
}
Lexer.Token = function(id,position,value){
    this.id = id
    this.position = position
    this.value = value
}
Lexer.Token.prototype.toString = function(){
    return this.id + "(" + this.position + "," + this.value + ")"
}