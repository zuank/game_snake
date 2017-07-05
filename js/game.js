$(function() {

	var snake = {
		snakeContent: $("#gameContent"),
		snakeCell: $("#gameContent span"),
		headOfSnake: $("#gameContent span").eq(0),
		canClickToMove:true, //修复快去点击造成的卡死现象
		controlPosition: {   
			"x": $("#gameContent span").width(),
			"y": 0
		},
		gamearea: {
			"left": 0,
			"top": 0,
			"right": $("#gameContent").width() - $("#gameContent span").width(),
			"bottom": $("#gameContent").height() - $("#gameContent span").height()
		},
		Random: {
			"x":20,
			"y":0
		},

		init: function() {
			this.drawContent();
			this.addRandomTag();
			this.toMoveUp();
			this.addKeyEvent();
		},

		drawContent: function() {
			for (var i = 0; i < this.snakeCell.length; i++) {
				this.snakeCell.eq(i).css({
					"left": (this.snakeCell.length - 1 - i) * 20 + "px",
					"top": "0"
				});
			}
			
			this.snakeContent.show();
		},

		toMoveUp: function() {

			var self = this;

			timer = setInterval(function() {

				//碰撞检测
				if (!self.collisionDetection({
						"x": parseInt(self.headOfSnake.css("left")),
						"y": parseInt(self.headOfSnake.css("top"))
					}, self.controlPosition)) {
					return;
				}
				//吃苹果检测
				self.addSnakeCell({
					"x": parseInt(self.headOfSnake.css("left")),
					"y": parseInt(self.headOfSnake.css("top"))
				}, self.controlPosition);

				for (var i = self.snakeCell.length - 1; i >= 0; i--) {
					/*除第一个节点   其余节点跟随前一个节点的offset*/
					if (i > 0) {
						self.snakeCell.eq(i).css({
							"left": self.snakeCell.eq(i - 1).css("left"),
							"top": self.snakeCell.eq(i - 1).css("top")
						});
					}
				}

				/*第一个节点根据controlPosition更新位置*/
				self.headOfSnake.css({
					"left": parseInt(self.headOfSnake.css("left")) + self.controlPosition.x + "px",
					"top": parseInt(self.headOfSnake.css("top")) + self.controlPosition.y + "px"
				});
				
				self.canClickToMove=true;
			}, 500)

		},

		addKeyEvent: function() {
			var self = this;
			$(window).on("keydown", function(e) {
				//判断是否执行了上一次键盘事件
				if(!self.canClickToMove){
					return false;
				}
				
				switch (e.keyCode) {
					//左
					case 37:

						if (self.controlPosition.x == 20) {
							return;
						}

						self.controlPosition = {
							"x": -20,
							"y": 0
						};
						break;
						//上
					case 38:
						if (self.controlPosition.y == 20) {
							return;
						}
						self.controlPosition = {
							"x": 0,
							"y": -20
						};
						break;
						//右
					case 39:
						if (self.controlPosition.x == -20) {
							return;
						}
						self.controlPosition = {
							"x": 20,
							"y": 0
						};
						break;
						//下
					case 40:
						if (self.controlPosition.y == -20) {
							return;
						}
						self.controlPosition = {
							"x": 0,
							"y": 20
						};
						break;
				}
				
				self.canClickToMove=false;
			})
		},

		//碰撞检测(当前位置，运动方向)
		collisionDetection: function(nowposition, changeposition) {

			//自身碰撞
			for (var i = 1; i < this.snakeCell.length - 1; i++) {
				if (nowposition.x + changeposition.x == parseInt(this.snakeCell.eq(i).css("left")) && nowposition.y + changeposition.y == parseInt(this.snakeCell.eq(i).css("top"))) {
					return false;
				}
			}

			//墙壁碰撞
			if (nowposition.x + changeposition.x >= this.gamearea.left &&
				nowposition.x + changeposition.x <= this.gamearea.right &&
				nowposition.y + changeposition.y >= this.gamearea.top &&
				nowposition.y + changeposition.y <= this.gamearea.bottom) {
				return true;
			}
			return false;
		},

		//添加随机节点
		addRandomTag: function() {
			while (!this.ifRandomPosition()) {
				this.Random = {
					"x": parseInt(Math.random() * (this.gamearea.right / $("#gameContent span").width() + 1)) * 20,
					"y": parseInt(Math.random() * (this.gamearea.bottom / $("#gameContent span").width() + 1)) * 20
				};
			}
			randTag = "<em class='apple' style='top:" + this.Random.y + "px;left:" + this.Random.x + "px'></em>";

			this.snakeContent.append(randTag);
		},

		ifRandomPosition: function() {
			for (var i = 0; i < this.snakeCell.length; i++) {
				if (this.Random.x == parseInt(this.snakeCell.eq(i).css("left"))+this.controlPosition.x && this.Random.y == parseInt(this.snakeCell.eq(i).css("top"))+this.controlPosition.y) {
					return false;
				}
			}
			return true;
		},
		//判断吃到苹果 添加snakeCell节点
		addSnakeCell: function(nowposition, changeposition) {

			if (nowposition.x + changeposition.x == this.Random.x && nowposition.y + changeposition.y == this.Random.y) {
				$(".apple").remove();
				this.snakeContent.append("<span></span>");
				this.addRandomTag();
				//重写snakeCell对象
				this.snakeCell = $("#gameContent span");
			}

		}
	}

	snake.init();

})