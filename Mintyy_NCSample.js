/*:
* @plugindesc A sample ThreeJS Stage Scene you can call. (Developer Tool)
* @author Mintyy

*/

'use strict';
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // to be overridden by plugins
    if (command === 'ThreeJS') {
        SceneManager.push(Mintyy_NCSample);
    }
};

class Mintyy_NCSample extends Scene_Base {
    constructor() {
        super();
    }

    initialize() {
        Scene_Base.prototype.initialize.call(this);
        this.createBackground();
        this.create3DScene();
        
    }

    createBackground() {
    	this._background = new Sprite();
    	this._background.bitmap = ImageManager.loadParallax('StarlitSky');
    	this.addChild(this._background);
    }

    create3DScene() {

        // Create the Scene 

        this.threejs = {};
        this.threejs.scene = new THREE.Scene();

        // set the type of camera
        this.threejs.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
        this.threejs.camera.position.y = 150;
        this.threejs.camera.position.z = 350;
      

        this.threejs.cube = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200 ), new THREE.MeshNormalMaterial() );
        this.threejs.cube.position.y = 120;
        this.threejs.scene.add(this.threejs.cube);


        // Create the Renderer
        this.threejs.renderer = new THREE.WebGLRenderer({alpha: true});
        this.threejs.renderer.setSize( 816, 624 );


        // Convert Everything to PIXI Sprite
        this._texture3d = PIXI.Texture.fromCanvas( this.threejs.renderer.domElement );
        this._sprite3d = new PIXI.Sprite( this._texture3d );
        this.addChild( this._sprite3d );      

    }

    update() {
        Scene_Base.prototype.update.call(this);

        this.threejs.cube.rotation.y += 0.02;

        this.threejs.renderer.render( this.threejs.scene, this.threejs.camera );
        this._texture3d.update();        
    };
}


