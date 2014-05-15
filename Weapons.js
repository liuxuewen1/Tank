/*
*武器工厂类WeaponsFactory 子类包括坦克类、子弹类
*/

var WeaponsFactory=function(){
	
}

//生成坦克
WeaponsFactory.prototype.createTank=function(BaseObj){
	var tank=new Tank();
	tank.dir=BaseObj.dir;
	tank.basePos=BaseObj.basePos;
	
	tank.tankDiv=createDiv("copyTank",BaseObj.left,BaseObj.top);
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
		
	},200)
}
