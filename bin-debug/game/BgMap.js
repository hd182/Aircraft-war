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
var Plane;
(function (Plane) {
    var BgMap = (function (_super) {
        __extends(BgMap, _super);
        function BgMap() {
            var _this = _super.call(this) || this;
            /**控制滚动速度*/
            _this.speed = 2;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.AddStage, _this);
            return _this;
        }
        BgMap.prototype.AddStage = function (event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.AddStage, this);
            var texture = RES.getRes("bg_jpg");
            this.textureHeight = texture.textureHeight;
            //计算当前屏幕中需要的图片数量
            this.rowCount = Math.ceil(GameConst.StageH / this.textureHeight) + 1;
            this.bmpArr = [];
            //创建这些图片,并设置y坐标,让它们连接起来
            for (var i = 0; i < this.rowCount; i++) {
                var bg = new egret.Bitmap(RES.getRes("bg_jpg"));
                bg.y = this.textureHeight * i - (this.textureHeight * this.rowCount - GameConst.StageH);
                this.bmpArr.push(bg);
                this.addChild(bg);
            }
        };
        /**开始滚动 */
        BgMap.prototype.start = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
        };
        /**广播事件 */
        BgMap.prototype.enterFrame = function (event) {
            for (var i = 0; i < this.rowCount; i++) {
                var bg = this.bmpArr[i];
                bg.y += this.speed;
                //判断超出屏幕后,回到队首实现循环反复
                if (bg.y > GameConst.StageH) {
                    bg.y = this.bmpArr[0].y - this.textureHeight;
                    this.bmpArr.pop();
                    this.bmpArr.unshift(bg);
                }
            }
        };
        /**暂停滚动*/
        BgMap.prototype.pause = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
        };
        return BgMap;
    }(egret.DisplayObjectContainer));
    Plane.BgMap = BgMap;
    __reflect(BgMap.prototype, "Plane.BgMap");
})(Plane || (Plane = {}));
