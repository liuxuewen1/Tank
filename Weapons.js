/*
*����������WeaponsFactory �������̹���ࡢ�ӵ���
*/

var WeaponsFactory=function(){
	
}

//����̹��
WeaponsFactory.prototype.createTank=function(BaseObj){
	var tank=new Tank();
	tank.dir=BaseObj.dir;
	tank.basePos=BaseObj.basePos;
	
	tank.tankDiv=createDiv("copyTank",BaseObj.left,BaseObj.top);
	tank.tankDiv.category=BaseObj.category;
	oMoveBox.appendChild(tank.tankDiv);
	var oThis=this;
	tank.tankTimer=setInterval(function(){
		tank.tankDiv.style.backgroundPosition=-256+(tank.index++)*(-32)+"px -32px";//̹������Ч��
		//Ч����ɺ���ʾ����̹��
		if(tank.index!=7) return;
		
		tank.setTankPosition();	//����̹�˷����ͼƬ����
		tank.tankDiv.className=TANK;
		TankObj[tank.tankDiv.id]={ oTank:tank, tankID:tank.tankDiv.id};	
		
		//һ������ӵ�
		tank.shootTimer=setTimeout(function(){
			if(tank) tank.shoot(MYTANK);
		},1000);
			
		clearInterval(tank.tankTimer);
		tank.tankMoveTimer=setInterval(function(){ 
			if(!tank) { clearInterval(tank.tankMoveTimer); return;}
			tank.move();
		},30);//��ʱ�ƶ�
		
	},200)
}
