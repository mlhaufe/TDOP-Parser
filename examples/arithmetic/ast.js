function Unary(position,value){
    this.position = position;
    this.value = value;
}
Unary.prototype.toString = function(){
    return "(" + this.id + " " + this.value + ")"; 
};

function Binary(position,left,right){
    this.position = position;
    this.left = left;
    this.right = right;
}
Binary.prototype.toString = function(){
    return "(" + this.id + " " + this.left + " " + this.right + ")"; 
};

function Add(){
    this.id = "Add";   
    Binary.apply(this,arguments);
}
Add.prototype = Object.create(Binary.prototype);

function Sub(){
    this.id = "Sub";
    Binary.apply(this,arguments);
}
Sub.prototype = Object.create(Binary.prototype);

function Pos(){
    this.id = "Pos";
    Unary.apply(this,arguments);
}
Pos.prototype = Object.create(Unary.prototype);

function Neg(){
    this.id = "Neg";
    Unary.apply(this,arguments);
}
Neg.prototype = Object.create(Unary.prototype);

function Mul(){
    this.id = "Mul";
    Binary.apply(this,arguments);
}
Mul.prototype = Object.create(Binary.prototype);

function Div(){
    this.id = "Div";
    Binary.apply(this,arguments);
}
Div.prototype = Object.create(Binary.prototype);

function Pow(){
    this.id = "Pow";
    Binary.apply(this,arguments);
}
Pow.prototype = Object.create(Binary.prototype);

function Fact(){
    this.id ="Fact";
    Unary.apply(this,arguments);
}
Fact.prototype = Object.create(Unary.prototype);

function Num(){
    this.id = "Num";
    Unary.apply(this,arguments);
}
Num.prototype = Object.create(Unary.prototype);

function Unk(){
    this.id = "Unk";
    Unary.apply(this,arguments);
}
Unk.prototype = Object.create(Unary.prototype);

function Eof(){
    this.id = "Eof";
    Unary.apply(this,arguments);
}
Eof.prototype = Object.create(Unary.prototype);