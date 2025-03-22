/*:
* @plugindesc Creates a particle scene with a solid ground experience.
* @author Mintyy
@help

Script call: SceneManager.push(Mintyy_SolidGround3D);

*/

Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // to be overridden by plugins
    if (command === 'ThreeJS') {
        SceneManager.push(Mintyy_SolidGround3D);
    }
};
  
var vertexHeight = 15000;
var planeDefinition = 100;
var planeSize = 1245000;
var totalObjects = 100000;

Spriteset_Map.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createParallax();
    this.createTilemap();
    this.createCharacters();
    this.createShadow();
    this.createDestination();
    this.createWeather();

        this.threejs = {};
        this.threejs.scene = new THREE.Scene();


        this.threejs.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight,1, 400000)
        this.threejs.camera.position.z = 550000;
        this.threejs.camera.position.y =10000;
        this.threejs.camera.lookAt( new THREE.Vector3(0,6000,0) );

        this.threejs.scene.fog = new THREE.Fog( 0x000000, 1, 300000 );



        // this.threejs.plane = new THREE.Mesh( new THREE.PlaneGeometry( planeSize, planeSize, planeDefinition, planeDefinition ), new THREE.MeshBasicMaterial( { color: 0x555555, wireframe: false } ) );
        // this.threejs.plane.rotation.x -=Math.PI*.5;

        // this.threejs.scene.add( this.threejs.plane );


        this.threejs.geometry = new THREE.Geometry();

        for (var i = 0; i < totalObjects; i ++) 
        { 
          var vertex = new THREE.Vector3();
          vertex.x = Math.random()*planeSize-(planeSize*.5);
          vertex.y = Math.random()*100000;
          vertex.z = Math.random()*planeSize-(planeSize*.5);
          this.threejs.geometry.vertices.push( vertex );
        }

        this.threejs.material = new THREE.ParticleBasicMaterial( { size: 200 });
        this.threejs.particles = new THREE.ParticleSystem( this.threejs.geometry, this.threejs.material );
             
        this.threejs.scene.add( this.threejs.particles ); 


        this.threejs.renderer = new THREE.WebGLRenderer({alpha: true});
        this.threejs.renderer.setPixelRatio(window.devicePixelRatio);
        this.threejs.renderer.setSize( 816, 624 );

        this._texture3d = PIXI.Texture.fromCanvas( this.threejs.renderer.domElement );
        this._sprite3d = new PIXI.Sprite( this._texture3d );
        this.addChild( this._sprite3d );      

};

Spriteset_Map.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    this.updateTileset();
    this.updateParallax();
    this.updateTilemap();
    this.updateShadow();
    this.updateWeather();

        this.threejs.renderer.render( this.threejs.scene, this.threejs.camera );
        this._texture3d.update();      
       this.threejs.camera.position.z -= 150;
       // for (var i = 0; i < this.threejs.plane.geometry.vertices.length; i++) 
       // { 
       //   this.threejs.plane.geometry.vertices[i].z += Math.random()*vertexHeight -vertexHeight; 
       // } 
};


class Mintyy_SolidGround3D extends Scene_Base {
    constructor() {
        super();
    }

    initialize() {
        Scene_Base.prototype.initialize.call(this);
        // this.createBackground();
        this.create3DScene();
        
    }

    createBackground() {
    	this._background = new Sprite();
    	this._background.bitmap = ImageManager.loadParallax('StarlitSky');
    	this.addChild(this._background);
    }

    create3DScene() {
        this.threejs = {};
        this.threejs.scene = new THREE.Scene();


        this.threejs.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight,1, 400000)
        this.threejs.camera.position.z = 550000;
        this.threejs.camera.position.y =10000;
        this.threejs.camera.lookAt( new THREE.Vector3(0,6000,0) );

        this.threejs.scene.fog = new THREE.Fog( 0x000000, 1, 300000 );



        this.threejs.plane = new THREE.Mesh( new THREE.PlaneGeometry( planeSize, planeSize, planeDefinition, planeDefinition ), new THREE.MeshBasicMaterial( { color: 0x555555, wireframe: false } ) );
        this.threejs.plane.rotation.x -=Math.PI*.5;

        this.threejs.scene.add( this.threejs.plane );


        this.threejs.geometry = new THREE.Geometry();

        for (var i = 0; i < totalObjects; i ++) 
        { 
          var vertex = new THREE.Vector3();
          vertex.x = Math.random()*planeSize-(planeSize*.5);
          vertex.y = Math.random()*100000;
          vertex.z = Math.random()*planeSize-(planeSize*.5);
          this.threejs.geometry.vertices.push( vertex );
        }

        this.threejs.material = new THREE.ParticleBasicMaterial( { size: 200 });
        this.threejs.particles = new THREE.ParticleSystem( this.threejs.geometry, this.threejs.material );
             
        this.threejs.scene.add( this.threejs.particles ); 


        this.threejs.renderer = new THREE.WebGLRenderer({alpha: true});
        this.threejs.renderer.setPixelRatio(window.devicePixelRatio);
        this.threejs.renderer.setSize( 816, 624 );

        this._texture3d = PIXI.Texture.fromCanvas( this.threejs.renderer.domElement );
        this._sprite3d = new PIXI.Sprite( this._texture3d );
        this.addChild( this._sprite3d );      

    }

    update() {
        Scene_Base.prototype.update.call(this);
        this.animate();
        this.threejs.renderer.render( this.threejs.scene, this.threejs.camera );
        this._texture3d.update();        
    };

	animate(){
       this.threejs.camera.position.z -= 150;
       for (var i = 0; i < this.threejs.plane.geometry.vertices.length; i++) 
       { 
         this.threejs.plane.geometry.vertices[i].z += Math.random()*vertexHeight -vertexHeight; 
       } 
   }
}

