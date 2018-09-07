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
 * 成绩显示类
 */
var ScorePanel = (function (_super) {
    __extends(ScorePanel, _super);
    function ScorePanel() {
        var _this = _super.call(this) || this;
        _this.tex = new egret.TextField();
        _this.tex.width = 400;
        _this.tex.height = 200;
        _this.tex.textAlign = "center";
        _this.tex.textColor = 0xFFFFFF;
        _this.tex.size = 24;
        _this.tex.y = 60;
        _this.touchEnabled = true;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTexClick, _this);
        _this.addChild(_this.tex);
        _this.touchChildren = false;
        _this.touchEnabled = false;
        return _this;
    }
    ScorePanel.prototype.showScore = function (value) {
        var msg = "您的成绩是:\n" + value + "\n再来一次吧";
        this.tex.text = msg;
    };
    ScorePanel.prototype.onTexClick = function () {
        console.log("enmmm");
        var gameM = new Plane.GameMain();
        gameM.removeChild(this);
        // gameM.addChild(new GameStart());
    };
    return ScorePanel;
}(egret.Sprite));
__reflect(ScorePanel.prototype, "ScorePanel");
