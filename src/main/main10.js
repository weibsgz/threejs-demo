import * as THREE from 'three'

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//导入文字2d渲染
import {CSS2DRenderer,CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer' 


//目标 月球围绕地球

//场景
const scene = new THREE.Scene();
//相机 透视相机PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 200 );
//设置相机位置 继承 Object3D 的方法 X,Y,Z
camera.position.set(10,5,20)
//更新摄像头 宽高比，
camera.aspect = window.innerWidth / window.innerHeight
//更新摄像机的投影矩阵 因为摄像头宽高比变化后 像素矩阵要重新计算
camera.updateProjectionMatrix()
scene.add( camera );



/****  main  *** */


//地球月球的半径大小
const EARTH_RADIUS = 2.5;
const MOON_RADIUS = 0.27

const textureLoader = new THREE.TextureLoader()

//创建聚光灯
const spotLight = new THREE.SpotLight( 0xffffff,2 );
spotLight.position.set( 0, 0, 10 );
spotLight.castShadow = true;
// spotLight.shadow.radius = 20
// spotLight.shadow.mapSize.set(4096,4096)
scene.add(spotLight)


//环境光 白色  强度0.2 无方向
const light = new THREE.AmbientLight( 0xffffff ,0.2); 
scene.add( light );

//月球
const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS,16,16);
//MeshPhongMaterial高光材质
const moonMaterial = new THREE.MeshPhongMaterial({
	map:textureLoader.load('./textture/moon.jpg')
})
const moon= new THREE.Mesh(moonGeometry,moonMaterial)
moon.receiveShadow = true
moon.castShadow = true
scene.add(moon)


//创建地球
const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS,16,16)
const earthMaterial = new THREE.MeshPhongMaterial({
	map:textureLoader.load('./textture/earth.png'),
	//镜面反射亮度调低
	shininess:5,  
	//有条件可以增加法线纹理贴图
	//specularMap:textureLoader.load('texture/')
	//nomalMap:textureLoader.load()
})

const earth = new THREE.Mesh(earthGeometry,earthMaterial)
earth.receiveShadow = true
earth.castShadow = true
scene.add(earth)


//星空
scene.background = textureLoader.load('/textture/star.jpeg')

//创建地球和月球的文字标签

//标签渲染器 绝对定位到整个屏幕 
const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth,window.innerHeight)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
//加了这玩意就没法拖动屏幕旋转了,加上下面这句就又可以拖动旋转了 或者看官方实例 https://threejs.org/examples/#css2d_label
// const controls = new OrbitControls( camera, labelRenderer.domElement );
labelRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(labelRenderer.domElement)

const earthDiv = document.createElement('div')
earthDiv.className = 'label'
earthDiv.textContent = '地球'
earthDiv.style.color = "#fff"
earthDiv.style.fontSize = '16px'
const earthLabel = new CSS2DObject(earthDiv)
//放到地球的头上
earthLabel.position.set(0,EARTH_RADIUS + 0.5,0)
earth.add(earthLabel)


const moonDiv = document.createElement('div')
moonDiv.className = 'label'
moonDiv.textContent = '月球'
moonDiv.style.color = "#fff"
moonDiv.style.fontSize = '16px'
const moonLabel = new CSS2DObject(moonDiv)
//放到月球的头上
moonLabel.position.set(0,MOON_RADIUS + 0.5,0)
moon.add(moonLabel)



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
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
/** 添加坐标轴辅助器 e */


let clock = new THREE.Clock()


let oldTime = 0
function animate(time) {

	
	//递增的时间
	const elaspedTime = clock.getElapsedTime()
	
	// 月球围绕着地球旋转
	// 圆周运动网格模型x坐标计算  绕转地球半径2.5 *2 =5 
	moon.position.x = Math.sin(elaspedTime) * EARTH_RADIUS * 2
	// 圆周运动网格模型y坐标计算  绕转地球半径2.5 *2 =5 
	moon.position.z = Math.cos(elaspedTime) * EARTH_RADIUS * 2

	//地球自转 三维向量围绕着Y轴旋转
	const axis = new THREE.Vector3(0,1,0)
	//地球每秒转一次 https://threejs.org/docs/index.html?q=Mesh#api/zh/core/Object3D.rotateOnAxis
	//elaspedTime - oldTime 永远是一个固定范围内的数，可以让他匀速转 ，不过我感觉直接用 Math.PI/10 也是匀速
	earth.rotateOnAxis(axis, (elaspedTime - oldTime) * Math.PI / 10)
	oldTime = elaspedTime





	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    //到这步可以拖动物体旋转了
	renderer.render( scene, camera );

	//标签渲染器
	labelRenderer.render(scene,camera)
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