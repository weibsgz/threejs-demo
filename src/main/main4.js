import * as THREE from 'three'
import { DoubleSide } from 'three';


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

//导入纹理
const  texttureLoader = new THREE.TextureLoader()
const texture = texttureLoader.load('./textture/1.png')

//纹理偏移设置
// texture.offset.x = 0.5
// texture.offset.set(0.5,0.6)

//纹理的旋转
// texture.rotation = Math.PI / 4  // 45度

//旋转中心点
// texture.center.set(0.5,0.5)

//纹理的重复
// texture.repeat.set(2,3)


const cubeGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
const basicMaterial = new THREE.MeshBasicMaterial({
	// color:"#ffff00",
	map:texture,  //导入纹理图
	transparent:true,//想开启纹理透明度必须设置为true
	opacity:.3,
	// side:THREE.DoubleSide
}) 
//渲染双面
basicMaterial.side = THREE.DoubleSide
const cube= new THREE.Mesh(cubeGeometry,basicMaterial)

scene.add(cube)


//添加一个平面
const plane = new THREE.PlaneGeometry(1,1)
const flat = new THREE.Mesh(plane,basicMaterial)

flat.position.set(3,0,0)
scene.add(flat)



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