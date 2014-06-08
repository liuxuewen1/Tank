//根据bulletID，找到TankObj对象
function getTankObjByBulletID(bulletID){
	for(var tank in TankObj){
		if(!TankObj.hasOwnProperty(tank)) continue;
		var to=TankObj[tank];
		for(var bID in to){
			//alert(bID+":"+to[bID]);
			if(!to.hasOwnProperty(bID)) continue;
			if(to[bID]==bulletID) {
				return to;
			}
		}
	}
	return false;
}

//根据tankID，找到TankObj对象
function getTankObjByTankID(tankID){
	for(var tank in TankObj){
		if(!TankObj.hasOwnProperty(tank)) continue;
		if(tank==tankID) return TankObj[tank];
	}
	return false;
}

//检测碰撞
/*function isHit(obj,speed,attr){
	var oBox=document.getElementById('box');
	var aDiv=oBox.getElementsByTagName('div');
	var l=obj.offsetLeft;
	var t=obj.offsetTop;
	if(attr=='top'){
		t+=speed;
	}else if(attr=='left'){
		l+=speed;
	}
	
	var l1=l+obj.offsetWidth;
	var r1=l;
	var t1=t+obj.offsetHeight;
	var b1=t;
	//console.log(l1+' '+r1+' '+t1+' '+b1);
	for(var i=0,len=aDiv.length;i<len;i++){
		var oDiv=aDiv[i];
		if(!oDiv.className || oDiv===obj) continue;
		var l2=oDiv.offsetLeft,
			r2=oDiv.offsetLeft+oDiv.offsetWidth,
			t2=oDiv.offsetTop,
			b2=oDiv.offsetTop+oDiv.offsetHeight;
		if(l1<=l2 || t1<=t2 || r1>=r2 || b1>=b2){
			continue;
		}else{
	//console.log(l2+' '+r2+' '+t2+' '+b2);
			return {result:false ,eleID:oDiv.id}
		}
		
	}
	return {result:true};
}*/


//检测是否碰撞
function isHit(curObj, speed, dir)
{	
	var attr=(dir==1 || dir==2)?"top":"left";	//方向：上下 对top操作，左右 对left操作
	var curHalfWidth=parseInt(parseInt(getAttr(curObj,"width"))/2),
		xCenter=parseInt(getAttr(curObj,"left"))+curHalfWidth,
		yCenter=parseInt(getAttr(curObj,"top"))+curHalfWidth,
		minDx,
		minDy,
		xGrid=Math.ceil(xCenter/(BASE*2)),
		yGrid=Math.ceil(yCenter/(BASE*2)),
		curIsTank=(curObj.className==MYTANK || curObj.className==ENEMY );
		//curIsTank=(curObj.className=='copyTank');
		
	if(curIsTank) {
		attr=="left"? xCenter+=speed : yCenter+=speed;
	}
	var aCompare=null;
	switch(dir){
		case 1://上
			aCompare=["grid_"+xGrid+"_"+yGrid,"grid_"+(xGrid-1)+"_"+(yGrid-1),"grid_"+xGrid+"_"+(yGrid-1),"grid_"+(xGrid+1)+"_"+(yGrid-1)];
			break;
		case 2://下
			aCompare=["grid_"+xGrid+"_"+yGrid,"grid_"+(xGrid-1)+"_"+(yGrid+1),"grid_"+xGrid+"_"+(yGrid+1),"grid_"+(xGrid+1)+"_"+(yGrid+1)];
			break;
		case 3://左
			aCompare=["grid_"+xGrid+"_"+yGrid,"grid_"+(xGrid-1)+"_"+(yGrid-1),"grid_"+(xGrid-1)+"_"+yGrid,"grid_"+(xGrid-1)+"_"+(yGrid+1)];
			break;
		case 4://右
			aCompare=["grid_"+xGrid+"_"+yGrid,"grid_"+(xGrid+1)+"_"+(yGrid-1),"grid_"+(xGrid+1)+"_"+yGrid,"grid_"+(xGrid+1)+"_"+(yGrid+1)];
			break;
	}
	/*var aCompare=["grid_"+(xGrid-1)+"_"+(yGrid-1),"grid_"+xGrid+"_"+(yGrid-1),"grid_"+(xGrid+1)+"_"+(yGrid-1),"grid_"+(xGrid-1)+"_"+yGrid,"grid_"+xGrid+"_"+yGrid,"grid_"+(xGrid+1)+"_"+yGrid,"grid_"+(xGrid-1)+"_"+(yGrid+1),"grid_"+xGrid+"_"+(yGrid+1),"grid_"+(xGrid+1)+"_"+(yGrid+1)];*/
	
	function isExist(objGrid){
		for(var k=0;k<aCompare.length;k++){
			var gridInfo=objGrid[aCompare[k]];
			if(!gridInfo){ continue; }
			for(var i=0;i<gridInfo.length;i++){
				if(gridInfo[i]===curObj.id) continue;
				var oGridDiv=document.getElementById(gridInfo[i]);
				if(!oGridDiv) continue;
				if(curIsTank && oGridDiv.className==BULLET) continue;
				
				var gridHalfWidth=parseInt(parseInt(getAttr(oGridDiv,"width"))/2);
				var gxCenter=parseInt(getAttr(oGridDiv,"left"))+gridHalfWidth;
				var gyCenter=parseInt(getAttr(oGridDiv,"top"))+gridHalfWidth;
				minDx=minDy=curHalfWidth+gridHalfWidth;
				var dx=Math.abs(xCenter-gxCenter);
				var dy=Math.abs(yCenter-gyCenter);
				if(dx<minDx && dy<minDy){
					return { result:false, iGrid:aCompare[k], index:i, eleID:gridInfo[i]};
				}
				
			}
		}
	}
	
	//增加动态网格
	var moveGrid=createMoveGrid();
	
	var g=[oGrid, moveGrid];
	for(var i=0;i<g.length;i++){
		var r=isExist(g[i]);
		if(r){
			return r;
		}
	}
	
	return { result:true };		
}

