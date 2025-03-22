/*:
* @plugindesc Creates a particle scene with zooming experience.
* @author Mintyy
@help

Script call: SceneManager.push(Mintyy_ParticleZoom);

*/

'use strict';
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // to be overridden by plugins
    if (command === 'ThreeJS') {
        SceneManager.push(Mintyy_ParticleZoom);
    }
};

var actionZ = 0; //on left click action
var rotationA = 3.1; // amount of rotation
var movementSpeed = 10;
var zoomSpeed = 10;
var totalObjects = 40000;

var rotated = false; 
var container = document.createElement('div');
document.body.appendChild( container );
var i;

class Mintyy_ParticleZoom extends Scene_Base {
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

    	this.nbmesh = 100;

        this.threejs = {};
        this.threejs.scene = new THREE.Scene();

        this.threejs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,1, 10000);
        this.threejs.camera.position.z = 2000;
        

		this.threejs.scene.fog = new THREE.FogExp2( 0x555555, 0.0003 );  

		this.threejs.geometry = new THREE.Geometry();

		for (i = 0; i < totalObjects; i ++) 
		{ 
		  var vertex = new THREE.Vector3();
		  vertex.x = Math.random()*40000-20000;
		  vertex.y = Math.random()*7000-3500;
		  vertex.z = Math.random()*7000-3500;
		  this.threejs.geometry.vertices.push( vertex );
		}

		this.threejs.material = new THREE.ParticleBasicMaterial( { size: 6 });
		this.threejs.particles = new THREE.ParticleSystem( this.threejs.geometry, this.threejs.material );
			  
		this.threejs.scene.add( this.threejs.particles ); 

		this.threejs.camera.position.x = -10000;


        this.threejs.renderer = new THREE.WebGLRenderer({alpha: true});
        this.threejs.renderer.setSize( 816, 624 );

        this._texture3d = PIXI.Texture.fromCanvas( this.threejs.renderer.domElement );
        this._sprite3d = new PIXI.Sprite( this._texture3d );
        this.addChild( this._sprite3d );      
		window.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
		window.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
		window.addEventListener( 'resize', this.onWindowResize, false );
    }

    update() {
        Scene_Base.prototype.update.call(this);
        this.animate();
        this.threejs.renderer.render( this.threejs.scene, this.threejs.camera );
        this._texture3d.update();        
    };

	animate(){

	    
        if (!rotated && this.threejs.camera.position.x < 11000)
        {
          if(this.threejs.camera.position.x > 10000){
            rotated = true;
            if (this.threejs.camera.rotation.y < rotationA){
              this.threejs.camera.rotation.y += .015;
              rotated = false;
            }
            if (this.threejs.camera.position.z > -2000){
              this.threejs.camera.position.z -= 19;
              rotated = false;
            }
          }
          else{
          this.threejs.camera.position.x += movementSpeed;
          this.threejs.camera.position.z += actionZ;
          }
        }
        else if(rotated && this.threejs.camera.position.x > -11000){
					if(this.threejs.camera.position.x < -10000){
            rotated = false;
            if (this.threejs.camera.rotation.y > 0){
              this.threejs.camera.rotation.y -= .015;
              rotated = true;
            }
            if (this.threejs.camera.position.z < 2000){
              this.threejs.camera.position.z += 19;
              rotated = true;
            }
          }
          else{
          this.threejs.camera.position.x -= movementSpeed;
          this.threejs.camera.position.z -= actionZ;
          }
        }


	}

	onWindowResize() {
					this.threejs.camera.aspect = window.innerWidth / window.innerHeight;
					this.threejs.camera.updateProjectionMatrix();

					this.threejs.renderer.setSize( window.innerWidth, window.innerHeight );

				}
	onDocumentMouseDown(){
	    event.preventDefault();
	    actionZ = -zoomSpeed;
	}

	onDocumentMouseUp(){
	   actionZ = 0;
	}

}

