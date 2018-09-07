/**
 * 成绩显示类
 */
class ScorePanel extends egret.Sprite {

	private tex:egret.TextField;

	public constructor() {
		super();

		this.tex = new egret.TextField();
		this.tex.width = 400;
		this.tex.height = 200;
		this.tex.textAlign = "center";
		this.tex.textColor = 0xFFFFFF;
		this.tex.size = 24;
		this.tex.y = 60;
		this.touchEnabled = true;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTexClick, this);
		this.addChild(this.tex);
		this.touchChildren = false;
		this.touchEnabled = false;
	}

	public showScore(value:number) {
		let msg:string = "您的成绩是:\n" + value + "\n再来一次吧";
		this.tex.text = msg;
	}

	private onTexClick() {
		console.log("enmmm");
		let gameM:Plane.GameMain = new Plane.GameMain();
		gameM.removeChild(this);
		// gameM.addChild(new GameStart());
		
		
	}
}