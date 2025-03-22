/*:
* @plugindesc Creates a Particle and Title 3D Movement in the title screen.
* @author Mintyy
*/

var camera, scene;
    var container, HEIGHT,
        WIDTH, fieldOfView, aspectRatio,
        nearPlane, farPlane, stats,
        geometry, particleCount,
        i, h, color, size,
        materials = [],
        mouseX = 0,
        mouseY = 0,
        windowHalfX, windowHalfY, cameraZ,
        fogHex, fogDensity, parameters = {},
        parameterCount, particles;
var clock = new THREE.Clock();

Scene_Title.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.create3DMovementTitle();
    this.createBackground();
    this.createForeground();
    this.createWindowLayer();
    this.createCommandWindow();
    this.createParticleCursor();
};

Scene_Title.prototype.createParticleCursor = function() {
    var particleTexture = THREE.ImageUtils.loadTexture( 'img/3dmv/sprites/spark.png' );
    this.particleGroup = new THREE.Object3D();
    this.particleAttributes = { startSize: [], startPosition: [], randomness: [] };  
            var totalParticles = 200;
            var radiusRange = 50;
            for( var i = 0; i < totalParticles; i++ ) 
            {
                var spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture, useScreenCoordinates: false, color: 0xffffff } );
                
                var sprite = new THREE.Sprite( spriteMaterial );
                sprite.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
                sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
                // for a cube:
                // sprite.position.multiplyScalar( radiusRange );
                // for a solid sphere:
                // sprite.position.setLength( radiusRange * Math.random() );
                // for a spherical shell:
                sprite.position.setLength( radiusRange * (Math.random() * 0.1 + 0.9) );
                
                // sprite.color.setRGB( Math.random(),  Math.random(),  Math.random() ); 
                sprite.material.color.setHSL( Math.random(), 0.9, 0.7 ); 
                
                // sprite.opacity = 0.80; // translucent particles
                sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
                
                this.particleGroup.add( sprite );
                // add variable qualities to arrays, if they need to be accessed later
                this.particleAttributes.startPosition.push( sprite.position.clone() );
                this.particleAttributes.randomness.push( Math.random() );
            }
            this.particleGroup.position.y = 0;
            this.threejs.scene.add( this.particleGroup );      
}

Scene_Title.prototype.create3DMovementTitle = function() {
        this.threejs = {};
        this.threejs.scene = new THREE.Scene();
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        windowHalfX = WIDTH / 2;
        windowHalfY = HEIGHT / 2;

        fieldOfView = 75;
        aspectRatio = WIDTH / HEIGHT;
        nearPlane = 1;
        farPlane = 3000;

       cameraZ = farPlane / 3; /* So, 1000? Yes! move on! */
        fogHex = 0x000000; /* As black as your heart. */
        fogDensity = 0.0007; /* So not terribly dense?  */

        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = cameraZ;

        this.threejs.scene.fog = new THREE.FogExp2(fogHex, fogDensity);

        container = document.createElement('div');
        document.body.appendChild(container);
        document.body.style.margin = 0;
        document.body.style.overflow = 'hidden';

        geometry = new THREE.Geometry(); /* NO ONE SAID ANYTHING ABOUT MATH! UGH! */

        particleCount = 2000; /* Leagues under the sea */

        /*  Hope you took your motion sickness pills;
  We're about to get loopy. */

        for (i = 0; i < particleCount; i++) {

            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2000 - 1000;
            vertex.y = Math.random() * 2000 - 1000;
            vertex.z = Math.random() * 2000 - 1000;

            geometry.vertices.push(vertex);
        }

        /*  We can't stop here, this is bat country!  */

        parameters = [
            [
                [1, 1, 0.5], 5
            ],
            [
                [0.95, 1, 0.5], 4
            ],
            [
                [0.90, 1, 0.5], 3
            ],
            [
                [0.85, 1, 0.5], 2
            ],
            [
                [0.80, 1, 0.5], 1
            ]
        ];
        parameterCount = parameters.length;

        /*  I told you to take those motion sickness pills.
  Clean that vommit up, we're going again!  */

        for (i = 0; i < parameterCount; i++) {

            color = parameters[i][0];
            size = parameters[i][1];

            materials[i] = new THREE.PointsMaterial({
                size: size
            });

            particles = new THREE.Points(geometry, materials[i]);

            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;

            this.threejs.scene.add(particles);
        }

        /*  If my calculations are correct, when this baby hits 88 miles per hour...
  you're gonna see some serious shit. */


        this.threejs.renderer = new THREE.WebGLRenderer({alpha: true});
        this.threejs.renderer.setPixelRatio(window.devicePixelRatio);
        this.threejs.renderer.setSize( 816, 624 );


        /* Event Listeners */

        window.addEventListener('resize', this.onWindowResize, false);
        document.addEventListener('mousemove', this.onDocumentMouseMove, false);
        document.addEventListener('touchstart', this.onDocumentTouchStart, false);
        document.addEventListener('touchmove', this.onDocumentTouchMove, false);        

        this._texture3d = PIXI.Texture.fromCanvas( this.threejs.renderer.domElement );
        this._sprite3d = new PIXI.Sprite( this._texture3d );
        this.addChild( this._sprite3d );  
}

