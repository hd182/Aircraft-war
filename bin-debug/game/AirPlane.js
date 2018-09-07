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
    /**飞机类  对象池 */
    var AirPlane = (function (_super) {
        __extends(AirPlane, _super);
        function AirPlane(texture, fireDelay, textureName) {
            var _this = _super.call(this) || this;
            _this.fireDelay = fireDelay;
            _this.bmp = new egret.Bitmap(texture);
            _this.textureName = textureName;
            _this.addChild(_this.bmp);
            _this.fireTimer = new egret.Timer(fireDelay);
            _this.fireTimer.addEventListener(egret.TimerEvent.TIMER, _this.createBullet, _this);
            return _this;
        }
        //根据名字创建显示对象
        /**生产 */
        AirPlane.produce = function (tName, fireDelay) {
            //如果没有这个对象的对象池,新建
            if (AirPlane.cacheDict[tName] == null) {
                AirPlane.cacheDict[tName] = [];
            }
            //这个名字(类型)对应的对象池
            var dict = AirPlane.cacheDict[tName];
            //从对象池返回的对象
            var theAirplane;
            //如果对象池里面有对象,拿出来使用
            if (dict.length > 0) {
                theAirplane = dict.pop();
            }
            else {
                //没有的话根据名字新建
                theAirplane = new AirPlane(RES.getRes(tName), fireDelay, tName);
            }
            theAirplane.blood = 10;
            return theAirplane;
        };
        /**回收 */
        AirPlane.Destory = function (theAirplane) {
            //拿到对象的texturename
            var textureName = theAirplane.textureName;
            if (AirPlane.cacheDict[textureName] == null) {
                AirPlane.cacheDict[textureName] = [];
            }
            //拿到参数对应的对象池数组
            var dict = AirPlane.cacheDict[textureName];
            // 如果对象池里面没有这个对象，那么缓存进对象池
            if (dict.indexOf(theAirplane) == -1) {
                dict.push(theAirplane);
            }
        };
        /**开火 */
        AirPlane.prototype.Fire = function () {
            //计时器开始
            this.fireTimer.start();
        };
        /**熄火 */
        AirPlane.prototype.stopFire = function () {
            this.fireTimer.stop();
        };
        /**创建子弹 */
        AirPlane.prototype.createBullet = function () {
            //派发一个指定参数的事件
            this.dispatchEventWith("createBullet");
        };
        AirPlane.cacheDict = [];
        return AirPlane;
    }(egret.DisplayObjectContainer));
    Plane.AirPlane = AirPlane;
    __reflect(AirPlane.prototype, "Plane.AirPlane");
})(Plane || (Plane = {}));
