import * as THREE from 'three'

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//导入 水面
import { Water } from 'three/examples/jsm/objects/Water2'
//导入 gltf 库（小岛模型）
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
//模型是压缩过的 所以需要解压库
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
//导入HDR用的
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";//rebe加载器
import { TextureEncoding } from 'three'



//目标 水天一色小岛

//场景
const scene = new THREE.Scene();
//相机 透视相机PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );
//设置相机位置 继承 Object3D 的方法 X,Y,Z
camera.position.set(-50,50,130)
//更新摄像头 宽高比，
camera.aspect = window.innerWidth / window.innerHeight
//更新摄像机的投影矩阵 因为摄像头宽高比变化后 像素矩阵要重新计算
camera.updateProjectionMatrix()
scene.add( camera );



/****  main  *** */

//添加平面
// const planeGeometry = new THREE.PlaneGeometry(100,100)
// //基础材质没有光照阴影
// const planeMaterial = new THREE.MeshBasicMaterial({
// 	color:0xffffff,
// })
// const plane = new THREE.Mesh(planeGeometry,planeMaterial)
// scene.add(plane)


// 创建一个球体 天空

let skyTexture =  new THREE.TextureLoader().load('./textture/sky.jpg')
const skyGeometry = new THREE.SphereGeometry(1000,60,40)
const skyMaterial = new THREE.MeshBasicMaterial({
	//先贴一个静态天空图当纹理
	map:skyTexture
})
const sky = new THREE.Mesh(skyGeometry,skyMaterial)

//把球翻转过来 才能覆盖住场景？
skyGeometry.scale(1,1,-1) 
scene.add(sky)

scene.background = skyTexture
scene.environment = skyTexture


//使用视频天空纹理
const video = document.createElement("video");
video.muted = true;
video.src= "./textture/sky.mp4"
video.loop = true

//当鼠标移动播放视频 否则他不播需要交互
window.addEventListener('mousemove',(e)=>{
	//判断视频是否播放状态
	if(video.paused) {
		video.play()
		//设置视频纹理
		let videoTexture = new THREE.VideoTexture(video)
		skyMaterial.map = videoTexture
		//更新纹理
		skyMaterial.map.needsUpdate = true;
		// scene.background = videoTexture
		// scene.environment = videoTexture
	}
})


//环境HDR纹理 这样才能让小岛不是黑的 
const rgbeLoader = new RGBELoader();
//资源较大，使用异步加载
rgbeLoader.loadAsync("textture/sky12.hdr").then((texture) => {
 //可以把HDR的背景看成一个球，我们需要一个圆柱体包裹住这个球，让球体映射到圆柱体上
  texture.mapping = THREE.EquirectangularReflectionMapping;
//将加载的材质texture设置给背景和环境
  scene.background = texture;
  scene.environment = texture;
});

//添加平行光




//创建水面

const waterGeometry = new THREE.CircleBufferGeometry( 300, 64 );
const water = new Water(waterGeometry,{
	textureWidth:1024,
	textureHeight:1024,
	color:0xeeefff,
	flowDirection: new THREE.Vector2(1,1), //水面流动方向
	scale:1, //水面波纹大小
})

// 把水面放平 旋转X轴90度
water.rotation.x = -Math.PI / 2
water.position.y = -200

scene.add(water)


//添加一个小岛

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
//设置解压到哪里取 这里边的一坨文件是从https://github.com/mrdoob/three.js/tree/master/examples/js/libs/draco 拷贝出来的 
dracoLoader.setDecoderPath( './draco/gltf/' );
loader.setDRACOLoader( dracoLoader );

loader.load( './model/gltf/LittlestTokyo.glb', function ( gltf ) {

	// const model = gltf.scene;
	// model.position.set( 1, 1, 0 );
	// model.scale.set( 0.01, 0.01, 0.01 );
	scene.add( gltf.scene );

	// mixer = new THREE.AnimationMixer( model );
	// mixer.clipAction( gltf.animations[ 0 ] ).play();

	// animate();

}, undefined, function ( e ) {

	console.error( e );

} );



//初始化渲染器

const renderer = new THREE.WebGLRenderer({
	//抗锯齿
	antialias:true,
	//对数深度缓冲区，由于glb模型有很多面，可能渲染的时候有闪烁
	logarithmicDepthBuffer:true,

});
//设置编码
renderer.outputEncoding = THREE.sRGBEncoding;

//设置渲染的尺寸和大小  ( width : Integer, height : Integer, updateStyle : Boolean ) : undefined
renderer.setSize(window.innerWidth,window.innerHeight);


//将渲染的内容（canvas）添加到body
document.body.appendChild(renderer.domElement)

//创建轨道控制器 （相机围绕着物体旋转）
const controls = new OrbitControls( camera, renderer.domElement );
//设置阻尼，让其拥有惯性,必须再动画循环里调用update()
controls.enableDamping = true;


/** 添加坐标轴辅助器 s */
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
/** 添加坐标轴辅助器 e */

function animate(time) {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    //到这步可以拖动物体旋转了
	renderer.render( scene, camera );
}

animate()



/** 监听画面的宽高大小变化，更新渲染的画面 S*/ 
window.addEventListener('resize',()=>{
    //更新摄像头 宽高比，
    camera.aspect = window.innerWidth / window.innerHeight
    //更新摄像机的投影矩阵 因为摄像头宽高比变化后 像素矩阵要重新计算
    camera.updateProjectionMatrix()

    //更新渲染器
    renderer.setSize(window.innerWidth,window.innerHeight);

    //更新渲染器像素比
    renderer.setPixelRatio(window.devicePixelRatio)

})

/** 监听画面的宽高大小变化，更新渲染的画面 E*/ 