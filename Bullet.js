/*
*子弹类_Bullet.js
*/

var Bullet=function(){
	this.width=this.height=6;
	this.dir;
	this.speed;
	this.bullet;
}

//移动
Bullet.prototype.move=function(){
	if(!this.bullet) return;
	var attr=(this.dir==1 || this.dir==2)?"top":"left";	//方向：上下 对top操作，左右 对left操作
	var attrVal=parseInt(getAttr(this.bullet,attr));	//获取当前方向上的值
	var isOverMaxVal=(this.dir==1||this.dir==3)?attrVal<=0:attrVal>=(BASE*26-6);	//方向：上左 小于最大值0返回true，下右 大于最大值26*16 则返回true	
	var speed=(this.dir==1||this.dir==3)?-1*this.speed:this.speed;//方向：上、右 速度为负
	
	//检测是否碰撞
	var isGo={ result:true };	
	isGo=isHit(this.bullet, speed, attr); 
	
	//碰到边界，自行消失
	if(isOverMaxVal){
		this.die(this.bullet);
		return;
	}
	
	if(isGo.result){		
		this.bullet.style[attr]=attrVal+speed+'px';
		return;
	}
	
	//如果返回false
	if(!isGo.result){
		var eleDiv=document.getElementById(isGo.eleID),
			eleClass=eleDiv.className,
			eleCategory=eleDiv.category,
			bulletCategory=this.bullet.category;
			
		//1、可通过的情况：己方tank、己方bullet——不处理
		
		if(eleClass==SLAB){
			//2、碰到Slab，无法通过的情况——自行灭亡
			this.die(this.bullet);
		}
		else if(eleClass==WALL || bulletCategory!=eleCategory){
			//3、自己和对方同时灭亡情况——碰到Wall 或 对方tank、bullet
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

//子弹灭亡
Bullet.prototype.die=function(bulletDiv){
	var Tank=getTankObjByBulletID(bulletDiv.id);
	if(!Tank) return;
	if(!Tank.oBullet) return;
	clearInterval(Tank.oBullet.bulletTimer);
	oMoveBox.removeChild(Tank.oBullet.bullet);
	Tank.oBullet.bullet=Tank.oBullet=null;
	
	//如果所属坦克存在
	//则在子弹消失以后，所属坦克隔800ms后继续发射子弹
	setTimeout(function(){
		if(!Tank.oTank) return;
		Tank.oTank.shoot(Tank.oTank.tankDiv.category);
	},1000);
}

//同时灭亡
Bullet.prototype.kill=function(killObj){
	//自己灭亡
	this.die(this.bullet);
	
	var className=killObj.className;
	//干掉对方
	if(className===TANK) {
		var Tank=getTankObjByTankID(killObj.id);
		clearInterval(Tank.oTank.tankMoveTimer);
		clearTimeout(Tank.oTank.shootTimer);
		Tank.oTank=Tank[Tank.oTank.tankID]=null;
		//如果射杀的是MyTank，则200ms后创造Tank
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
 