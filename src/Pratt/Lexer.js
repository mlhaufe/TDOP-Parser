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
        var position = new Lexer.Position(1,0),
            result = []
            //longestRule,
            //matchedRules = []
        
        while(position.index < input.length){
            var longestRule = this.rules.reduce(function(){
                //TODO: ...
            })
            longestRule.regex.lastIndex = position.index
            var match = longestRule.regex.exec(input)
            result.push(longestRule.action(match,position))
        }
        
        //TODO: ...

        return result
    },
    lexIterator: function(input){
        this.position = new Lexer.Position(1,0)
        this.input = input
        this.done = input.length == 0
        return this
    },
    next: function(){
        //TODO: ...
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
Lexer.Position = function(line, col, index){
    this.line = line
    this.col = col
    this.index = index
}
Lexer.Token = function(id,position,value){
    this.id = id
    this.position = position
    this.value = value
}
Lexer.Token.prototype.toString = function(){
    return this.id + "(" + this.position + "," + this.value + ")"
}