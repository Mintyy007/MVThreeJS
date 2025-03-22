/*:
* @plugindesc A core plugin to deal with all 3D related plugins by Mintyy.
* @author Mintyy
*
* @param -- PARALLAX --
*
* @param Parallax Style
* @desc The default parallax style you are using. Default, Skybox, Dual-Fisheye, Equirectangular
* @default Skybox
*
* @param -- BATTLEBACK --
*
* @param Battleback Style
* @desc The default battleback style you are using. Default, Skybox, Dual-Fisheye, Equirectangular
* @default Equirectangular
*
@help

This core plugin holds the following commands for core commands:

Load Plugin to Document
Remove Plugin to Document

This core plugin holds the following commands for 3D actions:

Texture Animation

*/
// a function to load a necessary library or plugin for a certain action.
'use strict';

var Imported = Imported || {};
Imported.Mintyy_ThreeCorePlugin = true;

var Mintyy = Mintyy || {};
Mintyy.RMMV3DCore = Mintyy.RMMV3DCore || {};

function loadPlugin(scriptURL){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
            }
        };
    }

    script.src = scriptURL;
    document.getElementsByTagName("head")[0].appendChild(script);
};

function detachPlugin(scriptURL) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    script.src = scriptURL;
    document.getElementsByTagName("head")[0].removeChild(script);
};

function MintyyDriver(param) {
    return PluginManager.parameters('Mintyy_ThreeCorePlugin')[param];
}

(function(){
    Mintyy.RMMV3DCore.Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        Mintyy.RMMV3DCore.Game_System_initialize.call(this);

        // Settings:
        this.parallaxStyle = String(MintyyDriver('Parallax Style'));
        this.battlebackStyle = String(MintyyDriver('Battleback Style'));

        // Skybox Variables
        this.skybox_imagePrefix = "img/3dmv/skybox/dawnmountain-";
        this.skybox_directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        this.skybox_imageSuffix = '.png';
        this.skybox_skyGeometry = [5000, 5000, 5000];
    };

    Game_System.prototype.createSkybox = function(prefix, directions, suffix, geom) {
        this.skybox_imagePrefix = prefix;
        this.skybox_directions = directions;
        this.skybox_imageSuffix = suffix;
        this.skybox_skyGeometry = geom;
    };

    Game_System.prototype.createCubePanorama = function(textureURL) {
        this.cubePanoramaTexture = textureURL;
    };
})();

// 3DMV Core
var isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0,
    distance = 500,
    onPointerDownPointerX = 0, onPointerDownPointerY = 0,
    onPointerDownLon = 0, onPointerDownLat = 0;


// 3DMV Sprites
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mintyy_ThreeMV_SkyboxSprite = function () {
    function Mintyy_ThreeMV_SkyboxSprite() {
        _classCallCheck(this, Mintyy_ThreeMV_SkyboxSprite);

        this.threejs = {};
        this.threejs.scene = new THREE.Scene();

        this.threejs.camera = new THREE.PerspectiveCamera(75, 1, 1, 5000);
        this.threejs.camera.position.set(0, 150, 400);
        this.threejs.camera.lookAt(this.threejs.scene.position);

        this.threejs.renderer = new THREE.WebGLRenderer();
        this.threejs.renderer.setSize(816, 624);
        this.includeOrbit = false;
        this.imagePrefix = $gameSystem.skybox_imagePrefix;
        this.directions = $gameSystem.skybox_directions;
        this.imageSuffix = $gameSystem.skybox_imageSuffix;
        this.skyGeometry = new THREE.CubeGeometry($gameSystem.skybox_skyGeometry[0], $gameSystem.skybox_skyGeometry[1], $gameSystem.skybox_skyGeometry[2]);
    }

    _createClass(Mintyy_ThreeMV_SkyboxSprite, [{
        key: 'createSkyboxMesh',
        value: function createSkyboxMesh() {
            var materialArray = [];
            for (var i = 0; i < 6; i++) {
                materialArray.push(new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(this.imagePrefix + this.directions[i] + this.imageSuffix),
                    side: THREE.BackSide
                }));
            }var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
            var skyBox = new THREE.Mesh(this.skyGeometry, skyMaterial);
            this.threejs.scene.add(skyBox);
        }
    }, {
        key: 'createSkyboxControls',
        value: function createSkyboxControls() {
            
            this.threejs.controls = new THREE.OrbitControls(this.threejs.camera, document.domElement);
        }
    }, {
        key: 'renderSkybox',
        value: function renderSkybox() {
            this._texture3d = PIXI.Texture.fromCanvas(this.threejs.renderer.domElement);
            this._sprite3d = new PIXI.Sprite(this._texture3d);
        }
    }, {
        key: 'update',
        value: function update() {
            this.threejs.controls.update();
            this.threejs.renderer.render(this.threejs.scene, this.threejs.camera);
            this._texture3d.update();
        }
    }]);

    return Mintyy_ThreeMV_SkyboxSprite;
}();