//增加动态网格
function createMoveGrid(curIsTank){
	
	var moveGrid=new Object();	
	if(!curIsTank) addGrid(getByClass(oMoveBox, BULLET));
	addGrid(getByClass(oMoveBox, TANK));	
	
	function addGrid(obj){
		for(var i=0;i<obj.length;i++){
			var halfWidth = parseInt(parseInt(getAttr(obj[i], "width")) / 2);
            var xCenter = parseInt(getAttr(obj[i], "left")) + halfWidth;
            var yCenter = parseInt(getAttr(obj[i], "top")) + halfWidth;
			var gItem="grid_"+Math.ceil(xCenter/(BASE*2))+"_"+Math.ceil(yCenter/(BASE*2));
			if(!moveGrid[gItem]) moveGrid[gItem]=[];
			moveGrid[gItem].push(obj[i].id);
		}
	}

	return moveGrid;
}
	
//获取元素属性值
function getAttr(obj, attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}
	else{
		return getComputedStyle(obj, false)[attr];
	}
}

//查找元素
function getEleById(id){
	return document.getElementById(id);
}

//生成m到n的随机数
function getRandom(m,n){
	return Math.floor(Math.random()*(n-m+1)+m);
}

//创建Div suffixID：ID的后缀
function createDiv(iClass,iLeft,iTop,suffixID){
	var oDiv=document.createElement("div");
	oDiv.className=iClass;
	oDiv.style.left=iLeft+"px";
	oDiv.style.top=iTop+"px";
	var autoID="div_"+iLeft+"_"+iTop;
	oDiv.id=suffixID?autoID+'_'+suffixID:autoID;
	return oDiv;
}	
//根据Class查找元素，返回元素集合
function getByClass(oParent, iClass){
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(iClass);
	}
	
	var arr=[];
	var aEle=oParent.getElementsByTagName("*");
	for(var i=0;i<aEle.length;i++){
		var aCls=aEle[i].className.split(" ");
		if(findSame(aCls, iClass)){
			arr[arr.length]=aEle[i];
		}
	}
	return arr;
}

function findSame(arr, n){
	for(var i=0;i<arr.length;i++){
		if(arr[i]==n){
			return true;
		}
	}
	
	return false;
}

//匀速运动
function move(obj,oAttr,fn){
	clearInterval(obj.timer);
	
	obj.timer=setInterval(function(){
		var speed=6;	
		var isOver=true;
		for(var attr in oAttr){		
			var target=oAttr[attr];
			var nowVal=parseInt(getStyle(obj,attr));
			target>nowVal?speed=6:speed=-6;  		
			if(Math.abs(target-nowVal)<=Math.abs(speed)){
				obj.style[attr]=target+"px";
				continue;
			}
			else{
				isOver=false;
				obj.style[attr]=nowVal+speed+"px";
			}
		}
		if(isOver){
			fn && fn();
			clearInterval(obj.timer);			
		}
	},30);
}

function getStyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
}
	
