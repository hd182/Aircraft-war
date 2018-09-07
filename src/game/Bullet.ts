module Plane {
	/**
	 * 子弹,利用对象池
	 */
	export class Bullet extends egret.Bitmap {

		private static cacheDict: Object = {};
		/**生成 */
		public static produce(textureName: string): Bullet {
			if (Bullet.cacheDict[textureName] == null) {
				Bullet.cacheDict[textureName] = [];
			}
			let dict: Bullet[] = Bullet.cacheDict[textureName];
			let bullet: Bullet;
			if (dict.length > 0) {
				bullet = dict.pop();
			} else {
				bullet = new Bullet(RES.getRes(textureName), textureName);
			}
			return bullet;

		}
		/**销毁 */
		public static Destroy(bullet: Bullet): void {

			var textureName: string = bullet.textureName;
			if (Bullet.cacheDict[textureName] == null) {
				Bullet.cacheDict[textureName] = [];
			}
			var dict: Bullet[] = Bullet.cacheDict[textureName];
			if (dict.indexOf(bullet) == -1) {
				dict.push(bullet);
			}
		}

		public textureName: string = "";//可视为子弹类型名
		public constructor(texture: egret.Texture, tname: string) {
			super(texture);
			this.texture = texture;
			this.textureName = tname;
		}
	}
}