;

var Mintyy_ThreeMV_WebGL_DualFisheye = function () {
    function Mintyy_ThreeMV_WebGL_DualFisheye() {
        _classCallCheck(this, Mintyy_ThreeMV_WebGL_DualFisheye);

        this.threejs = {};
        this.threejs.scene = new THREE.Scene();

        this.threejs.camera = new THREE.PerspectiveCamera(75, 1, 1, 5000);
        this.threejs.camera.position.set(0, 150, 400);
        this.threejs.camera.lookAt(this.threejs.scene.position);
        this.threejs.renderer = new THREE.WebGLRenderer();
        this.threejs.renderer.setSize(816, 624);
    }

    _createClass(Mintyy_ThreeMV_WebGL_DualFisheye, [{
        key: 'createDualFishEyeMesh',
        value: function createDualFishEyeMesh(urlName, materialName) {
            var geometry = new THREE.SphereBufferGeometry(500, 60, 40).toNonIndexed();
            geometry.scale(-1, 1, 1);

            // Remap UVs
            var normals = geometry.attributes.normal.array;
            var uvs = geometry.attributes.uv.array;
            for (var i = 0, l = normals.length / 3; i < l; i++) {
                var x = normals[i * 3 + 0];
                var y = normals[i * 3 + 1];
                var z = normals[i * 3 + 2];
                if (i < l / 2) {
                    var correction = x == 0 && z == 0 ? 1 : Math.acos(y) / Math.sqrt(x * x + z * z) * (2 / Math.PI);
                    uvs[i * 2 + 0] = x * (404 / 1920) * correction + 447 / 1920;
                    uvs[i * 2 + 1] = z * (404 / 1080) * correction + 582 / 1080;
                } else {
                    var correction = x == 0 && z == 0 ? 1 : Math.acos(-y) / Math.sqrt(x * x + z * z) * (2 / Math.PI);
                    uvs[i * 2 + 0] = -x * (404 / 1920) * correction + 1460 / 1920;
                    uvs[i * 2 + 1] = z * (404 / 1080) * correction + 582 / 1080;
                }
            }
            geometry.rotateZ(-Math.PI / 2);
            var texture = new THREE.TextureLoader().load(urlName + materialName + '.png');
            texture.format = THREE.RGBFormat;
            var material = new THREE.MeshBasicMaterial({ map: texture });
            var mesh = new THREE.Mesh(geometry, material);
            this.threejs.scene.add(mesh);
            document.addEventListener('mousedown', onDocumentMouseDown, false);
            document.addEventListener('mousemove', onDocumentMouseMove, false);
            document.addEventListener('mouseup', onDocumentMouseUp, false);
            document.addEventListener('wheel', onDocumentMouseWheel, false);
            this.threejs.controls = new THREE.OrbitControls(this.threejs.camera, document.domElement);
            this._texture3d = PIXI.Texture.fromCanvas(this.threejs.renderer.domElement);
            this._sprite3d = new PIXI.Sprite(this._texture3d);
        }
    }, {
        key: 'update',
        value: function update() {
            if (isUserInteracting === false) {
                lon += 0.1;
            }
            lat = Math.max(-85, Math.min(85, lat));
            phi = THREE.Math.degToRad(90 - lat);
            theta = THREE.Math.degToRad(lon - 180);
            this.threejs.camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
            this.threejs.camera.position.y = distance * Math.cos(phi);
            this.threejs.camera.position.z = distance * Math.sin(phi) * Math.sin(theta);
            this.threejs.controls.update();
            this.threejs.renderer.render(this.threejs.scene, this.threejs.camera);
            this._texture3d.update();
        }
    }]);

    return Mintyy_ThreeMV_WebGL_DualFisheye;
}();

