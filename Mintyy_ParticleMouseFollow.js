/*:
* @plugindesc Controls a following mouse particle. (Dev Tool)
* @author Mintyy
@help

Script call: SceneManager.push(Mintyy_ParticleMouseFollow);

*/

'use strict';

Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // to be overridden by plugins
    if (command === 'ThreeJS') {
        SceneManager.push(Mintyy_ParticleMouseFollow);
    }
};
var ww = window.innerWidth,
	wh = window.innerHeight;
var counter = 0;
var farest = 0;
class Mintyy_ParticleMouseFollow extends Scene_Base {
    constructor() {
        super();
    }

    initialize() {
        Scene_Base.prototype.initialize.call(this);
        this.create3DScene();
    }

    create3DScene() {
        this.threejs = {};
        this.threejs.scene = new THREE.Scene();

        this.threejs.camera = new THREE.PerspectiveCamera(50, ww/wh, 1, 10000 );
        this.threejs.camera.position.set(0,0,500);
        this.threejs.camera.lookAt(this.threejs.scene.position);

		this.threejs.light = new THREE.PointLight(0xffffff, 1, 1300);
		this.threejs.light.position.set( 0, 0, -750 );
		this.threejs.scene.add(this.threejs.light);        

        this.threejs.renderer = new THREE.WebGLRenderer({alpha: true});
        this.threejs.renderer.setSize( 816, 624 );

        this._texture3d = PIXI.Texture.fromCanvas( this.threejs.renderer.domElement );
        this._sprite3d = new PIXI.Sprite( this._texture3d );
        this.addChild( this._sprite3d );   
    }

    update() {
        Scene_Base.prototype.update.call(this);
        this.threejs.renderer.render( this.threejs.scene, this.threejs.camera );
        this._texture3d.update();        
    };

}

