import * as THREE from 'three'


//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
//模型是压缩过的 所以需要解压库
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'


//目标 VR全景

//场景
const scene = new THREE.Scene();
//相机 透视相机PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//设置相机位置 继承 Object3D 的方法 
camera.position.set(0,2,6)
//更新摄像头 宽高比，
camera.aspect = window.innerWidth / window.innerHeight
//更新摄像机的投影矩阵 因为摄像头宽高比变化后 像素矩阵要重新计算
camera.updateProjectionMatrix()
scene.add( camera );



/****  main  *** */

//添加网格地面 https://threejs.org/docs/index.html#api/zh/helpers/GridHelper
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions );
//实例继承自line https://threejs.org/docs/index.html#api/zh/objects/Line
gridHelper.material.opacity = 0.8
gridHelper.material.transparent = true
scene.add( gridHelper );



//载入汽车模型

//轮毂
let wheels = []
//车身 车前脸 引擎盖,挡风玻璃
let carBody,frontCar,hoodCar,glassCar
//创建材质 使用物理材质更适合车漆
const carBodyMaterial = new THREE.MeshPhysicalMaterial({
	color:0xff0000,
	metalness:1,
	roughness:0.5,
	clearcoat:1, //反光车漆效果
	clearcoatRoughness:0 //车漆粗糙度
})
const frontCarMaterial = new THREE.MeshPhysicalMaterial({
	color:0xff0000,
	metalness:1,
	roughness:0.5,
	clearcoat:1, //反光车漆效果
	clearcoatRoughness:0 //车漆粗糙度
})
const hoodCarMaterial = new THREE.MeshPhysicalMaterial({
	color:0xff0000,
	metalness:1,
	roughness:0.5,
	clearcoat:1, //反光车漆效果
	clearcoatRoughness:0 //车漆粗糙度
})
const glassCarMaterial = new THREE.MeshPhysicalMaterial({
	color:0xffffff,
	//https://threejs.org/docs/index.html?q=mesh#api/zh/materials/MeshPhysicalMaterial
	//.opacity属性有一些限制:在透明度比较高的时候，反射也随之减少。使用基于物理的透光性.transmission属性可以让一些很薄的透明表面，例如玻璃，变得更真实一些
	transmission : 1,
	transparent:true,
	metalness:0,
	roughness:0.1,
})
const wheelsCarMaterial = new THREE.MeshPhysicalMaterial({
	color:0xff0000,
	metalness:1,
	roughness:0.1
})




let model
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
//设置解压到哪里取 这里边的一坨文件是从https://github.com/mrdoob/three.js/tree/master/examples/js/libs/draco 拷贝出来的 
dracoLoader.setDecoderPath( './draco/gltf/' );
loader.setDRACOLoader( dracoLoader );
loader.load( './model/bmw01.glb', function ( gltf ) {
	 model = gltf.scene;
	console.log(model) 

	//https://threejs.org/docs/index.html?q=scene#api/zh/core/Object3D
	//scene.traverse(function) 可以遍历该父场景中的所有子物体来执行回调函数。
	model.traverse((child)=>{
		//子物体 在创建模型时候已经赋予了一些部件名字
		if(child.isMesh) {
			console.log(child.name)
		}
		//判断是否是轮毂
		if(child.isMesh && child.name.includes('轮毂')) {
			wheels.push(child)
			child.material = wheelsCarMaterial
		}
		//判断是否是车身
		if(child.isMesh && child.name.includes('Mesh002')) {
			carBody = child
			//设置此mesh的材料
			carBody.material = carBodyMaterial;
		}
		//判断是否是车前脸
		if(child.isMesh && child.name.includes('前脸')) {
			frontCar = child
			frontCar.material = frontCarMaterial
		}
		//判断是否是引擎盖
		if(child.isMesh && child.name.includes('引擎盖_1')) {
			hoodCar = child
			hoodCar.material = hoodCarMaterial
		}
		//判断是否是挡风玻璃
		if(child.isMesh && child.name.includes('挡风玻璃')) {
			glassCar = child
			glassCar.material = glassCarMaterial
		}

	})

	
	scene.add( model );

}, undefined, function ( e ) {
	console.error( e );
} );



