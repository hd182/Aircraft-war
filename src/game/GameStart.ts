/**游戏初始画面 */
class GameStart extends eui.Component {
	public constructor() {
		super();
		this.skinName = "resource/eui_skins/gameSkin/StartGame.exml";
		this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.init, this);
	}
	/**开始游戏按钮 */
	public start_btn:eui.Button;

	private init() {
		this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.init, this)
		this.start_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartClick, this);
	}
	private onStartClick() {
		GameConst.MainStage.removeChild(this);
		GameConst.MainStage.addChild(new Plane.GameMain())
	}

}