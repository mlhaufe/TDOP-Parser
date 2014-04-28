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

function Add(){ Binary.apply(this,arguments); }
Add.prototype = Object.create(Binary.prototype);

function Sub(){ Binary.apply(this,arguments); }
Sub.prototype = Object.create(Binary.prototype);

function Pos(){ Unary.apply(this,arguments); }
Pos.prototype = Object.create(Unary.prototype);

function Neg(){ Unary.apply(this,arguments); }
Neg.prototype = Object.create(Unary.prototype);

function Mul(){ Binary.apply(this,arguments); }
Mul.prototype= Object.create(Binary.prototype);

function Div(){ Binary.apply(this,arguments); }
Div.prototype = Object.create(Binary.prototype);

function Pow(){ Binary.apply(this,arguments); }
Pow.prototype = Object.create(Binary.prototype);

function Fact(){ Unary.apply(this,arguments); }
Fact.prototype = Object.create(Unary.prototype);

function Num(){ Unary.apply(this,arguments); }
Num.prototype = Object.create(Unary.prototype);

function UNK(){ Unary.apply(this,arguments); }
UNK.prototype = Object.create(Unary.prototype);