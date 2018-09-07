/**
* 主游戏容器
*/
module Plane {
	export class GameMain extends egret.DisplayObjectContainer {
		public constructor() {
			super();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
		}

		/**
		 * 初始化
		 */
		private init() {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
			this.CreateScene();
		}

		/**
		 * 游戏背景
		 */
		private bg: Plane.BgMap;
		/**
		 * 我的飞机
		 */
		private myPlane: Plane.AirPlane;
		/**
		 * 显示成绩类
		 */
		private scorePanel: ScorePanel;
		/**我的成绩 */
		private myScore: number;
		/**我的子弹*/
		private myBullets: Plane.Bullet[] = [];
		/**敌人的飞机 */
		private enemyPlane: Plane.AirPlane[] = [];
		/**创建敌人飞机事件间隔 */
		private enemyPlaneTimer: egret.Timer = new egret.Timer(1000);
		/**敌人的子弹 */
		private enemyBullet: Plane.Bullet[] = [];
		/**敌机飞行速度 */
		private enemySpeed: number = 5;
		/**@private*/
		private _lastTime: number;

		//跳转之后的场景
		private CreateScene() {
			//创建背景
			this.bg = new Plane.BgMap();
			this.addChild(this.bg);
			//创建主角飞机
			this.myPlane = new AirPlane(RES.getRes("f1_png"), 100, "f1_png");

			this.myPlane.x = (GameConst.StageW - this.myPlane.width) / 2;
			this.myPlane.y = GameConst.StageH - 120;
			this.addChild(this.myPlane);
			//显示分数类
			this.scorePanel = new ScorePanel();
			this.gameStart();
		}

		/**预创建一些对象 */
		private preCreateInstance() {
			let i: number = 0;
			let objArr: any[] = [];
			for (i = 0; i < 20; i++) {
				let bullet = Plane.Bullet.produce("b1_png");
				objArr.push(bullet);
			}
			for (i = 0; i < 20; i++) {
				bullet = objArr.pop();
				Plane.Bullet.Destroy(bullet);
			}
			for (i = 0; i < 20; i++) {
				var bullet = Plane.Bullet.produce("b2");
				objArr.push(bullet);
			}
			for (i = 0; i < 20; i++) {
				bullet = objArr.pop();
				Plane.Bullet.Destroy(bullet);
			}
			for (i = 0; i < 20; i++) {
				var enemyFighter: Plane.AirPlane = Plane.AirPlane.produce("f2", 1000);
				objArr.push(enemyFighter);
			}
			for (i = 0; i < 20; i++) {
				enemyFighter = objArr.pop();
				Plane.AirPlane.Destory(enemyFighter);
			}
		}

		/**开始游戏 */
		private gameStart(): void {
			this.myScore = 0;
			this.bg.start();
			this.touchEnabled = true;
			this.addEventListener(egret.Event.ENTER_FRAME, this.UpdataGameView, this);
			this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);

			//飞机开火
			this.myPlane.Fire();
			this.myPlane.blood = 10;
			//创建子弹
			this.myPlane.addEventListener("createBullet", this.createBulletHandler, this);
			//敌机产生
			this.enemyPlaneTimer.addEventListener(egret.TimerEvent.TIMER, this.createEnemyPlane, this);
			//计时器开始
			this.enemyPlaneTimer.start();
			if (this.scorePanel.parent == this) {
				this.removeChild(this.scorePanel);
			}
		}
		/**飞机移动 */
		private touchMove(event: egret.TouchEvent) {
			if (event.type == egret.TouchEvent.TOUCH_MOVE) {
				let tex: number = event.localX;
				tex = Math.max(0, tex);
				tex = Math.min(GameConst.StageW - this.myPlane.width, tex);
				this.myPlane.x = tex;
			}
		}

