/*
*?
*/

var Bullet=function(){
	this.width=this.height=6;
	this.dir;
	this.speed;
	this.bullet;
}

//?
Bullet.prototype.move=function(){
	if(!this.bullet) return;
	var attr=(this.dir==1 || this.dir==2)?"top":"left";	// top left
	var attrVal=parseInt(getAttr(this.bullet,attr));	//????
	var isOverMaxVal=(this.dir==1||this.dir==3)?attrVal<=0:attrVal>=(BASE*26-6);	// С?0true ?26*16 ??true	
	var speed=(this.dir==1||this.dir==3)?-1*this.speed:this.speed;//? ??
	
	//??
	var isGo={ result:true };	
	isGo=isHit(this.bullet, speed, attr); 
	
	//?磬?
	if(isOverMaxVal){
		this.die(this.bullet);
		return;
	}
	
	if(isGo.result){		
		this.bullet.style[attr]=attrVal+speed+'px';
		return;
	}
	
	//false
	if(!isGo.result){
		var eleDiv=document.getElementById(isGo.eleID),
			eleClass=eleDiv.className,
			eleCategory=eleDiv.category,
			bulletCategory=this.bullet.category;
			
		//1?tankbullet
		
		if(eleClass==SLAB){
			//2Slab??
			this.die(this.bullet);
		}
		else if(eleClass==WALL || bulletCategory!=eleCategory){
			//3?????Wall  ?tankbullet
			if(oGrid[isGo.iGrid] && isGo.eleID===oGrid[isGo.iGrid][isGo.index]) {
				oGrid[isGo.iGrid].splice(isGo.index,1);			
			}
			this.kill(eleDiv);
		}
		else{
			this.bullet.style[attr]=attrVal+speed+'px';
			return;
		}
	}
	
}

//?
Bullet.prototype.die=function(bulletDiv){
	var Tank=getTankObjByBulletID(bulletDiv.id);
	if(!Tank) return;
	if(!Tank.oBullet) return;
	clearInterval(Tank.oBullet.bulletTimer);
	oMoveBox.removeChild(Tank.oBullet.bullet);
	Tank.oBullet.bullet=Tank.oBullet=null;
	
	//??
	//?????800ms?
	setTimeout(function(){
		if(!Tank.oTank) return;
		Tank.oTank.shoot(Tank.oTank.tankDiv.category);
	},1000);
}

//??
Bullet.prototype.kill=function(killObj){
	//?
	this.die(this.bullet);
	
	var className=killObj.className;
	//??
	if(className===TANK) {
		var Tank=getTankObjByTankID(killObj.id);
		clearInterval(Tank.oTank.tankMoveTimer);
		clearTimeout(Tank.oTank.shootTimer);
		Tank.oTank=Tank[Tank.oTank.tankID]=null;
		//?MyTank200msTank
		if(killObj.category===MYTANK){
			var myTank=new MyTank();
			myTank.createMyTank();
		}
		else{
			var enemyTank=new Enemy();
			enemyTank.createEnemy();
		}
		oMoveBox.removeChild(killObj);
	}
	else if(className===BULLET){
		var Tank=getTankObjByBulletID(killObj.id);
		if(!Tank.oBullet) return;
		this.die(Tank.oBullet.bullet);
	}
	else{
		oBox.removeChild(killObj);
	}
	killObj=null;
	
}
 