Scene_Title.prototype.createBackground = function() {
    this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
    this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
    this._backSprite2.opacity = 120;
    this.addChild(this._backSprite1);
    this.addChild(this._backSprite2);
};

Scene_Title.prototype.update = function() {
    if (!this.isBusy()) {
        this._commandWindow.open();
    }
    Scene_Base.prototype.update.call(this);

        this.animate();
        this.updateParticleCursor();
        this.threejs.renderer.render( this.threejs.scene, camera );
        this._texture3d.update();  

};

Scene_Title.prototype.updateParticleCursor = function() {
            var time = 4 * clock.getElapsedTime();
            
            for ( var c = 0; c < this.particleGroup.children.length; c ++ ) 
            {
                var sprite = this.particleGroup.children[ c ];
                // particle wiggle
                var wiggleScale = 2;
                sprite.position.x += wiggleScale * (Math.random() - 0.5);
                sprite.position.y += wiggleScale * (Math.random() - 0.5);
                sprite.position.z += wiggleScale * (Math.random() - 0.5);
                
                // pulse away/towards center
                // individual rates of movement
                var a = this.particleAttributes.randomness[c] + 1;
                var pulseFactor = Math.sin(a * time) * 0.1 + 0.9;
                sprite.position.x = this.particleAttributes.startPosition[c].x * pulseFactor;
                sprite.position.y = this.particleAttributes.startPosition[c].y * pulseFactor;
                sprite.position.z = this.particleAttributes.startPosition[c].z * pulseFactor;    
            }
            // rotate the entire group
            // particleGroup.rotation.x = time * 0.5;
            this.particleGroup.rotation.y = time * 0.75;
            // particleGroup.rotation.z = time * 1.0;

            this.particleGroup.position.y = -this._commandWindow.y;
}

Scene_Title.prototype.animate = function() {
       var time = Date.now() * 0.00005;

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;

        camera.lookAt(this.threejs.scene.position);

        for (i = 0; i < this.threejs.scene.children.length; i++) {

            var object = this.threejs.scene.children[i];

            if (object instanceof THREE.Points) {

                object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
            }
        }

        for (i = 0; i < materials.length; i++) {

            color = parameters[i][0];

            h = (360 * (color[0] + time) % 360) / 360;
            materials[i].color.setHSL(h, color[1], color[2]);
        } 
}

Scene_Title.prototype.onDocumentMouseMove = function(e) {
        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    }

    /*  Mobile users?  I got your back homey  */

Scene_Title.prototype.onDocumentTouchStart = function(e) {

        if (e.touches.length === 1) {

            e.preventDefault();
            mouseX = e.touches[0].pageX - windowHalfX;
            mouseY = e.touches[0].pageY - windowHalfY;
        }
    }

Scene_Title.prototype.onDocumentTouchMove = function(e) {

        if (e.touches.length === 1) {

            e.preventDefault();
            mouseX = e.touches[0].pageX - windowHalfX;
            mouseY = e.touches[0].pageY - windowHalfY;
        }
    }