		/**发射子弹 */
		private createBulletHandler(event: egret.Event) {
			let bullet: Bullet;
			if (event.target == this.myPlane) {
				for (let i: number = 0; i < 2; i++) {
					bullet = Plane.Bullet.produce("b2_png");
					bullet.x = i == 0 ? (this.myPlane.x + 10) : (this.myPlane.x + this.myPlane.width - 22);
					bullet.y = this.myPlane.y + 30;
					this.addChildAt(bullet, this.numChildren - 1 - this.enemyPlane.length);
					//生成的子弹存入数组
					this.myBullets.push(bullet)
				}
			} else {
				let thePlane: AirPlane = event.target;
				bullet = Plane.Bullet.produce("b1_png");
				bullet.x = thePlane.x + 28;
				bullet.y = thePlane.y + 10;
				this.addChildAt(bullet, this.numChildren - 1 - this.enemyPlane.length);
				this.enemyBullet.push(bullet);
			}
		}
		/**创建敌机 */
		private createEnemyPlane(event: egret.TimerEvent) {
			let enemPlane: Plane.AirPlane = Plane.AirPlane.produce("f2_png", 1000);
			enemPlane.x = Math.random() * (GameConst.StageW - enemPlane.width);
			enemPlane.y = -enemPlane.height - Math.random() * 300;
			enemPlane.addEventListener("createBullet", this.createBulletHandler, this);
			enemPlane.Fire();

			this.addChildAt(enemPlane, this.numChildren - 1);
			this.enemyPlane.push(enemPlane);
		}
		/**刷新游戏画面 */
		private UpdataGameView(event: egret.TimerEvent) {
			//为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
			var nowTime: number = egret.getTimer();
			var fps: number = 1000 / (nowTime - this._lastTime);
			this._lastTime = nowTime;
			var speedOffset: number = 60 / fps;
			//我的子弹运动
			var Mybullet: Plane.Bullet;
			//我的子弹数量
			let myBulletsNum: number = this.myBullets.length;
			for (let i: number = 0; i < myBulletsNum; i++) {
				Mybullet = this.myBullets[i];
				if (Mybullet.y < -Mybullet.height) {
					
					try {
						this.removeChild(Mybullet);
					} catch (error) {
						console.log(error);
					}
					Plane.Bullet.Destroy(Mybullet);
					this.myBullets.splice(i, 1)
					i--;
					myBulletsNum--;
				}
				Mybullet.y -= 12 * speedOffset;
			}

			//敌人飞机运动
			let enemPlane: Plane.AirPlane;
			let enemPlaneNum: number = this.enemyPlane.length;
			for (let i: number = 0; i < enemPlaneNum; i++) {
				enemPlane = this.enemyPlane[i];
				//敌机运动到舞台底部
				if (enemPlane.y > GameConst.StageH) {
					this.removeChild(enemPlane);
					Plane.AirPlane.Destory(enemPlane);
					enemPlane.removeEventListener("createBullet", this.createBulletHandler, this);
					enemPlane.stopFire();
					this.enemyPlane.splice(i, 1);
					i--;
					enemPlaneNum--;
				}
				//敌机飞行速度
				enemPlane.y += 4 * speedOffset;
			}

			//敌人子弹运动
			let bullet: Plane.Bullet;
			let enemybulletNum: number = this.enemyBullet.length;
			for (let i: number = 0; i < enemybulletNum; i++) {
				bullet = this.enemyBullet[i];

				if (bullet.y > GameConst.StageH) {
					try {
						this.removeChild(bullet);
					} catch (error) {
						console.log(error);
					}
					Plane.Bullet.Destroy(bullet);
					this.enemyBullet.splice(i, 1);
					i--;
					enemybulletNum--;
				}
				bullet.y += 8 * speedOffset;
			}

			//碰撞检测
			this.gameHitTest();
		}
		/**游戏碰撞检测 */
		private gameHitTest() {
			var i:number,j:number;
            var bullet:Plane.Bullet;
            var theFighter:Plane.AirPlane;
            var myBulletsCount:number = this.myBullets.length;
            var enemyFighterCount:number = this.enemyPlane.length;
            var enemyBulletsCount:number = this.enemyBullet.length;
            //将需消失的子弹和飞机记录
            var delBullets:Plane.Bullet[] = [];
            var delFighters:Plane.AirPlane[] = [];
            //我的子弹可以消灭敌机
            for(i=0;i<myBulletsCount;i++) {
                bullet = this.myBullets[i];
                for(j=0;j<enemyFighterCount;j++) {
                    theFighter = this.enemyPlane[j];
                    if(Plane.GameCheck.GetInstance.hitTest(theFighter,bullet)) {
                        theFighter.blood -= 2;
                        if(delBullets.indexOf(bullet)==-1)
                            delBullets.push(bullet);
                        if(theFighter.blood<=0 && delFighters.indexOf(theFighter)==-1)
                            delFighters.push(theFighter);
                    }
                }
            }
            //敌人的子弹可以减我血
            for(i=0;i<enemyBulletsCount;i++) {
                bullet = this.enemyBullet[i];
                if(Plane.GameCheck.GetInstance.hitTest(this.myPlane,bullet)) {
                    this.myPlane.blood -= 1;
                    if(delBullets.indexOf(bullet)==-1)
                        delBullets.push(bullet);
                }
            }
            //敌机的撞击可以消灭我
            for(i=0;i<enemyFighterCount;i++) {
                theFighter = this.enemyPlane[i];
                if(Plane.GameCheck.GetInstance.hitTest(this.myPlane,theFighter)) {
                    this.myPlane.blood -= 10;
                }
            }
            if(this.myPlane.blood<=0) {
                this.gameStop();
            } else {
				while(delBullets.length>0) {
					bullet = delBullets.pop();
					this.removeChild(bullet);
					if(bullet.textureName=="b2_png")
						this.myBullets.splice(this.myBullets.indexOf(bullet),1);
					else
						this.enemyBullet.splice(this.enemyBullet.indexOf(bullet),1);
					Plane.Bullet.Destroy(bullet);
				}
				this.myScore += delFighters.length;
				while(delFighters.length>0) {
					theFighter = delFighters.pop();
					theFighter.stopFire();
					theFighter.removeEventListener("createBullet",this.createBulletHandler,this);
					this.removeChild(theFighter);
					this.enemyPlane.splice(this.enemyPlane.indexOf(theFighter),1);
					Plane.AirPlane.Destory(theFighter);
				}
            }
		}

