/*
*子弹类
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
	var attr=(this.dir==1 || this.dir==2)?"top":"left";	// top left
	var attrVal=parseInt(getAttr(this.bullet,attr));	//获取当前方向上的值
	var isOverMaxVal=(this.dir==1||this.dir==3)?attrVal<=0:attrVal>=(BASE*26-6);	// 方向：上左 小于最大值0返回true，下右 大于最大值26*16 则返回true		
	var speed=(this.dir==1||this.dir==3)?-1*this.speed:this.speed;//方向：上、右 速度为负
	
	//检测是否碰撞
	var isGo={ result:true };	
	isGo=isHit(this.bullet, speed, attr); 
	
	//是否到达边界
	if(isOverMaxVal){
		this.die(this.bullet);
		return;
	}
	
	if(isGo.result){		
		this.bullet.style[attr]=attrVal+speed+'px';
		return;
	}
	
	//false-被阻挡
	if(!isGo.result){
		var eleDiv=document.getElementById(isGo.eleID),
			eleClass=eleDiv.className,
			eleCategory=eleDiv.category,
			bulletCategory=this.bullet.category;
			
		if(eleClass==SLAB){
			//如果是预制板-Slab，则自己灭亡
			this.die(this.bullet);
		}
		else if(eleClass==WALL || bulletCategory!=eleCategory){
			//如果是砖块-Wall或其他不是同类的物体
			if(oGrid[isGo.iGrid] && isGo.eleID===oGrid[isGo.iGrid][isGo.index]) {
				oGrid[isGo.iGrid].splice(isGo.index,1);			
			}
			this.kill(eleDiv);
		}
		else{
			this.bullet.style[attr]=attrVal+speed+'px';
		}
	}
	
}

//子弹消失
Bullet.prototype.die=function(bulletDiv){
	var Tank=getTankObjByBulletID(bulletDiv.id);
	if(!Tank) return;
	if(!Tank.oBullet) return;
	clearInterval(Tank.oBullet.bulletTimer);
	oMoveBox.removeChild(Tank.oBullet.bullet);
	Tank.oBullet.bullet=Tank.oBullet=null;
	
	//子弹消失以后，所属坦克隔800ms后继续发射子弹
	setTimeout(function(){
		if(!Tank.oTank) return;
		Tank.oTank.shoot(Tank.oTank.tankDiv.category);
	},1000);
}

//消灭对方
Bullet.prototype.kill=function(killObj){
	this.die(this.bullet);
	
	var className=killObj.className;
	//如果对方是Tank
	if(className===TANK) {
		var Tank=getTankObjByTankID(killObj.id);
		clearInterval(Tank.oTank.tankMoveTimer);
		clearTimeout(Tank.oTank.shootTimer);
		Tank.oTank=Tank[Tank.oTank.tankID]=null;
		//消灭后新增Tank
		if(killObj.category===MYTANK){
			var myTank=new MyTank();
			//myTank.createMyTank();
		}
		else{
			//var enemyTank=new Enemy();
			--Global.enemyTank.nowCount<0 && (Global.enemyTank.nowCount=0);
			console.log(Global.enemyTank.nowCount);
			//Global.enemyTank.createEnemy();
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
 