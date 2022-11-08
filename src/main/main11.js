import * as THREE from 'three'

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



//目标 VR全景

//场景
const scene = new THREE.Scene();
//相机 透视相机PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//设置相机位置 继承 Object3D 的方法 X,Y,Z z轴设置的小一些 靠近些CUBE内部效果好
camera.position.set(0,0,2)
//更新摄像头 宽高比，
camera.aspect = window.innerWidth / window.innerHeight
//更新摄像机的投影矩阵 因为摄像头宽高比变化后 像素矩阵要重新计算
camera.updateProjectionMatrix()
scene.add( camera );



/****  main  *** */

//添加立方体
const geometry = new THREE.BoxGeometry(10,10,10)
// const material = new THREE.MeshBasicMaterial({color:0x00ff00})
// const cube = new THREE.Mesh(geometry,material)


//客厅

const living_arr = [
	"4_l",//左 
	"4_r",//右
	"4_u",//上
	"4_d",//下
	"4_b",//前
	"4_f"//后
];
const boxMaterials = []

living_arr.forEach(item=>{
	//纹理加载
	let texture = new THREE.TextureLoader().load(`./textture/vr_room/living/${item}.jpg`)
	//上下两张图 需要旋转180度 要不对不上
	if(item === '4_u' || item === '4_d') {
		texture.rotation = Math.PI;
		//以这个为中心点旋转 0.5, 0.5对应纹理的正中心。默认值为(0,0)，即左下角。 https://threejs.org/docs/index.html?q=TextureLoader#api/zh/textures/Texture
		texture.center = new THREE.Vector2(0.5,0.5)
	}
	boxMaterials.push(new THREE.MeshBasicMaterial({map:texture}))
})


//第二个参数 —— （可选）一个Material，或是一个包含有Material的数组，默认是一个新的MeshBasicMaterial
const cube = new THREE.Mesh(geometry,boxMaterials)
// geometry.scale(1,1,-1) 同样的效果，把Z周翻转过来 使我们在立方体里边能看到贴图
cube.geometry.scale(1,1,-1)
scene.add(cube)


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