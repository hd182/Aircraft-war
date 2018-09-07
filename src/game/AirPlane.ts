module Plane {
	/**飞机类  对象池 */
	export class AirPlane extends egret.DisplayObjectContainer {

		/**飞机位图 */
		private bmp: egret.Bitmap;
		/**创建子弹的间隔 */
		private fireDelay: number;
		/**定时射 */
		private fireTimer: egret.Timer;
		/**飞机生命值 */
		public blood: number;
		/**飞机类型 */
		private textureName: string;
		public constructor(texture: egret.Texture, fireDelay: number, textureName: string) {
			super();
			this.fireDelay = fireDelay;
			this.bmp = new egret.Bitmap(texture);
			this.textureName = textureName;
			this.addChild(this.bmp);
			this.fireTimer = new egret.Timer(fireDelay);
			this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
		}

		private static cacheDict: Object = [];
		//根据名字创建显示对象
		/**生产 */
		public static produce(tName: string, fireDelay: number): AirPlane {
			//如果没有这个对象的对象池,新建
			if (AirPlane.cacheDict[tName] == null) {
				AirPlane.cacheDict[tName] = [];
			}
			//这个名字(类型)对应的对象池
			let dict: AirPlane[] = AirPlane.cacheDict[tName];
			//从对象池返回的对象
			let theAirplane: AirPlane;
			//如果对象池里面有对象,拿出来使用
			if (dict.length > 0) {
				theAirplane = dict.pop();
			} else {
				//没有的话根据名字新建
				theAirplane = new AirPlane(RES.getRes(tName), fireDelay, tName);
			}
			theAirplane.blood = 10;
			return theAirplane;
		}
		/**回收 */
		public static Destory(theAirplane: AirPlane) {
			//拿到对象的texturename
			let textureName: string = theAirplane.textureName;
			if (AirPlane.cacheDict[textureName] == null) {
				AirPlane.cacheDict[textureName] = [];
			}
			//拿到参数对应的对象池数组
			let dict: AirPlane[] = AirPlane.cacheDict[textureName];
			// 如果对象池里面没有这个对象，那么缓存进对象池
			if (dict.indexOf(theAirplane) == -1) {
				dict.push(theAirplane);
			}
		}

		/**开火 */
		public Fire() {
			//计时器开始
			this.fireTimer.start();
		}
		/**熄火 */
		public stopFire() {
			this.fireTimer.stop();
		}

		/**创建子弹 */
		public createBullet(): void {
			//派发一个指定参数的事件
			this.dispatchEventWith("createBullet");
		}
	}
}