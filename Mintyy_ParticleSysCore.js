/*:
* @plugindesc Controls the particle system made via 3D objects.
* @author Mintyy
@help

Script call: SceneManager.push(Mintyy_ParticleSysCore);
*/


'use strict';

Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // to be overridden by plugins
    if (command === 'ThreeJS') {
        SceneManager.push(Mintyy_ParticleSysCore);
    }
};
var ww = window.innerWidth,
	wh = window.innerHeight;

class mouser {
	constructor() {
		this.x = 30;
		this.y = 30;
	}
}
var mouse = {x:0,y:0};
function mouseMove(e){
	mouse.x = e.clientX-(ww/2);
	mouse.y = (wh/2)-e.clientY;

};
class Mintyy_ParticleSysCore extends Scene_Base {
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

        this.threejs.camera = new THREE.OrthographicCamera(ww/-2,ww/2,wh/2,wh/-2,0,1000);
        this.threejs.camera.position.set( 0, 250, 700 );
        this.threejs.camera.lookAt(this.threejs.scene.position);

        this.particles = new THREE.Object3D();
        this.threejs.scene.add(this.particles);


        this.threejs.renderer = new THREE.WebGLRenderer({alpha: true});
        this.threejs.renderer.setSize( 816, 624 );

        this._texture3d = PIXI.Texture.fromCanvas( this.threejs.renderer.domElement );
        this._sprite3d = new PIXI.Sprite( this._texture3d );
        this.addChild( this._sprite3d );      
		document.addEventListener("mousemove", mouseMove);
    }

    update() {
        Scene_Base.prototype.update.call(this);
        this.createParticles();
        this.threejs.renderer.render( this.threejs.scene, this.threejs.camera );
        this._texture3d.update();        
    };

	createParticles(){
		this.geometry = new THREE.Geometry();
		this.vertices = new THREE.Vector3(
			mouse.x,
			mouse.y,
			-10
		);
		this.geometry.vertices.push(this.vertices);
		this.material = new THREE.PointsMaterial({
			color : 0X00ff00,
			size : 3,
			transparent : true,
			sizeAttenuation : false
	    });
		this.particle = new THREE.Points(this.geometry, this.material);
		this.particle.speed = Math.random()/100+0.002
		this.particle.direction = {
			x : (Math.random()-.5)*ww*2,
			y : (Math.random()-.5)*wh*2
		};
		
		this.particles.add(this.particle);
			for(var i=0,j=this.particles.children.length;i<j;i++){
				var particle = this.particles.children[i];
				particle.geometry.vertices[0].x += (particle.direction.x - particle.geometry.vertices[0].x)*particle.speed;
				particle.geometry.vertices[0].y += (particle.direction.y - particle.geometry.vertices[0].y)*particle.speed;
				particle.material.opacity -= .005
				particle.geometry.verticesNeedUpdate = true;
				if(particle.material.opacity < .05){
					this.particles.remove(particle);
					i--;j--;
				}
		}


	}
}

