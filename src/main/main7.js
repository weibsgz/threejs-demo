import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SpotLight } from 'three';

//目标 聚光灯

//场景
const scene = new THREE.Scene();
//相机 透视相机PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
//设置相机位置 继承 Object3D 的方法 X,Y,Z
camera.position.set(0,0,10)
scene.add( camera );



/****  main  *** */

//灯光于阴影
// 1. 材质要满足对光照的反应
// 2. 设置渲染器开启阴影计算 renderer.shadowMap.enabled = true
// 3. 设置光照投射阴影 directionalLight.castShadow = true
// 4. 设置物体投射阴影 sphere.castShadow = true
// 5. 设置物体接收阴影 plane.receiveShadow = true


//1. 添加一个球
const sphereGeometry = new THREE.SphereBufferGeometry(1,20,20);
//标准材料有光的效果
const material = new THREE.MeshStandardMaterial({})

const sphere = new THREE.Mesh(sphereGeometry,material)

// 设置物体投射阴影 
sphere.castShadow = true
scene.add(sphere)


//创建一个平面
const planeGeometry = new THREE.PlaneGeometry( 50, 50);
const plane = new THREE.Mesh( planeGeometry, material );
//平面下移
plane.position.set(0,-1,0)
//如果是正的 正面看不到  要不就渲染双面 material.side =  THREE.DoubleSide
plane.rotation.x = -Math.PI / 2

// 设置物体接收阴影 
plane.receiveShadow = true
scene.add( plane );




//环境光 白色  强度0.8 无方向
const light = new THREE.AmbientLight( 0xffffff ,0.5); 
scene.add( light );

// //直线光
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
// //光照的角度 光源的起始坐标
// directionalLight.position.set(10, 10 ,10)
// // 3. 设置光照投射阴影 
// directionalLight.castShadow = true

// //设置阴影模糊度
// directionalLight.shadow.radius = 20
// //设置阴影贴图的分辨率
// directionalLight.shadow.mapSize.set(4096,4096)
// scene.add( directionalLight );


//聚光灯
const spotLight = new THREE.SpotLight( 0xffffff,1 );
spotLight.position.set( 5, 5, 5 );
spotLight.castShadow = true;
spotLight.shadow.radius = 20
spotLight.shadow.mapSize.set(4096,4096)
//聚光灯照向球 球动的时候 灯光会跟着动
spotLight.target = sphere
//设置角度 默认是MAth.PI/3 60度
spotLight.angle = Math.PI/8
//设置光照距离
// spotLight.distance = 0
// 聚光锥的半影衰减百分比
spotLight.penumbra = 0.5
//沿着光照距离的衰减量
// spotLight.decay = 0;


scene.add( spotLight );



/** 创建可视化GUI S **/
const gui = new dat.GUI();
gui.add(sphere.position,'x').min(-5).max(5).step(0.1)
gui.add(spotLight,"angle").min(0).max(Math.PI/2).step(0.01)
gui.add(spotLight,"penumbra").min(0).max(1).step(0.1)
gui.add(spotLight,"decay").min(0).max(5).step(0.01)
/** 创建可视化GUI E **/


//初始化渲染器

const renderer = new THREE.WebGLRenderer();
// 2. 设置渲染器开启阴影计算 
renderer.shadowMap.enabled = true
//是否使用物理上正确的光照模式 开启才能让spotLight.decay生效 加上太暗了 注释了
// renderer.physicallyCorrectLights = true;

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