		/**游戏结束 */
		private gameStop() {
			console.log("游戏结束");
			this.bg.pause();
			//把移动去除
			this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
			//帧事件去除
			this.removeEventListener(egret.Event.ENTER_FRAME, this.UpdataGameView, this);

			this.myPlane.stopFire();
			this.myPlane.removeEventListener("createBullet", this.createBulletHandler, this);
			this.enemyPlaneTimer.removeEventListener(egret.Event.ENTER_FRAME, this.createEnemyPlane, this);
			this.enemyPlaneTimer.stop();
			//清理我的子弹
			console.log(this.myBullets.length);
			for(let i = 0; i < this.myBullets.length; i++) {
				this.removeChild(this.myBullets[i]);
			}
			//清理敌人子弹
			for(let i:number = 0; i < this.enemyBullet.length; i++) {
				this.removeChild(this.enemyBullet[i]);
			}
			//清理敌机
			for(let i:number = 0; i < this.enemyPlane.length; i++) {
				//
				this.enemyPlane[i].removeEventListener("createBullet", this.createBulletHandler, this);
				this.removeChild(this.enemyPlane[i]);
			}
			// 显示成绩
			this.scorePanel.showScore(this.myScore);
			this.scorePanel.x = GameConst.StageW / 2 - this.scorePanel.width / 2;
			this.scorePanel.y = 150;
			this.addChild(this.scorePanel);
		}

	}
}

