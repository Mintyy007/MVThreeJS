/*:
* @plugindesc Battleback : Default, Skybox, Dual-Fisheye, Equirectangular
* @author Mintyy

*/
Spriteset_Battle.prototype.createBattleback = function() {
    var margin = 32;
    var x = -this._battleField.x - margin;
    var y = -this._battleField.y - margin;
    var width = Graphics.width + margin * 2;
    var height = Graphics.height + margin * 2;
    switch($gameSystem.battlebackStyle) {
    	case 'Default':
		    this._back2Sprite = new TilingSprite();
		    this._back1Sprite.bitmap = this.battleback1Bitmap();
		    this._back2Sprite.bitmap = this.battleback2Bitmap();
		    this._back1Sprite.move(x, y, width, height);
		    this._back2Sprite.move(x, y, width, height);
		    this._battleField.addChild(this._back1Sprite._sprite3d);
		    this._battleField.addChild(this._back2Sprite);
    		break;
		case 'Skybox':
			this._back1Sprite = new Mintyy_ThreeMV_SkyboxSprite();
		    this._back1Sprite.createSkyboxMesh();
		    this._back1Sprite.createSkyboxControls();
		    this._back1Sprite.renderSkybox();			  
		    this._baseSprite.addChildAt(this._back1Sprite._sprite3d, 2);  
			break;
		case 'Dual-Fisheye':
			this._back1Sprite = new Mintyy_ThreeMV_WebGL_DualFisheye();
			this._back1Sprite.createDualFishEyeMesh('img/battlebacks1/', this.battleback1Name());
			this._baseSprite.addChildAt(this._back1Sprite._sprite3d, 2);
			break;
    	case 'Equirectangular':
		    this._back1Sprite = new Mintyy_ThreeMV_WebGLEquirectangular();
		    this._back1Sprite.createWebGLEquirectangular('img/battlebacks1/', this.battleback1Name());
		    this._battleField.addChild(this._back1Sprite._sprite3d);
    		break;
    }

    
};

Spriteset_Battle.prototype.updateBattleback = function() {
	switch($gameSystem.battlebackStyle) {
		case 'Default':
		    if (!this._battlebackLocated) {
		        this.locateBattleback();
		        this._battlebackLocated = true;
		    }
			break;
		default:
			this._back1Sprite.update();
			break;
	}
    
};