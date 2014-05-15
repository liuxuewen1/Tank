/*
Enemy.js
*/

var Enemy=function(){
	
}

Enemy.prototype=new WeaponsFactory();

Enemy.prototype.createEnemy=function(baseObj){
	
	var basePos=null;
	switch(getRandom(1,3)){
		case 1:basePos={x:0, y:-32};
			break;
		case 2:basePos={x:-128, y:-32};
			break;
		case 3:basePos={x:0, y:-64};
			break;	
	}
	var enemyBaseObj=baseObj || {
		dir: 2,
		left: 1*8*BASE,
		top: 0,
		category: ENEMY,
		basePos: basePos
	}
	
	this.createTank(enemyBaseObj);
	
}