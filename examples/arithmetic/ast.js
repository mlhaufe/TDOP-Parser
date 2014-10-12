function Unary(position,value){
    this.position = position;
    this.value = value;
}
Unary.prototype.printAst = function(){
    return "(" + this.id + " " + this.value.printAst() + ")"; 
};

function Binary(position,left,right){
    this.position = position;
    this.left = left;
    this.right = right;
}
Binary.prototype.printAst = function(){
    return "(" + this.id + " " + this.left.printAst() + " " + this.right.printAst() + ")"; 
};

function Add(){
    this.id = "Add";   
    Binary.apply(this,arguments);
}
Add.prototype = Object.create(Binary.prototype);
Add.prototype.printJS = function(){
    return this.left.printJS() + ' + ' + this.right.printJS();
};

function Sub(){
    this.id = "Sub";
    Binary.apply(this,arguments);
}
Sub.prototype = Object.create(Binary.prototype);
Sub.prototype.printJS = function(){
    return this.left.printJS() + ' - ' + this.right.printJS();
};

function Pos(){
    this.id = "Pos";
    Unary.apply(this,arguments);
}
Pos.prototype = Object.create(Unary.prototype);
Pos.prototype.printJS = function(){
    return '+' + this.value.printJS();
}

function Neg(){
    this.id = "Neg";
    Unary.apply(this,arguments);
}
Neg.prototype = Object.create(Unary.prototype);
Neg.prototype.printJS = function(){
    return '-' + this.value.printJS();
}

function Mul(){
    this.id = "Mul";
    Binary.apply(this,arguments);
}
Mul.prototype = Object.create(Binary.prototype);
Mul.prototype.printJS = function(){
    return this.left.printJS() + ' * ' + this.right.printJS();
};

function Div(){
    this.id = "Div";
    Binary.apply(this,arguments);
}
Div.prototype = Object.create(Binary.prototype);
Div.prototype.printJS = function(){
    return this.left.printJS() + ' / ' + this.right.printJS();
};

function Pow(){
    this.id = "Pow";
    Binary.apply(this,arguments);
}
Pow.prototype = Object.create(Binary.prototype);
Pow.prototype.printJS = function(){
    return 'Math.pow(' + this.left.printJS() + ',' + this.right.printJS() + ')';
};

function Fact(){
    this.id ="Fact";
    Unary.apply(this,arguments);
}
Fact.prototype = Object.create(Unary.prototype);
Fact.prototype.printJS = function(){
    if(!Math._fact)
        Math._fact = function(n){
            for (var r = 1, i = 2; i <= n; i++) r *= i;
            return r;
        } 
    return 'Math._fact(' + this.value.printJS() + ')';
     
};

function Num(){
    this.id = "Num";
    Unary.apply(this,arguments);
}
Num.prototype = {
    printAst: function(){
        return "(Num " + this.value + ")"; 
    },
    printJS: function(){
        return Number(this.value).toString();
    }
}

function Eof(){}
Eof.prototype = {
    printAst: function(){
        return "(EOF)"; 
    },
    printJS: function(){
        return "";
    }
}
