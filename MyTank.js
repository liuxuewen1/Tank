/*
MyTank.js
*/

var MyTank=function(){
	
}

MyTank.prototype=new WeaponsFactory();

MyTank.prototype.createMyTank=function(baseObj){
	var myBaseObj=baseObj || {
		dir: 1,
		left: 8*BASE,
		top: 24*BASE,
		category: MYTANK,
		basePos: {x:0, y:0}
	}
	this.createTank(myBaseObj);
}