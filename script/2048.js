/* 保存颜色信息 */
var colorInfo = {
	bgColor: {
		'2': "#eee4da",
		'4': "#ede0c8",
		'8': "#f2b179",
		'16': "#f59563",
		'32': "#f67c5f",
		'64': "#f6513b",
		'128': "#edcf72",
		'256': "#edcc61",
		'512': "#edc850",
		'1024': "#efc513",
		'2048': "#efc216",
		'4096': "#3c3a32",
		'8192': "#3c3a32",
		'16384': "#3c3a32",
		'32768': "#3c3a32",
		'65536': "#3c3a32"
	},
	color2: "#776165",
	other: "#ffffff"
};

/* 保存位置信息 */
var locatInfo = [];
(function() {
	for(var i = 0; i < 16; i++) {
		var temp = i + 1;
		var j = Math.ceil(temp / 4);
		var k = (temp % 4 == 0)? 4 : temp%4;
		locatInfo[i] = {
			top: j * 8 + (j - 1) * 105 + "px",
			left: k * 8 + (k - 1) * 105 + "px"
		};
	}
})();

/* 保存所有在页面上的数字元素 */
var Elem = [];

/* 状态变量，为true则在运动中，false为静止状态 */
var status = false;

window.onload = function() {
	//获取16个盒子
	var allBox = document.querySelectorAll(".box");
	//new game按钮
	var newGame = document.querySelector(".new");
	var parent = document.querySelector(".container");

	//初始化
	init();

	//新游戏
	addHandler(newGame, "click", function() {
		Elem.forEach(function(item) {
			parent.removeChild(item);
		});
		Elem = [];
		init();
	});

	//监听方向键事件
	addHandler(document, "keydown", function(e) {
		e = e || window.event;
		var currKey = e.keyCode || e.which; //left37,up38,right39,down40;
		var isDirect = true;

		//判断上一次运动是否结束
		if(status == true) {
			return ;
		}

		if(currKey >= 37 && currKey <= 40) {
			status = true;  //开始运动
		}

		//事件处理

		if(currKey == 37) { //left
			moveEvent("left");
		}
		else if(currKey == 38) { //up
			moveEvent("top");
		}
		else if(currKey == 39) { //right
			moveEvent("right");
		}
		else if(currKey == 40) { //down
			moveEvent("bottom");
		}
		else {
			isDirect = false;
		}

		//阻止默认行为
		if(isDirect) {
			if(e.preventDefault) {
				e.preventDefault();
			}
			else if(e.returnValue) {
				e.returnValue = false;
			}
		}
	});
};

//初始化
function init() {
	createNew();
	createNew(2);
}

//随机生成新的2或4在盒子中
function createNew(a) {
	var parent = document.querySelector(".container");
	var newDiv = document.createElement("div");
	var arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
	var rand = Math.floor(10 * Math.random());  //下舍入
	var len = Elem.length;
	var randL = Math.ceil((16 - len) * Math.random()) - 1;

	//选择2或4插入
	if(rand >= 7 && !a) {
		newDiv.innerHTML = 4;
		newDiv.style.backgroundColor = colorInfo.bgColor['4'];
	}
	else {
		newDiv.innerHTML = 2;
		newDiv.style.backgroundColor = colorInfo.bgColor['2'];
	}

	//选择位置插入
	Elem.forEach(function(item, index, array) {
		var idx = arr.indexOf(parseInt(item.getAttribute("data-locat")));
		arr.splice(idx, 1);
	});
	var temp = arr[randL] % 4;
	var differ = Math. ceil(arr[randL] / 4);
	newDiv.setAttribute("data-locat", arr[randL] + '');
	newDiv.style.color = colorInfo.color2;	
	switch(temp) {
		case 0:
			newDiv.style.left = 4*8+105*3+"px";
			break;
		default:
			newDiv.style.left = (temp)*8+105*(temp-1)+"px";
			break;
	}
	newDiv.style.top = differ*8+105*(differ-1)+"px";
	newDiv.setAttribute("data-add", '');

	//插入页面中
	Elem.push(newDiv);
	parent.appendChild(newDiv);
}

//添加事件监听
function addHandler(element, type, handler) {
	if(element.addEventListener) {
		element.addEventListener(type, handler, false);
	}
	else if(element.attachEvent) {
		element.attachEvent("on" + type, handler);
	}
	else {
		element["on" + type] = handler;
	}
}

