import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SpotLight } from 'three';

//目标 点光源

//场景
const scene = new THREE.Scene();
//相机 透视相机PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
//设置相机位置 继承 Object3D 的方法 X,Y,Z
camera.position.set(0,0,10)
scene.add( camera );



/****  main  *** */



//环境光 白色  强度0.8 无方向
const light = new THREE.AmbientLight( 0xffffff ,0.5); 
scene.add( light );


//添加一个小球
const smallBall = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.2,20,20),
	new THREE.MeshBasicMaterial({color:0xff0000})
)
smallBall.position.set(2,2,2)



//添加一个大球
const sphereGeometry = new THREE.SphereBufferGeometry(1,20,20);
//标准材料有光的效果
const material = new THREE.MeshStandardMaterial({})
const sphere = new THREE.Mesh(sphereGeometry,material)
// 设置物体投射阴影 
sphere.castShadow = true
scene.add(sphere)


//点光源
const pointLight = new THREE.PointLight( 0xff0000, 1 );
pointLight.position.set( 2, 2, 2 );


pointLight.castShadow = true;
pointLight.shadow.radius = 10
pointLight.shadow.mapSize.set(512,512)
pointLight.decay = 0;
//把这个点光源放小球里
smallBall.add(pointLight)
// 把小球放场景里
scene.add(smallBall)




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
//让小球围绕着大球转动 大球上的阴影也会跟着小球动
//设置时钟
 const clock = new THREE.Clock();







//初始化渲染器

const renderer = new THREE.WebGLRenderer();
// 2. 设置渲染器开启阴影计算 
renderer.shadowMap.enabled = true
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

	//小球围绕着大球转
	//获取时钟运行的总时长
    let elaspedTime = clock.getElapsedTime()
	console.log(elaspedTime)
	// // 圆周运动网格模型x坐标计算  绕转半径3
	smallBall.position.x = Math.sin(elaspedTime) * 3
	
    // 圆周运动网格模型y坐标计算  绕转半径3
	smallBall.position.z = Math.cos(elaspedTime) * 3


	renderer.physicallyCorrectLights = true;
	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    //到这步可以拖动物体旋转了
	renderer.render( scene, camera );



}

animate()