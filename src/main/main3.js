import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//目标 创建 50个三角形

//场景
const scene = new THREE.Scene();
//相机 透视相机PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
//设置相机位置 继承 Object3D 的方法 X,Y,Z
camera.position.set(0,0,10)
scene.add( camera );



/****  main  *** */

for(var i=0; i< 50; i ++){

	const geometry = new THREE.BufferGeometry();
	const positionArray = new Float32Array(9)
	//每个三角形面 有3个顶点，每个顶点需要3个坐标值
	for(var j=0; j < 9; j++) {
		positionArray[j] = Math.random() * 5 // 每个点都是随机0-5
	}
	geometry.setAttribute( 'position', new THREE.BufferAttribute( positionArray, 3 ) );

	let color = new THREE.Color(Math.random(),Math.random(),Math.random())

	const material = new THREE.MeshBasicMaterial( {color: color,transparent:true,opacity:0.5} );
	const mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
}







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