//生成相加后的数字
function add(elem) {
	elem.innerHTML = elem.innerHTML * 2;
	elem.style.backgroundColor = colorInfo.bgColor[elem.innerHTML + ''];
	if(elem.innerHTML > 4) {
		elem.style.color = colorInfo.other;
	}
}

//移动动画
function moveEvent(direct) {
	var arr = [[],[],[],[]];
	//先将元素数组排序
	Elem.sort(function(value1, value2) {
		var v1 = parseInt(value1.getAttribute("data-locat"));
		var v2 = parseInt(value2.getAttribute("data-locat"));
		if(v1 < v2) {
			return -1;
		}
		else {
			return 1;
		}
	});

	if(direct == "left" || direct == "right") {
		Elem.forEach(function(item) {
			var locat = parseInt(item.getAttribute("data-locat"));
			if(locat <= 4) {
				arr[0].push(item);
			}
			else if(locat <= 8) {
				arr[1].push(item);
			}
			else if(locat <= 12) {
				arr[2].push(item);
			}
			else {
				arr[3].push(item);
			}
		});
	}
	else {
		Elem.forEach(function(item) {
			var locat = parseInt(item.getAttribute("data-locat"));
			if(locat % 4 == 1) {
				arr[0].push(item);
			}
			else if(locat % 4 == 2) {
				arr[1].push(item);
			}
			else if(locat % 4 == 3) {
				arr[2].push(item);
			}
			else {
				arr[3].push(item);
			}
		});
	}

	//判断是否有相加
	if(direct == "left" && direct == "top") {
		arr.forEach(function(item) {
			if(item.length == 2 || item.length == 3) {
				if(item[0].innerHTML === item[1].innerHTML) {
					item[0].setAttribute("data-add", 1);
					item[1].setAttribute("data-add", 1);
				}
				else if(item.length == 3 && item[1].innerHTML === item[2].innerHTML) {
					item[1].setAttribute("data-add", 1);
					item[2].setAttribute("data-add", 1);
				}
			}
			else if(item.length == 4) {
				if(item[0].innerHTML === item[1].innerHTML) {
					item[0].setAttribute("data-add", 1);
					item[1].setAttribute("data-add", 1);
					if(item[2].innerHTML === item[3].innerHTML) {
						item[2].setAttribute("data-add", 1);
						item[3].setAttribute("data-add", 1);
					}
				}
				else if(item[1].innerHTML === item[2].innerHTML) {
					item[1].setAttribute("data-add", 1);
					item[2].setAttribute("data-add", 1);
				}
				else if(item[2].innerHTML === item[3].innerHTML) {
					item[2].setAttribute("data-add", 1);
					item[3].setAttribute("data-add", 1);
				}
			}	
		});
	}
	else {
		arr.forEach(function(item) {
			if(item.length == 2) {
				if(item[0].innerHTML === item[1].innerHTML) {
					item[0].setAttribute("data-add", 1);
					item[1].setAttribute("data-add", 1);
				}
			}
			else if(item.length == 3) {
				if(item[1].innerHTML === item[2].innerHTML) {
					item[1].setAttribute("data-add", 1);
					item[2].setAttribute("data-add", 1);
				}
				else if(item[0].innerHTML === item[1].innerHTML) {
					item[0].setAttribute("data-add", 1);
					item[1].setAttribute("data-add", 1);
				}
			}
			else if(item.length == 4) {
				if(item[2].innerHTML === item[3].innerHTML) {
					item[2].setAttribute("data-add", 1);
					item[3].setAttribute("data-add", 1);
					if(item[0].innerHTML === item[1].innerHTML) {
						item[0].setAttribute("data-add", 1);
						item[1].setAttribute("data-add", 1);
					}
				}
				else if(item[1].innerHTML === item[2].innerHTML) {
					item[1].setAttribute("data-add", 1);
					item[2].setAttribute("data-add", 1);
				}
				else if(item[0].innerHTML === item[1].innerHTML) {
					item[0].setAttribute("data-add", 1);
					item[1].setAttribute("data-add", 1);
				}
			}	
		});
	}

	//计算各个元素的位置
	
}