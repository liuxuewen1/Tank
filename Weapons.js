/*
*武器工厂类WeaponsFactory 子类包括坦克类、子弹类
*/

var WeaponsFactory=function(count){
	this.count=count||1;
	this.nowCount=0;
	this.left=0;
}

//生成坦克
WeaponsFactory.prototype.createTank=function(BaseObj){
	var basePos=null;
	if(BaseObj.category===ENEMY){
		switch(getRandom(1,3)){
			case 1:basePos={x:0, y:-32};
				break;
			case 2:basePos={x:-128, y:-32};
				break;
			case 3:basePos={x:0, y:-64};
				break;	
		}
		this.left=this.nowCount*8*BASE;
	}else{
		basePos={x:0, y:0};
		this.left=1*8*BASE;
	}
	this.nowCount++;
	if(this.nowCount>this.count) return;
	
	var tank=new Tank();
	tank.dir=BaseObj.dir;
	tank.basePos=basePos;
	
	tank.tankDiv=createDiv("copyTank",this.left,BaseObj.top);
	tank.tankDiv.category=BaseObj.category;
	oMoveBox.appendChild(tank.tankDiv);
	var oThis=this;
	
	tank.tankTimer=setInterval(function(){
		tank.tankDiv.style.backgroundPosition=-256+(tank.index++)*(-32)+"px -32px";//坦克生成效果
		//效果完成后，显示真正坦克
		if(tank.index!=7) return;
		tank.setTankPosition();	//设置坦克方向的图片背景
		tank.tankDiv.className=TANK;
		TankObj[tank.tankDiv.id]={ oTank:tank, tankID:tank.tankDiv.id};	
		
		//一秒后发射子弹
		tank.shootTimer=setTimeout(function(){
			if(tank) tank.shoot(MYTANK);
		},1000);
			
		clearInterval(tank.tankTimer);
		tank.tankMoveTimer=setInterval(function(){ 
			if(!tank) { clearInterval(tank.tankMoveTimer); return;}
			tank.move();
		},30);//定时移动
		
		//console.log(BaseObj.category+' '+oThis.count+' '+oThis.nowCount);
		if(oThis.nowCount<=oThis.count){
			oThis.createTank(BaseObj);
		}else{
			oThis.nowCount=1;
			oThis.left=0;
		}
		
	},200)
}
