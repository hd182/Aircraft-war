var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
* 主游戏容器
*/
var Plane;
(function (Plane) {
    var GameMain = (function (_super) {
        __extends(GameMain, _super);
        function GameMain() {
            var _this = _super.call(this) || this;
            /**我的子弹*/
            _this.myBullets = [];
            /**敌人的飞机 */
            _this.enemyPlane = [];
            /**创建敌人飞机事件间隔 */
            _this.enemyPlaneTimer = new egret.Timer(1000);
            /**敌人的子弹 */
            _this.enemyBullet = [];
            /**敌机飞行速度 */
            _this.enemySpeed = 5;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.init, _this);
            return _this;
        }
        /**
         * 初始化
         */
        GameMain.prototype.init = function () {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
            this.CreateScene();
        };
        //跳转之后的场景
        GameMain.prototype.CreateScene = function () {
            //创建背景
            this.bg = new Plane.BgMap();
            this.addChild(this.bg);
            //创建主角飞机
            this.myPlane = new Plane.AirPlane(RES.getRes("f1_png"), 100, "f1_png");
            this.myPlane.x = (GameConst.StageW - this.myPlane.width) / 2;
            this.myPlane.y = GameConst.StageH - 120;
            this.addChild(this.myPlane);
            //显示分数类
            this.scorePanel = new ScorePanel();
            this.gameStart();
        };
        /**预创建一些对象 */
        GameMain.prototype.preCreateInstance = function () {
            var i = 0;
            var objArr = [];
            for (i = 0; i < 20; i++) {
                var bullet_1 = Plane.Bullet.produce("b1_png");
                objArr.push(bullet_1);
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
                var enemyFighter = Plane.AirPlane.produce("f2", 1000);
                objArr.push(enemyFighter);
            }
            for (i = 0; i < 20; i++) {
                enemyFighter = objArr.pop();
                Plane.AirPlane.Destory(enemyFighter);
            }
        };
        /**开始游戏 */
        GameMain.prototype.gameStart = function () {
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
        };
        /**飞机移动 */
        GameMain.prototype.touchMove = function (event) {
            if (event.type == egret.TouchEvent.TOUCH_MOVE) {
                var tex = event.localX;
                tex = Math.max(0, tex);
                tex = Math.min(GameConst.StageW - this.myPlane.width, tex);
                this.myPlane.x = tex;
            }
        };
        /**发射子弹 */
        GameMain.prototype.createBulletHandler = function (event) {
            var bullet;
            if (event.target == this.myPlane) {
                for (var i = 0; i < 2; i++) {
                    bullet = Plane.Bullet.produce("b2_png");
                    bullet.x = i == 0 ? (this.myPlane.x + 10) : (this.myPlane.x + this.myPlane.width - 22);
                    bullet.y = this.myPlane.y + 30;
                    this.addChildAt(bullet, this.numChildren - 1 - this.enemyPlane.length);
                    //生成的子弹存入数组
                    this.myBullets.push(bullet);
                }
            }
            else {
                var thePlane = event.target;
                bullet = Plane.Bullet.produce("b1_png");
                bullet.x = thePlane.x + 28;
                bullet.y = thePlane.y + 10;
                this.addChildAt(bullet, this.numChildren - 1 - this.enemyPlane.length);
                this.enemyBullet.push(bullet);
            }
        };
        /**创建敌机 */
        GameMain.prototype.createEnemyPlane = function (event) {
            var enemPlane = Plane.AirPlane.produce("f2_png", 1000);
            enemPlane.x = Math.random() * (GameConst.StageW - enemPlane.width);
            enemPlane.y = -enemPlane.height - Math.random() * 300;
            enemPlane.addEventListener("createBullet", this.createBulletHandler, this);
            enemPlane.Fire();
            this.addChildAt(enemPlane, this.numChildren - 1);
            this.enemyPlane.push(enemPlane);
        };
        /**刷新游戏画面 */
        GameMain.prototype.UpdataGameView = function (event) {
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime = egret.getTimer();
            var fps = 1000 / (nowTime - this._lastTime);
            this._lastTime = nowTime;
            var speedOffset = 60 / fps;
            //我的子弹运动
            var Mybullet;
            //我的子弹数量
            var myBulletsNum = this.myBullets.length;
            for (var i = 0; i < myBulletsNum; i++) {
                Mybullet = this.myBullets[i];
                if (Mybullet.y < -Mybullet.height) {
                    try {
                        this.removeChild(Mybullet);
                    }
                    catch (error) {
                        console.log(error);
                    }
                    Plane.Bullet.Destroy(Mybullet);
                    this.myBullets.splice(i, 1);
                    i--;
                    myBulletsNum--;
                }
                Mybullet.y -= 12 * speedOffset;
            }
            //敌人飞机运动
            var enemPlane;
            var enemPlaneNum = this.enemyPlane.length;
            for (var i = 0; i < enemPlaneNum; i++) {
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
            var bullet;
            var enemybulletNum = this.enemyBullet.length;
            for (var i = 0; i < enemybulletNum; i++) {
                bullet = this.enemyBullet[i];
                if (bullet.y > GameConst.StageH) {
                    try {
                        this.removeChild(bullet);
                    }
                    catch (error) {
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
        };
        /**游戏碰撞检测 */
        GameMain.prototype.gameHitTest = function () {
            var i, j;
            var bullet;
            var theFighter;
            var myBulletsCount = this.myBullets.length;
            var enemyFighterCount = this.enemyPlane.length;
            var enemyBulletsCount = this.enemyBullet.length;
            //将需消失的子弹和飞机记录
            var delBullets = [];
            var delFighters = [];
            //我的子弹可以消灭敌机
            for (i = 0; i < myBulletsCount; i++) {
                bullet = this.myBullets[i];
                for (j = 0; j < enemyFighterCount; j++) {
                    theFighter = this.enemyPlane[j];
                    if (Plane.GameCheck.GetInstance.hitTest(theFighter, bullet)) {
                        theFighter.blood -= 2;
                        if (delBullets.indexOf(bullet) == -1)
                            delBullets.push(bullet);
                        if (theFighter.blood <= 0 && delFighters.indexOf(theFighter) == -1)
                            delFighters.push(theFighter);
                    }
                }
            }
            //敌人的子弹可以减我血
            for (i = 0; i < enemyBulletsCount; i++) {
                bullet = this.enemyBullet[i];
                if (Plane.GameCheck.GetInstance.hitTest(this.myPlane, bullet)) {
                    this.myPlane.blood -= 1;
                    if (delBullets.indexOf(bullet) == -1)
                        delBullets.push(bullet);
                }
            }
            //敌机的撞击可以消灭我
            for (i = 0; i < enemyFighterCount; i++) {
                theFighter = this.enemyPlane[i];
                if (Plane.GameCheck.GetInstance.hitTest(this.myPlane, theFighter)) {
                    this.myPlane.blood -= 10;
                }
            }
            if (this.myPlane.blood <= 0) {
                this.gameStop();
            }
            else {
                while (delBullets.length > 0) {
                    bullet = delBullets.pop();
                    this.removeChild(bullet);
                    if (bullet.textureName == "b2_png")
                        this.myBullets.splice(this.myBullets.indexOf(bullet), 1);
                    else
                        this.enemyBullet.splice(this.enemyBullet.indexOf(bullet), 1);
                    Plane.Bullet.Destroy(bullet);
                }
                this.myScore += delFighters.length;
                while (delFighters.length > 0) {
                    theFighter = delFighters.pop();
                    theFighter.stopFire();
                    theFighter.removeEventListener("createBullet", this.createBulletHandler, this);
                    this.removeChild(theFighter);
                    this.enemyPlane.splice(this.enemyPlane.indexOf(theFighter), 1);
                    Plane.AirPlane.Destory(theFighter);
                }
            }
        };
        /**游戏结束 */
        GameMain.prototype.gameStop = function () {
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
            for (var i = 0; i < this.myBullets.length; i++) {
                this.removeChild(this.myBullets[i]);
            }
            //清理敌人子弹
            for (var i = 0; i < this.enemyBullet.length; i++) {
                this.removeChild(this.enemyBullet[i]);
            }
            //清理敌机
            for (var i = 0; i < this.enemyPlane.length; i++) {
                //
                this.enemyPlane[i].removeEventListener("createBullet", this.createBulletHandler, this);
                this.removeChild(this.enemyPlane[i]);
            }
            // 显示成绩
            this.scorePanel.showScore(this.myScore);
            this.scorePanel.x = GameConst.StageW / 2 - this.scorePanel.width / 2;
            this.scorePanel.y = 150;
            this.addChild(this.scorePanel);
        };
        return GameMain;
    }(egret.DisplayObjectContainer));
    Plane.GameMain = GameMain;
    __reflect(GameMain.prototype, "Plane.GameMain");
})(Plane || (Plane = {}));
