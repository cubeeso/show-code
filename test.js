function A(){}
A.prototype.b = 3;
A.__proto__.b = 9;
var s = new A();
s.__proto__.b = 6;
console.log(s.b);