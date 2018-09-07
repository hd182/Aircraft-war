module Plane {
	export class BgMap extends egret.DisplayObjectContainer {
		public constructor() {
			super();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.AddStage, this);
		}

		/**图片数量*/
		private rowCount: number;
		/**纹理本身的高度*/
		private textureHeight: number;
		/**图片引用*/
		private bmpArr: egret.Bitmap[];
		/**控制滚动速度*/
		private speed: number = 2;

		private AddStage(event: egret.Event) {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.AddStage, this);
			let texture: egret.Texture = RES.getRes("bg_jpg");
			this.textureHeight = texture.textureHeight;
			//计算当前屏幕中需要的图片数量
			this.rowCount = Math.ceil(GameConst.StageH / this.textureHeight) + 1;
			this.bmpArr = [];
			//创建这些图片,并设置y坐标,让它们连接起来
			for (let i: number = 0; i < this.rowCount; i++) {
				let bg: egret.Bitmap = new egret.Bitmap(RES.getRes("bg_jpg"));
				bg.y = this.textureHeight * i - (this.textureHeight * this.rowCount - GameConst.StageH);
				this.bmpArr.push(bg);
				this.addChild(bg);
			}
		}
		/**开始滚动 */
		public start(): void {
			this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
			this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
		}
		/**广播事件 */
		private enterFrame(event: egret.Event) {
			for (let i: number = 0; i < this.rowCount; i++) {
				let bg: egret.Bitmap = this.bmpArr[i];
				bg.y += this.speed;
				//判断超出屏幕后,回到队首实现循环反复
				if (bg.y > GameConst.StageH) {
					bg.y = this.bmpArr[0].y - this.textureHeight;
					this.bmpArr.pop();
					this.bmpArr.unshift(bg);
				}
			}
		}
		/**暂停滚动*/
		public pause(): void {
			this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
		}
	}
}