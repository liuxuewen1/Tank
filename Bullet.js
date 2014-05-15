/*
*�ӵ���_Bullet.js
*/

var Bullet=function(){
	this.width=this.height=6;
	this.dir;
	this.speed;
	this.bullet;
}

//�ƶ�
Bullet.prototype.move=function(){
	if(!this.bullet) return;
	var attr=(this.dir==1 || this.dir==2)?"top":"left";	//�������� ��top���������� ��left����
	var attrVal=parseInt(getAttr(this.bullet,attr));	//��ȡ��ǰ�����ϵ�ֵ
	var isOverMaxVal=(this.dir==1||this.dir==3)?attrVal<=0:attrVal>=(BASE*26-6);	//�������� С�����ֵ0����true������ �������ֵ26*16 �򷵻�true	
	var speed=(this.dir==1||this.dir==3)?-1*this.speed:this.speed;//�����ϡ��� �ٶ�Ϊ��
	
	//����Ƿ���ײ
	var isGo={ result:true };	
	isGo=isHit(this.bullet, speed, attr); 
	
	//�����߽磬������ʧ
	if(isOverMaxVal){
		this.die(this.bullet);
		return;
	}
	
	if(isGo.result){		
		this.bullet.style[attr]=attrVal+speed+'px';
		return;
	}
	
	//�������false
	if(!isGo.result){
		var eleDiv=document.getElementById(isGo.eleID),
			eleClass=eleDiv.className,
			eleCategory=eleDiv.category,
			bulletCategory=this.bullet.category;
			
		//1����ͨ�������������tank������bullet����������
		
		if(eleClass==SLAB){
			//2������Slab���޷�ͨ�������������������
			this.die(this.bullet);
		}
		else if(eleClass==WALL || bulletCategory!=eleCategory){
			//3���Լ��ͶԷ�ͬʱ���������������Wall �� �Է�tank��bullet
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

//�ӵ�����
Bullet.prototype.die=function(bulletDiv){
	var Tank=getTankObjByBulletID(bulletDiv.id);
	if(!Tank) return;
	if(!Tank.oBullet) return;
	clearInterval(Tank.oBullet.bulletTimer);
	oMoveBox.removeChild(Tank.oBullet.bullet);
	Tank.oBullet.bullet=Tank.oBullet=null;
	
	//�������̹�˴���
	//�����ӵ���ʧ�Ժ�����̹�˸�800ms����������ӵ�
	setTimeout(function(){
		if(!Tank.oTank) return;
		Tank.oTank.shoot(Tank.oTank.tankDiv.category);
	},1000);
}

//ͬʱ����
Bullet.prototype.kill=function(killObj){
	//�Լ�����
	this.die(this.bullet);
	
	var className=killObj.className;
	//�ɵ��Է�
	if(className===TANK) {
		var Tank=getTankObjByTankID(killObj.id);
		clearInterval(Tank.oTank.tankMoveTimer);
		clearTimeout(Tank.oTank.shootTimer);
		Tank.oTank=Tank[Tank.oTank.tankID]=null;
		//�����ɱ����MyTank����200ms����Tank
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
 