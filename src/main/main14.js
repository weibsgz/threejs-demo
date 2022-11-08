import * as THREE from 'three'


//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//导入HDR用的
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";//rebe加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
//模型是压缩过的 所以需要解压库
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'


//反射库
import { Reflector } from 'three/examples/jsm/objects/Reflector'

//目标 VR全景

//场景
const scene = new THREE.Scene();
//相机 透视相机PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//设置相机位置 继承 Object3D 的方法 X,Y,Z z轴设置的小一些 靠近些CUBE内部效果好
camera.position.set(0,1.5,6)
//更新摄像头 宽高比，
camera.aspect = window.innerWidth / window.innerHeight
//更新摄像机的投影矩阵 因为摄像头宽高比变化后 像素矩阵要重新计算
camera.updateProjectionMatrix()
scene.add( camera );



/****  main  *** */

const rgbeLoader = new RGBELoader();
// 星光背景
//资源较大，使用异步加载
rgbeLoader.loadAsync("textture/sky12.hdr").then((texture) => {
 
	//// 第一种方法 main6.js 的圆柱体反射法
	//可以把HDR的背景看成一个球，我们需要一个圆柱体包裹住这个球，让球体映射到圆柱体上
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture; //场景的月亮是发光的 需要月亮的光和投射

	//第二种方法，设置球体的纹理是HDR 在把球体的外皮反过来
	// const geometry = new THREE.SphereGeometry(5,32,32)
	
	// const sphere = new THREE.Mesh(
	// 	geometry,
	// 	new THREE.MeshBasicMaterial({map:texture})
	// )
	// geometry.scale(1,1,-1)
	scene.add(sphere)

});

//创建机器人

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
//设置解压到哪里取 这里边的一坨文件是从https://github.com/mrdoob/three.js/tree/master/examples/js/libs/draco 拷贝出来的 
dracoLoader.setDecoderPath( './draco/gltf/' );
dracoLoader.setDecoderConfig({type:'js'})
loader.setDRACOLoader( dracoLoader );
loader.load( './model/robot.glb', function ( gltf ) {
	 const robot = gltf.scene;
	console.log(robot) 
	scene.add( robot );

}, undefined, function ( e ) {
	console.error( e );
} );


//添加视频纹理
let video = document.createElement('video')
video.muted = true;
video.src= "./textture/zp2.mp4"
video.loop = true
video.play()

let videoTexture = new THREE.VideoTexture(video)

//创建一个平面，承载这个视频纹理
const videoPlane = new THREE.PlaneGeometry(8,4.5)
const videoMaterial = new THREE.MeshBasicMaterial({
	map:videoTexture,
	transparent:true,
	//https://threejs.org/docs/index.html?q=mesh#api/zh/materials/MeshBasicMaterial
	//alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。
	//这个视频黑色的就是不透明的。
	alphaMap:videoTexture,
	side:THREE.DoubleSide //两面都可看到
})

const videoMesh = new THREE.Mesh(videoPlane,videoMaterial)
videoMesh.position.set(0,0.2,0)
//放倒90度
videoMesh.rotation.x = -Math.PI / 2
scene.add(videoMesh)


//添加灯光
const light1 = new THREE.DirectionalLight(0xffffff,0.3)
light1.position.set(0,10,10)

const light2 = new THREE.DirectionalLight(0xffffff,0.3)
light2.position.set(0,10,-10)

const lignt3 = new THREE.DirectionalLight(0xffffff,0.8)
lignt3.position.set(10,10,10)

scene.add(light1,light2,lignt3)



//添加镜面反射

//反射镜面
const reflectGeometry = new THREE.PlaneGeometry(100,100)
const mirror = new Reflector(reflectGeometry, {
	clipBias: 0.03,
	textureWidth: window.innerWidth * window.devicePixelRatio,
	textureHeight: window.innerHeight * window.devicePixelRatio,
	color: 0x333333
});
mirror.rotation.x = -Math.PI / 2
scene.add(mirror);



//初始化渲染器

const renderer = new THREE.WebGLRenderer({
	//抗锯齿
	antialias:true,
	//对数深度缓冲区，由于glb模型有很多面，可能渲染的时候有闪烁
	logarithmicDepthBuffer:true,
	//如果不是设置的scene.background 而是给canvas设置的style样式背景图需要设置透明
	// alpha:true

});

//设置编码
renderer.outputEncoding = THREE.sRGBEncoding;

//设置渲染的尺寸和大小  ( width : Integer, height : Integer, updateStyle : Boolean ) : undefined
renderer.setSize(window.innerWidth,window.innerHeight);
// 2. 设置渲染器开启阴影计算 
renderer.shadowMap.enabled = true

//将渲染的内容（canvas）添加到body
document.body.appendChild(renderer.domElement)

//创建轨道控制器 （相机围绕着物体旋转）
const controls = new OrbitControls( camera, renderer.domElement );
//设置阻尼，让其拥有惯性,必须再动画循环里调用update()
controls.enableDamping = true;


/** 添加坐标轴辅助器 s */
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );
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