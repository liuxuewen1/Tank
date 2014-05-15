/*
*坦克类
*/ 

var Tank=function(){
	this.width=this.height=BASE*2;	//宽、高
	this.dir;		//方向：1-上、2-下、3-左、4-右
	this.speed=BASE/4;	//速度
	this.type;	//坦克种类：1、2、3
	this.basePos=null;	//不同种类的坦克背景图片显示的x、y坐标基本位置（坦克材料对象）
	this.index=0;	//坦克孵化效果次数计数，6次以后便创造出来
	this.tankDiv=null;	//坦克对象
}

//移动
Tank.prototype.move=function(){
	var maxVal=(this.dir==1 || this.dir==3)?0:BASE*24;	//方向：上左 最大值0，下右 最大值24*16
	var attr=(this.dir==1 || this.dir==2)?"top":"left";	//方向：上下 对top操作，左右 对left操作
	var attrVal=parseInt(getAttr(this.tankDiv,attr));		//获取当前方向上的值
	
	var speed=(this.dir==1||this.dir==3)?-1*this.speed:this.speed;//方向：上、右 速度为负
	var isGo={ result:true };
	
	//检测是否碰撞
	isGo=isHit(this.tankDiv, speed, attr); 
	
	if(attrVal!=maxVal && isGo.result){		
		this.tankDiv.style[attr]=attrVal+speed+'px';
		return;
	}
	
	//如果不是FLOW或者不是自己一伙，则无法继续，改变方向
	this.setDir();
}

//改变方向
Tank.prototype.setDir=function(){
	this.dir=getRandom(1,4);
	this.setTankPosition();
}

//设置坦克方向的图片背景
Tank.prototype.setTankPosition=function(){
	this.tankDiv.style.backgroundPosition=(this.basePos.x-32*(this.dir-1))+"px "+this.basePos.y+"px";
}

//创建子弹
Tank.prototype.createBullet=function(bulletCategory){
	var oBullet=new Bullet();
	oBullet.bullet=createDiv(BULLET,0,0);
	oBullet.bullet.category=oBullet.category=bulletCategory;
	oMoveBox.appendChild(oBullet.bullet);
	return oBullet;
}

//坦克的射击方法
Tank.prototype.shoot=function(bulletCategory){
	var oBullet=this.createBullet(bulletCategory);
	
	var x=parseInt(getAttr(this.tankDiv, "left"));
	var y=parseInt(getAttr(this.tankDiv, "top"));
	switch(this.dir){
		case 1:x+=13,y-=6;
			break
		case 2:x+=13,y+=32;
			break
		case 3:x-=6,y+=13;
			break
		case 4:x+=32,y+=13;
			break
	}
	oBullet.bullet.style.left=x+"px";
	oBullet.bullet.style.top=y+"px";
	oBullet.bullet.id="div_"+x+"_"+y;
	TankObj[this.tankDiv.id].oBullet=oBullet;
	TankObj[this.tankDiv.id].bulletID=oBullet.bullet.id;
	oBullet.dir=this.dir;
	oBullet.speed=2*this.speed;
	oBullet.move();
	oBullet.bulletTimer=setInterval(function(){oBullet.move()},30);
}
