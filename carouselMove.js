+(function(w){
	w.feizhu = {};
	//轮播图，arr是图片数组
	w.feizhu.carousel = function carousel(arr){
				//布局
				var carouselWarp = document.querySelector(".carouselwarp");
				var pointWarp = document.querySelector(".pointwarp");
				var pointLength = arr.length;
				if(carouselWarp){
					//无缝处理，复制一组img
					var needCarouse = carouselWarp.getAttribute("needCarouse");
					if(needCarouse == null?false:true){
						arr = arr.concat(arr);
					}
					
					var ulNode = document.createElement("ul");
					var styleNode = document.createElement("style");
					feizhu.css(ulNode, "translateZ", 0.1);
					ulNode.classList.add("list");
					for(var i = 0; i < arr.length; i++){
						ulNode.innerHTML += '<li><a href="javascript:;"><img src="'+arr[i]+'" ></a></li>';
					}
					styleNode.innerHTML = ".carouselwarp > .list{width: "+arr.length*100+"%;}.carouselwarp > .list > li{width: "+1/arr.length*100+"%;}";
				}
				carouselWarp.appendChild(ulNode);
				document.head.appendChild(styleNode);
				//设置图片的高度
				var imgNode = document.querySelector("#warp .centent .carouselwarp .list li a > img");
				setTimeout(function(){
					carouselWarp.style.height = imgNode.offsetHeight+"px";
				},30) 
				
				if(pointWarp){
					for(var i = 0; i < pointLength; i++){
						if(i == 0){
							pointWarp.innerHTML += '<span class="active"></span>';
						}else{
							pointWarp.innerHTML += "<span></span>";
						}
					}
					var pointSpan = document.querySelectorAll(".carouselwarp > .pointwarp > span");
				}
				
				/*滑屏
				 * 	1.拿到元素一开始的位置
				 * 	2.拿到手指一开始点击的位置
				 * 	3.拿到手指move的实时距离
				 * 	4.将手指移动的距离加给元素
				 * */
				//滑屏操作
				var index = 0;
				var startX = 0;//手指开始位置
				var elementX = 0;//元素开始位置
				var startY = 0;
				var isX = true;//是否再X轴滑动的标识
				var isFirst = true;//是否第一次滑动的标识
				carouselWarp.addEventListener("touchstart",function(ev){
					ev = ev || event;
					var touchC = ev.changedTouches[0];
					startY = touchC.clientY;//第一根手指的浏览器页面坐标
					ulNode.style.transition = "none";
					//无缝
					/*点击第一组的第一张时 瞬间跳到第二组的第一张
					点击第二组的最后一张时  瞬间跳到第一组的最后一张*/
					//index代表ul的位置
					if(needCarouse){
						var index = feizhu.css(ulNode, "translateX")/document.documentElement.clientWidth;
						if(index == 0){
							index = -pointLength;
						}else if(-index == arr.length - 1){
							index = -(pointLength - 1);
						}
						feizhu.css(ulNode, "translateX", index*(document.documentElement.clientWidth))
					}
					
					startX = touchC.clientX;
					elementX = feizhu.css(ulNode, "translateX");
					//console.log(elementX);
					clearInterval(timer);
					isX = true;
					isFirst = true;
				})
				/* console.log(startX);
				console.log(translateX); */
				carouselWarp.addEventListener("touchmove",function(ev){
					if(!isX){
						return;
					}
					ev = ev || event;
					var touchC = ev.changedTouches[0];
					var nowX = touchC.clientX - startX;
					var nowY = touchC.clientY - startY;
					feizhu.css(ulNode, "translateX", elementX + nowX)
					//translateX = elementX + nowX;
					//ulNode.style.transform = "translate("+translateX+"px)";
					//console.log(translateX);
					//防抖动逻辑
					if(isFirst){
						isFirst = false;
						if(Math.abs(nowY) > Math.abs(nowX)){
							isX = false;
							return;
						}
					}
				})
				carouselWarp.addEventListener("touchend",function(ev){
					ev = ev || event;
					//index抽象了元素的位置
					//元素移动的距离/屏幕的宽度
					var index = feizhu.css(ulNode, "translateX")/document.documentElement.clientWidth;
					index = Math.round(index);//四舍五入，图片过半就切换 
					if(index > 0){
						index = 0;
					}else if(index < 1-arr.length){
						index = 1-arr.length;
					}
					//console.log(index);
					ulNode.style.transition = ".5s transform";
					//translateX = index*(document.documentElement.clientWidth);
					//ulNode.style.transform = "translate("+translateX+"px)";
					feizhu.css(ulNode, "translateX", index*(document.documentElement.clientWidth))
					yuandianAuto(index);
					if(needauto){
						auto(index);
					}
				})
				
				//自动轮播
				var needauto = carouselWarp.getAttribute("needAuto");
				var timer = 0;
				needauto = needauto == null?false:true;
				if(needauto){
					auto(index);
				}
				//自动轮播图
				function auto(index){
					clearInterval(timer);
					timer = setInterval(function(){
						if(index == 1-arr.length){
							ulNode.style.transition = "none";
							index = -Math.round(arr.length/2)+1;
							feizhu.css(ulNode, "translateX", index*(document.documentElement.clientWidth));
						}
						index--;
						ulNode.style.transition = "1s transform";
						yuandianAuto(index);
						feizhu.css(ulNode, "translateX", index*(document.documentElement.clientWidth));
						//console.log(index);
					},2000)
				}
				//控制导航小圆点
				function yuandianAuto(index){
					if(!index){
						return;
					}
					for(var i =0; i < pointSpan.length; i++){
						pointSpan[i].classList.remove("active");
					}
					pointSpan[-index%pointLength].classList.add("active");
				}
			}
	//设置和读取transform属性，node——节点。type——transform属性名(""),value——属性值
	w.feizhu.css = function(node, type, value){
		//当有3个参数是是写入，有2个参数时则读取。
		if(typeof node === "object" && typeof node["transform"] == "undefined"){
			node["transform"] = {};
		}
		
		
		if(arguments.length >= 3){
			//写入
			var text = "";
			node["transform"][type] = value;
			for (var item in node["transform"]) {
				if(node["transform"].hasOwnProperty(item)){
					switch (item){
						case "translateX":
						case "translateY":
						case "translateZ":
							text += item + "("+node["transform"][item]+"px)";
							break;
					}
				}
			}
			node.style.transform = node.style.webkitTransform = text;
		}else if(arguments.length == 2){
			//读取
			value = node["transform"][type];
			if(typeof value == "undefined"){
				switch (type){
					case "translateX":
					case "translateY":
					case "translateZ":
						value = 0;
						break;
				}
			}
			return value;
		}
		
		
	}
	//橡皮筋+惯性拖动逻辑，nav——容器。list——元素列表
	w.feizhu.drag = function(nav, list){
		var nav = nav;
		var list = list;
		//手指一开始的位置
		var startX = 0;
		//元素一开始的位置
		var elementX = 0;
		//元素向左滑动最大的尺寸
		var dragX = -(list.offsetWidth - nav.clientWidth);
		//快速滑屏参数
		var starttime = 0;
		var startpoint = 0;
		var nowtime = 0;
		var nowpoint = 0;
		//如果timedis初始值为0，那如果第一次没有经过move速度就会一直是0，无法滑动。
		var timedis = 1;
		var pointdis = 0;

		nav.addEventListener("touchstart",function(ev){
			ev = ev || event;
			list.style.transition = "none";
			var touchX = ev.changedTouches[0];
			startX = touchX.clientX;//第一根手指的浏览器页面坐标
			elementX = feizhu.css(list, "translateX");//读取此时滑动元素的translateX
			//快速滑屏参数获取
			starttime = new Date().getTime();
			startpoint = touchX.clientX;
			pointdis = 0;
		})
		
		nav.addEventListener("touchmove",function(ev){
			ev = ev || event;
			var touchX = ev.changedTouches[0];
			var disX = touchX.clientX - startX;
			var translateX = elementX + disX;
			//初始化橡皮筋效果比例变量,可以说是阻力系数
			var rubber = 0;
			//快速滑屏参数获取
			nowtime = new Date().getTime();
			nowpoint = touchX.clientX;
			timedis = nowtime - starttime;
			pointdis = nowpoint - startpoint;
			list.handmove = false;
			//starttime = nowtime;
			//startpoint = nowpoint;
			/*橡皮筋效果
			 * 
			 * 在move的过程中，每一次touchmove真正的有效距离慢慢变小，元素的滑动距离还是在变大
			 * 
			 * */
			 if(translateX > 0){
				list.handmove = true;
				rubber = document.documentElement.clientWidth/(document.documentElement.clientWidth + translateX)*1.5;
				translateX = elementX + disX*rubber;
				feizhu.css(list, "translateX", translateX);
			 }else if(translateX < dragX){
				list.handmove = true;
				var over = -(translateX - dragX);
				rubber = document.documentElement.clientWidth/(document.documentElement.clientWidth + over)*1.5;
				translateX = elementX + disX*rubber;
				feizhu.css(list, "translateX", translateX);
			 }
			feizhu.css(list, "translateX", translateX);
		})
		
		nav.addEventListener("touchend",function(ev){
			var translateX = feizhu.css(list, "translateX");
			//快速滑屏实现
			if(list.handmove===true){
				//橡皮筋效果
				list.style.transition = ".25s transform";
				if(translateX > 0){
					translateX = 0;
					feizhu.css(list, "translateX", translateX);
				}else if(translateX < dragX){
					translateX = dragX;
					feizhu.css(list, "translateX", translateX);
				}
			}else{
				var speed = pointdis/timedis;
				speed = Math.abs(speed) < 2 ? 0:speed;
				var targetX = translateX + speed*200;
				var time = Math.abs(speed) *0.2;
				//time = time<0.8?0.8:time;
				//time = time>2?2:time;
				var bsr = "";
				
				if(targetX > 0){
					targetX = 0;
					bsr = "cubic-bezier(.26,1.51,.68,1.54)";
				}else if(targetX < dragX){
					targetX = dragX;
					bsr = "cubic-bezier(.26,1.51,.68,1.54)";
				}
				list.style.transition = time+"s "+bsr+" transform";
				feizhu.css(list, "translateX", targetX);
			}
			
		})
	}
	//纵向滑屏
	w.feizhu.dragY = function(nav, list, callBack){
		var nav = nav;
		var list = list;
		//手指一开始的位置
		var startY = 0;
		//元素一开始的位置
		var elementY = 0;
		//元素向左滑动最大的尺寸
		var dragY = -(list.offsetHeight - nav.clientHeight);
		//快速滑屏参数
		var starttime = 0;
		var startpoint = 0;
		var nowtime = 0;
		var nowpoint = 0;
		//如果timedis初始值为0，那如果第一次没有经过move速度就会一直是0，无法滑动。
		var timedis = 1;
		var pointdis = 0;
		var timer = 0;
		//Tween算法，可以做很多动画，详细自己谷歌
		var Tween = {
		    Linear: function(t,b,c,d){ return c*t/d + b; },
		    Quad: {
		        easeIn: function(t,b,c,d){
		            return c*(t/=d)*t + b;
		        },
		        easeOut: function(t,b,c,d){
		            return -c *(t/=d)*(t-2) + b;
		        },
		        easeInOut: function(t,b,c,d){
		            if ((t/=d/2) < 1) return c/2*t*t + b;
		            return -c/2 * ((--t)*(t-2) - 1) + b;
		        }
		    },
		    Cubic: {
		        easeIn: function(t,b,c,d){
		            return c*(t/=d)*t*t + b;
		        },
		        easeOut: function(t,b,c,d){
		            return c*((t=t/d-1)*t*t + 1) + b;
		        },
		        easeInOut: function(t,b,c,d){
		            if ((t/=d/2) < 1) return c/2*t*t*t + b;
		            return c/2*((t-=2)*t*t + 2) + b;
		        }
		    },
		    Quart: {
		        easeIn: function(t,b,c,d){
		            return c*(t/=d)*t*t*t + b;
		        },
		        easeOut: function(t,b,c,d){
		            return -c * ((t=t/d-1)*t*t*t - 1) + b;
		        },
		        easeInOut: function(t,b,c,d){
		            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		            return -c/2 * ((t-=2)*t*t*t - 2) + b;
		        }
		    },
		    Quint: {
		        easeIn: function(t,b,c,d){
		            return c*(t/=d)*t*t*t*t + b;
		        },
		        easeOut: function(t,b,c,d){
		            return c*((t=t/d-1)*t*t*t*t + 1) + b;
		        },
		        easeInOut: function(t,b,c,d){
		            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		            return c/2*((t-=2)*t*t*t*t + 2) + b;
		        }
		    },
		    Sine: {
		        easeIn: function(t,b,c,d){
		            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		        },
		        easeOut: function(t,b,c,d){
		            return c * Math.sin(t/d * (Math.PI/2)) + b;
		        },
		        easeInOut: function(t,b,c,d){
		            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		        }
		    },
		    Expo: {
		        easeIn: function(t,b,c,d){
		            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		        },
		        easeOut: function(t,b,c,d){
		            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		        },
		        easeInOut: function(t,b,c,d){
		            if (t==0) return b;
		            if (t==d) return b+c;
		            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		        }
		    },
		    Circ: {
		        easeIn: function(t,b,c,d){
		            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		        },
		        easeOut: function(t,b,c,d){
		            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		        },
		        easeInOut: function(t,b,c,d){
		            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		        }
		    },
		    Elastic: {
		        easeIn: function(t,b,c,d,a,p){
		            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		            else var s = p/(2*Math.PI) * Math.asin (c/a);
		            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		        },
		        easeOut: function(t,b,c,d,a,p){
		            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		            else var s = p/(2*Math.PI) * Math.asin (c/a);
		            return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
		        },
		        easeInOut: function(t,b,c,d,a,p){
		            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		            else var s = p/(2*Math.PI) * Math.asin (c/a);
		            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		        }
		    },
		    Back: {
		        easeIn: function(t,b,c,d,s){
		            if (s == undefined) s = 1.70158;
		            return c*(t/=d)*t*((s+1)*t - s) + b;
		        },
		        easeOut: function(t,b,c,d,s){
		            if (s == undefined) s = 1.70158;
		            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		        },
		        easeInOut: function(t,b,c,d,s){
		            if (s == undefined) s = 1.70158; 
		            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		        }
		    },
		    Bounce: {
		        easeIn: function(t,b,c,d){
		            return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
		        },
		        easeOut: function(t,b,c,d){
		            if ((t/=d) < (1/2.75)) {
		                return c*(7.5625*t*t) + b;
		            } else if (t < (2/2.75)) {
		                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		            } else if (t < (2.5/2.75)) {
		                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		            } else {
		                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		            }
		        },
		        easeInOut: function(t,b,c,d){
		            if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
		            else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
		        }
		    }
		}
	
		nav.addEventListener("touchstart",function(ev){
			ev = ev || event;
			list.style.transition = "none";
			var touchY = ev.changedTouches[0];
			startY = touchY.clientY;//第一根手指的浏览器页面坐标
			elementY = feizhu.css(list, "translateY");//读取此时滑动元素的translateX
			//快速滑屏参数获取
			starttime = new Date().getTime();
			startpoint = touchY.clientY;
			pointdis = 0;
			clearInterval(timer);
			
			if(callBack && typeof callBack["start"] === "function"){
				callBack["start"].call(list);
			}
		})
		
		nav.addEventListener("touchmove",function(ev){
			ev = ev || event;
			var touchY = ev.changedTouches[0];
			var disY = touchY.clientY - startY;
			var translateY = elementY + disY;
			//初始化橡皮筋效果比例变量,可以说是阻力系数
			var rubber = 0;
			//快速滑屏参数获取
			nowtime = new Date().getTime();
			nowpoint = touchY.clientY;
			timedis = nowtime - starttime;
			pointdis = nowpoint - startpoint;
			list.handmove = false;
			//starttime = nowtime;
			//startpoint = nowpoint;
			/*橡皮筋效果
			 * 
			 * 在move的过程中，每一次touchmove真正的有效距离慢慢变小，元素的滑动距离还是在变大
			 * 
			 * */
			 if(translateY > 0){
				list.handmove = true;
				rubber = document.documentElement.clientWidth/(document.documentElement.clientWidth + translateY)*1.5;
				translateY = elementY + disY*rubber;
				feizhu.css(list, "translateY", translateY);
			 }else if(translateY < dragY){
				list.handmove = true;
				var over = -(translateY - dragY);
				rubber = document.documentElement.clientWidth/(document.documentElement.clientWidth + over)*1.5;
				translateY = elementY + disY*rubber;
				feizhu.css(list, "translateY", translateY);
			 }
			feizhu.css(list, "translateY", translateY);
			
			if(callBack && typeof callBack["move"] === "function"){
				callBack["move"].call(list);
			}
		})
		
		nav.addEventListener("touchend",function(ev){
			var translateY = feizhu.css(list, "translateY");
			//快速滑屏实现
			if(list.handmove===true){
				//橡皮筋效果
				list.style.transition = ".25s transform";
				if(translateY > 0){
					translateY = 0;
					feizhu.css(list, "translateY", translateY);
				}else if(translateY < dragY){
					translateY = dragY;
					feizhu.css(list, "translateY", translateY);
				}
				
				if(callBack && typeof callBack["end"] === "function"){
					callBack["end"].call(list);
				}
			}else{
				var speed = pointdis/timedis;
				speed = Math.abs(speed) < 1 ? 0:speed;
				var targetY = translateY + speed*200;
				var time = Math.abs(speed) *0.2;
				time = time<0.8?0.8:time;
				time = time>2?2:time;
				//var bsr = "";
				//设定一个变量，使用Tween类。
				var type = "Cubic";
				
				if(targetY > 0){
					targetY = 0;
					type = "Back";
					//bsr = "cubic-bezier(.26,1.51,.68,1.54)";
				}else if(targetY < dragY){
					targetY = dragY;
					type = "Back";
					//bsr = "cubic-bezier(.26,1.51,.68,1.54)";
				}
				//list.style.transition = time+"s "+bsr+" transform";
				//feizhu.css(list, "translateY", targetY);
				touchStop(type, targetY, time);
			}
			
		})
		function touchStop(type, target, time){
			clearInterval(timer);
			/* 
			t: current time（当前时间）；
			b: beginning value（初始值）；
			c: change in value（变化量）；
			d: duration（持续时间）。 
			*/
		   //当前时间，初始化，用定时器自增。
		   var t = 0;
		   //初始值（初始位置），直接获取。
		   var b = feizhu.css(list, "translateY");
		   //变化量（产生的位移），用终点-起点。
		   var c = target - b;
		   //持续时间（总时间），惯性的持续时间（换算秒）/每一帧的时间
		   var d = time *1000 / (1000/120);
		   timer = setInterval(function(){
			   t++;
			   if(t > d){
				   clearInterval(timer);
				   if(callBack && typeof callBack["end"] === "function"){
				   	callBack["end"].call(list);
				   }
			   }
			   if(type === "Cubic"){
				    var point = Tween[type].easeOut(t, b, c, d);
			   }else if(type === "Back"){
				   var point = Tween[type].easeOut(t, b, c, d);
			   }
			   feizhu.css(list, "translateY", point);
			   if(callBack && typeof callBack["move"] === "function"){
			   	callBack["move"].call(list);
			   }
		   },1000/120);
		}
	}
})(window)