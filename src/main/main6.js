import * as THREE from 'three'
//导入HDR用的
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";//rebe加载器


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//目标 材质和纹理

//场景
const scene = new THREE.Scene();
//相机 透视相机PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
//设置相机位置 继承 Object3D 的方法 X,Y,Z
camera.position.set(0,0,10)
scene.add( camera );



/****  main  *** */

//环境是一个立方体 我们所看到的都在这个立方体里 所以用立方体纹理加载器
//设置cube纹理加载器 
const cubeTextureLoader = new THREE.CubeTextureLoader()

//把球体映射出的场景 设置6张贴图背景  
const envMapTexture = cubeTextureLoader.load([
    './textture/environment/posx.jpg',  //正方向X   
    './textture/environment/negx.jpg',  //负方向X
    './textture/environment/posy.jpg',  //正方向Y
    './textture/environment/negy.jpg',  //负方向Y
    './textture/environment/posz.jpg', //正方向Z
    './textture/environment/negz.jpg'  //负方向Z
])

//背景直接使用 6张图envMapTexture
// scene.background = envMapTexture


// 整体背景使用hdr环境图
const rgbeLoader = new RGBELoader();
//资源较大，使用异步加载
rgbeLoader.loadAsync("textture/").then((texture) => {
 //可以把HDR的背景看成一个球，我们需要一个圆柱体包裹住这个球，让球体映射到圆柱体上
  texture.mapping = THREE.EquirectangularReflectionMapping;
//将加载的材质texture设置给背景和环境
  scene.background = texture;
  scene.environment = texture;
});


//增加一个球体  让球体也 能反射出环境背景
const sphereGeometry = new THREE.SphereGeometry(1.5,20,20)
const material = new THREE.MeshStandardMaterial({
    metalness:0.7,//金属度 1是最大
    roughness:0.1,//粗糙度，0是光滑面 能看到直射光的反射 1是最粗糙 看不到反射的光了
    envMap:envMapTexture
})
const sphere = new THREE.Mesh( sphereGeometry, material );
scene.add( sphere );

//增加灯光 

//环境光 白色  强度0.8 无方向
const light = new THREE.AmbientLight( 0xffffff ,0.5); 
scene.add( light );
//直线光
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
//光照的角度 光源的起始坐标
directionalLight.position.set(0, 0 ,10)
scene.add( directionalLight );


//初始化渲染器

const renderer = new THREE.WebGLRenderer();

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