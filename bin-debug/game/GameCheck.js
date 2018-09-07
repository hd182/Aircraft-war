var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by shaorui on 14-6-6.
 */
var Plane;
(function (Plane) {
    var GameCheck = (function () {
        function GameCheck() {
        }
        Object.defineProperty(GameCheck, "GetInstance", {
            get: function () {
                if (GameCheck._instance == null) {
                    GameCheck._instance = new GameCheck();
                }
                return GameCheck._instance;
            },
            enumerable: true,
            configurable: true
        });
        /**基于矩形的碰撞检测*/
        GameCheck.prototype.hitTest = function (obj1, obj2) {
            var rect1 = obj1.getBounds();
            var rect2 = obj2.getBounds();
            rect1.x = obj1.x;
            rect1.y = obj1.y;
            rect2.x = obj2.x;
            rect2.y = obj2.y;
            return rect1.intersects(rect2);
        };
        return GameCheck;
    }());
    Plane.GameCheck = GameCheck;
    __reflect(GameCheck.prototype, "Plane.GameCheck");
})(Plane || (Plane = {}));
