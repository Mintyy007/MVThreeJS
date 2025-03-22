/*:
* @plugindesc Parallax : Default, Skybox, Dual-Fisheye, Equirectangular
* @author Mintyy

@help 

Mintyy_3DParallaxSprite

This plugin helps you create different types of parallax other
than the default 2D parallax feature.

Types of Parallax you can do with this plugin:

A. Default 2D Parallax

B. Skybox

C. Dual Fisheye

D. Equirectangular / Photosphere

Note: Just be sure that you're working on an actual skybox file for
the skybox. If it is a static image, there will be errors. Check the
Mintyy_ThreeMV_SkyboxSprite for the actual setup on the Mintyy_ThreeCore
plugin.

*/

'use strict';
var Imported = Imported || {};
Imported.ThreeMV_ParallaxSprite = true;


(function(){
	loadPlugin('js/plugins/mintyy3d/controls/OrbitControls.js');
			var isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 0, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0,
			distance = 500;
			var onPointerDownPointerX = 0;
			var onPointerDownPointerY = 0;
			var onPointerDownLon = 0;
			var onPointerDownLat = 0;
	Spriteset_Map.prototype.createParallax = function() {
		this._parallaxName = $gameMap.parallaxName();

		switch($gameSystem.parallaxStyle) {
			case 'Default':
			    this._parallax = new TilingSprite();
			    this._parallax.move(0, 0, Graphics.width, Graphics.height);
			    this._baseSprite.addChild(this._parallax);				
				break;
			case 'Skybox':
			    this._parallax = new Mintyy_ThreeMV_SkyboxSprite();
		        this._parallax.createSkyboxMesh();
		        this._parallax.createSkyboxControls();
		        this._parallax.renderSkybox();			  
		        this._baseSprite.addChild(this._parallax._sprite3d);  
				break;
			case 'Dual-Fisheye':
				this._parallax = new Mintyy_ThreeMV_WebGL_DualFisheye();
				this._parallax.createDualFishEyeMesh('img/parallaxes/', $gameMap.parallaxName());
				this._baseSprite.addChild(this._parallax._sprite3d);
				break;
			case 'Equirectangular':
				this._parallax = new Mintyy_ThreeMV_WebGLEquirectangular();
				this._parallax.createWebGLEquirectangular('img/parallaxes/', $gameMap.parallaxName());
				this._baseSprite.addChild(this._parallax._sprite3d);
				break;
		}

	};

	Spriteset_Map.prototype.updateParallax = function() {
		switch($gameSystem.parallaxStyle) {
			case 'Default':
			    if (this._parallaxName !== $gameMap.parallaxName()) {
			        this._parallaxName = $gameMap.parallaxName();

			        if (this._parallax.bitmap && Graphics.isWebGL() != true) {
			            this._canvasReAddParallax();
			        } else {
			            this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
			        }
			    }
			    if (this._parallax.bitmap) {
			        this._parallax.origin.x = $gameMap.parallaxOx();
			        this._parallax.origin.y = $gameMap.parallaxOy();
			    }
				break;
			default:
				this._parallax.update();
				break;
		}
	};

}());