/*
*̹����
*/ 

var Tank=function(){
	this.width=this.height=BASE*2;	//����
	this.dir;		//����1-�ϡ�2-�¡�3-��4-��
	this.speed=BASE/4;	//�ٶ�
	this.type;	//̹�����ࣺ1��2��3
	this.basePos=null;	//��ͬ�����̹�˱���ͼƬ��ʾ��x��y�������λ�ã�̹�˲��϶���
	this.index=0;	//̹�˷���Ч������������6���Ժ�㴴�����
	this.tankDiv=null;	//̹�˶���
}

//�ƶ�
Tank.prototype.move=function(){
	var maxVal=(this.dir==1 || this.dir==3)?0:BASE*24;	//�������� ���ֵ0������ ���ֵ24*16
	var attr=(this.dir==1 || this.dir==2)?"top":"left";	//�������� ��top���������� ��left����
	var attrVal=parseInt(getAttr(this.tankDiv,attr));		//��ȡ��ǰ�����ϵ�ֵ
	
	var speed=(this.dir==1||this.dir==3)?-1*this.speed:this.speed;//�����ϡ��� �ٶ�Ϊ��
	var isGo={ result:true };
	
	//����Ƿ���ײ
	isGo=isHit(this.tankDiv, speed, attr); 
	
	if(attrVal!=maxVal && isGo.result){		
		this.tankDiv.style[attr]=attrVal+speed+'px';
		return;
	}
	
	//�������FLOW���߲����Լ�һ����޷��������ı䷽��
	this.setDir();
}

//�ı䷽��
Tank.prototype.setDir=function(){
	this.dir=getRandom(1,4);
	this.setTankPosition();
}

//����̹�˷����ͼƬ����
Tank.prototype.setTankPosition=function(){
	this.tankDiv.style.backgroundPosition=(this.basePos.x-32*(this.dir-1))+"px "+this.basePos.y+"px";
}

//�����ӵ�
Tank.prototype.createBullet=function(bulletCategory){
	var oBullet=new Bullet();
	oBullet.bullet=createDiv(BULLET,0,0);
	oBullet.bullet.category=oBullet.category=bulletCategory;
	oMoveBox.appendChild(oBullet.bullet);
	return oBullet;
}

//̹�˵��������
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
