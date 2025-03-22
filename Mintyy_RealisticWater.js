/*:
* @plugindesc Creates a Realistic Water using ThreeJS.
* @author Mintyy
*/

loadPlugin('js/plugins/mintyy3d/controls/FirstPersonControls.js');

var clock = new THREE.Clock();

var clock = new THREE.Clock();
var worldWidth = 128, worldDepth = 128,
            worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
class Mintyy_RealisticWater extends Scene_Base {
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

        this.threejs.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
        this.threejs.camera.position.y = 200;
        this.threejs.controls = new THREE.FirstPersonControls( this.threejs.camera );
        this.threejs.controls.movementSpeed = 500;
        this.threejs.controls.lookSpeed = 0.1;

        this.threejs.scene.fog = new THREE.FogExp2( 0xaaccff, 0.0007 );
        this.threejs.geometry = new THREE.PlaneGeometry( 20000, 20000, worldWidth - 1, worldDepth - 1 );
        this.threejs.geometry.rotateX( - Math.PI / 2 );
        for ( var i = 0, l = this.threejs.geometry.vertices.length; i < l; i ++ ) {
            this.threejs.geometry.vertices[ i ].y = 35 * Math.sin( i / 2 );
        }
        var texture = new THREE.TextureLoader().load( "img/3dmv/textures/water.jpg" );
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 5, 5 );
        this.threejs.material = new THREE.MeshBasicMaterial( { color: 0x0044ff, map: texture } );
        this.threejs.mesh = new THREE.Mesh( this.threejs.geometry, this.threejs.material );
        this.threejs.scene.add(this.threejs.mesh);
        // CUSTOM

        this.threejs.renderer = new THREE.WebGLRenderer( { antialias: false } );
        this.threejs.renderer.setClearColor( 0xaaccff );
        this.threejs.renderer.setSize( 816, 624 );

        this._texture3d = PIXI.Texture.fromCanvas( this.threejs.renderer.domElement );

        this.threejs.scene.add(this.threejs.controls);
        this._sprite3d = new PIXI.Sprite( this._texture3d );
        this.addChild( this._sprite3d );        
    }

    update() {
        Scene_Base.prototype.update.call(this);
        var delta = clock.getDelta(), time = clock.getElapsedTime() * 10;
        for ( var i = 0, l = this.threejs.geometry.vertices.length; i < l; i ++ ) {
            this.threejs.geometry.vertices[ i ].y = 35 * Math.sin( i / 5 + ( time + i ) / 7 );
        }
        this.threejs.mesh.geometry.verticesNeedUpdate = true;
        this.threejs.controls.update(delta);
        this.threejs.renderer.render( this.threejs.scene, this.threejs.camera );
        this._texture3d.update();        
    }
}
     