//需要灯光 添加多个位置的的灯光
//Z轴正方向灯
const light1 = new THREE.DirectionalLight(0xffffff,1)
light1.position.set(0,0,10)
scene.add(light1)
//Z轴负方向灯
const light2 = new THREE.DirectionalLight(0xffffff,1)
light2.position.set(0,0,-10)
scene.add(light2)
//x轴正方向
const light3 = new THREE.DirectionalLight(0xffffff,1)
light3.position.set(10,0,0)
scene.add(light3)
//x轴负方向
const light4 = new THREE.DirectionalLight(0xffffff,1)
light4.position.set(-10,0,0)
scene.add(light4)
//y轴正方向
const light5 = new THREE.DirectionalLight(0xffffff,1)
light5.position.set(0,10,0)
scene.add(light5)
//y轴第二道光
const light6 = new THREE.DirectionalLight(0xffffff,0.3)
light6.position.set(5,10,0)
scene.add(light6)
//y轴第三道光
const ligth7 = new THREE.DirectionalLight(0xffffff,0.3)
ligth7.position.set(0,10,5)
scene.add(ligth7)
const ligth8 = new THREE.DirectionalLight(0xffffff,0.3)
ligth8.position.set(0,10,-5)
scene.add(ligth8)
const ligth9 = new THREE.DirectionalLight(0xffffff,0.3)
ligth9.position.set(-5,10,0)
scene.add(ligth9)



//创建选择颜色面板
let colors = ["red","blue","yellow","orange","black"]
let materials = [
	{
		name:"磨砂",
		value:1
	},{
		name:"冰晶",
		value:0
	}
]

var oDiv = document.createElement('div');
oDiv.style.position="fixed"
oDiv.style.right = 0;

let html = colors.map(color=>{
	return `<li data-color="${color}" style="background-color:${color}"></li>`
})

let html2 = materials.map(materials=>{
	return `<li data-material="${materials.value}">${materials.name}</li>`
})

oDiv.addEventListener("click",function(e){
	if( e.target && e.target.nodeName.toUpperCase() == "LI") {

		if(e.target.dataset.color) {
			console.log(e.target.dataset.color)
			const color = e.target.dataset.color
			carBodyMaterial.color.set(color)
			frontCarMaterial.color.set(color)
			hoodCarMaterial.color.set(color)
			wheelsCarMaterial.color.set(color)
		}

		if(e.target.dataset.material) {		
			console.log(e.target.dataset.material)
			const material = e.target.dataset.material
			carBodyMaterial.clearcoatRoughness = material
			frontCarMaterial.clearcoatRoughness= material
			hoodCarMaterial.clearcoatRoughness= material
			
		}
	}


	
})

oDiv.innerHTML = `<p class="title">请选择车衣颜色</p><ul class="selectColor">` + html.join("") + `</ul><p class="title">请选择贴膜材质</p><ul class="selectMaterial">` + html2.join("") + `</ul>`;




document.body.appendChild(oDiv)


var pointTexture = new THREE.TextureLoader().load('./textture/arrow.png');
var material = new THREE.SpriteMaterial( { map: pointTexture ,  color: 0xffffff} );
var sprite = new THREE.Sprite( material );
sprite.scale.set( 0.5, 0.5, 0.5 );
sprite.position.set(0,1.5,0)
scene.add(sprite)


console.log('scene.children',scene.children)

document.body.addEventListener("click",function (event) {
	event.preventDefault();

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	console.log('mouse',mouse)
	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( [sprite] );
	if(intersects.length>0){
		alert(1)
	}
});




//初始化渲染器
const renderer = new THREE.WebGLRenderer({
	//抗锯齿
	antialias:true
});


//设置场景默认背景颜色
//1.先清除原黑色背景（好像不清除也行）
renderer.setClearColor("#000")
//2. 设置场景背景色和环境颜色
scene.background = new THREE.Color("#ccc")
scene.environment = new THREE.Color("#ccc")

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





function animate(time) {
	if(model) {
		const axis = new THREE.Vector3(0,1,0)
		model.rotateOnAxis(axis,Math.PI / 500)
	}

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