var Mintyy_ThreeMV_WebGLEquirectangular = function () {
    function Mintyy_ThreeMV_WebGLEquirectangular() {
        _classCallCheck(this, Mintyy_ThreeMV_WebGLEquirectangular);

        this.threejs = {};
        this.threejs.scene = new THREE.Scene();

        this.threejs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
        this.threejs.camera.target = new THREE.Vector3(0, 0, 0);
        this.threejs.renderer = new THREE.WebGLRenderer();
        this.threejs.renderer.setSize(816, 624);

    }

    _createClass(Mintyy_ThreeMV_WebGLEquirectangular, [{
        key: 'createWebGLEquirectangular',
        value: function createWebGLEquirectangular(urlBase, imageName) {
            var geometry = new THREE.SphereGeometry(500, 60, 40);
            geometry.scale(-1, 1, 1);
            var material = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(urlBase + imageName + '.png')
            });
            var mesh = new THREE.Mesh(geometry, material);
            this.threejs.scene.add(mesh);
            document.addEventListener('mousedown', onDocumentMouseDownEq, false);
            document.addEventListener('mousemove', onDocumentMouseMoveEq, false);
            document.addEventListener('mouseup', onDocumentMouseUpEq, false);
            this._texture3d = PIXI.Texture.fromCanvas(this.threejs.renderer.domElement);
            this._sprite3d = new PIXI.Sprite(this._texture3d);
        }
    }, {
        key: 'update',
        value: function update() {
            if (isUserInteracting === false) {
                lon += 0.1;
            }
            lat = Math.max(-85, Math.min(85, lat));
            phi = THREE.Math.degToRad(90 - lat);
            theta = THREE.Math.degToRad(lon);
            this.threejs.camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
            this.threejs.camera.target.y = 500 * Math.cos(phi);
            this.threejs.camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
            this.threejs.camera.lookAt(this.threejs.camera.target);
            this.threejs.renderer.render(this.threejs.scene, this.threejs.camera);
            this._texture3d.update();
        }
    }]);

    return Mintyy_ThreeMV_WebGLEquirectangular;
}();




    function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
    {   
        // note: texture passed by reference, will be updated by the update function.
            
        this.tilesHorizontal = tilesHoriz;
        this.tilesVertical = tilesVert;
        // how many images does this spritesheet contain?
        //  usually equals tilesHoriz * tilesVert, but not necessarily,
        //  if there at blank tiles at the bottom of the spritesheet. 
        this.numberOfTiles = numTiles;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
        texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );
        // how long should each image be displayed?
        this.tileDisplayDuration = tileDispDuration;
        // how long has the current image been displayed?
        this.currentDisplayTime = 0;
        // which image is currently being displayed?
        this.currentTile = 0;
            
        this.update = function( milliSec )
        {
            this.currentDisplayTime += milliSec;
            while (this.currentDisplayTime > this.tileDisplayDuration)
            {
                this.currentDisplayTime -= this.tileDisplayDuration;
                this.currentTile++;
                if (this.currentTile == this.numberOfTiles)
                    this.currentTile = 0;
                var currentColumn = this.currentTile % this.tilesHorizontal;
                texture.offset.x = currentColumn / this.tilesHorizontal;
                var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
                texture.offset.y = currentRow / this.tilesVertical;
            }
        };
    }   

            function onDocumentMouseDown( event ) {
                event.preventDefault();
                isUserInteracting = true;
                onPointerDownPointerX = event.clientX;
                onPointerDownPointerY = event.clientY;
                onPointerDownLon = lon;
                onPointerDownLat = lat;
            }
            function onDocumentMouseMove( event ) {
                if ( isUserInteracting === true ) {
                    lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
                    lat = ( onPointerDownPointerY - event.clientY ) * 0.1 + onPointerDownLat;
                }
            }
            function onDocumentMouseUp( event ) {
                isUserInteracting = false;
            }
            function onDocumentMouseWheel( event ) {
                distance += event.deltaY * 0.05;
            }

        function onDocumentMouseDownEq( event ) {
                event.preventDefault();
                isUserInteracting = true;
                onPointerDownPointerX = event.clientX;
                onPointerDownPointerY = event.clientY;
                onPointerDownLon = lon;
                onPointerDownLat = lat;
            }
            function onDocumentMouseMoveEq( event ) {
                if ( isUserInteracting === true ) {
                    lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
                    lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
                }
            }
            function onDocumentMouseUpEq( event ) {
                isUserInteracting = false;
            }

