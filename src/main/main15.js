import * as THREE from 'three'
//导入HDR用的

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
//模型是压缩过的 所以需要解压库
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
import { DirectionalLight } from 'three';

import gsap from 'gsap'

//目标 

//场景
const scene = new THREE.Scene();
//相机 透视相机PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
//设置相机位置 继承 Object3D 的方法 X,Y,Z z轴设置的小一些 靠近些CUBE内部效果好
camera.position.set(0,0,10)
//更新摄像头 宽高比，
camera.aspect = window.innerWidth / window.innerHeight
//更新摄像机的投影矩阵 因为摄像头宽高比变化后 像素矩阵要重新计算
camera.updateProjectionMatrix()
scene.add( camera );



/****  main  *** */
//制作页面

var oDiv = document.createElement('div')
oDiv.className = 'container'
oDiv.innerHTML = `<div class="wrapper"><p>第一页</p></div><div class="wrapper"><p>第二页</p></div><div class="wrapper"><p>第三页</p></div>`

document.body.appendChild(oDiv)

//创建星空背景
const skyTexture = new THREE.TextureLoader().load('./textture/darkSky.jpeg')
// skyTexture.mapping = THREE.EquirectangularReflectionMapping;
scene.background = skyTexture
scene.environment = skyTexture




//加载场景
let distance = -8 //3个页面的 距离
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
//设置解压到哪里取 这里边的一坨文件是从https://github.com/mrdoob/three.js/tree/master/examples/js/libs/draco 拷贝出来的 
dracoLoader.setDecoderPath( './draco/gltf/' );
dracoLoader.setDecoderConfig({type:'js'})
loader.setDRACOLoader( dracoLoader );
loader.load( './model/plane.gltf', function ( gltf ) {
	 const model = gltf.scene;
     console.log(model)
	//模型太大 缩小点
    model.scale.set(0.2,0.2,0.2)
    // model.rotation.set(-1,0.4,0.3)
    model.position.set(3,0,0)
	scene.add( model );

    //鼠标移动 旋转物体
    window.addEventListener("mousemove",(e)=>{
        //时间线方便控制一系列动画的运行
        const tl = gsap.timeline()
        tl.to(model.rotation,
            {
                x:(e.clientY / window.innerHeight) * 2 - 1, //-1 到 1之间
                y:(e.clientX / window.innerWidth) * 2 -1,
                duration:0.5,      
              
            }
        )
    })

}, undefined, function ( e ) {
	console.error( e );
});

loader.load( './model/robot.glb', function ( gltf ) {
    const model = gltf.scene;
    console.log(model)
   //模型太大 缩小点
//    model.scale.set(0.2,0.2,0.2)
//    model.rotation.set(-1,0.4,0.3)
   model.position.set(3,distance,0)
   scene.add( model );

   //鼠标移动 旋转物体
   window.addEventListener("mousemove",(e)=>{
       //时间线方便控制一系列动画的运行
       const tl = gsap.timeline()
       tl.to(model.rotation,
           {
               x:(e.clientY / window.innerHeight) * 2 - 1,
               y:(e.clientX / window.innerWidth) * 2 -1,
               duration:0.5             
             
           }
       )
   })

}, undefined, function ( e ) {
   console.error( e );
});


loader.load( './model/bmw01.glb', function ( gltf ) {
    const model = gltf.scene;
    console.log(model)
   //模型太大 缩小点
//    model.scale.set(0.2,0.2,0.2)
//    model.rotation.set(-1,0.4,0.3)
   model.position.set(3, 2 * distance,0)
   scene.add( model );

   //鼠标移动 旋转物体
   window.addEventListener("mousemove",(e)=>{
       //时间线方便控制一系列动画的运行
       const tl = gsap.timeline()
       tl.to(model.rotation,
           {
               x:(e.clientY / window.innerHeight) * 2 - 1,
               y:(e.clientX / window.innerWidth) * 2 -1,
               duration:0.5,             
             
           }
       )
   })

}, undefined, function ( e ) {
   console.error( e );
});

//切换屏幕 一共3页
let page = 0;
let timeline2 = gsap.timeline()
window.addEventListener("mousewheel",(e)=>{
    //小于0是向下滚
    if(e.wheelDelta< 0 ) {
        page++;
        if(page > 2) {
            page = 2
        }
    }

    if(e.wheelDelta > 0 ) {
        page--;
        if(page < 0) {
            page = 0
        }
    }
   console.log(page) 
   if(!timeline2.isActive()) {
    timeline2.to(camera.position,{
        y: page * distance,
        duration:1
    })
    const container = document.querySelector(".container")
     gsap.to(container,{
        y: -page * window.innerHeight,
        duration:1,
    })
   }
})


//不断出现的月球
//月球
const moonGeometry = new THREE.SphereGeometry(2.5,16,16);

const moonMaterial = new THREE.MeshPhongMaterial({
	map:new THREE.TextureLoader().load('./textture/moon.jpg')
})

//https://threejs.org/docs/index.html?q=mesh#api/zh/objects/InstancedMesh
//你可以使用 InstancedMesh 来渲染大量具有相同几何体与材质、但具有不同世界变换的物体。
//创建100个具有不同位置的月球 让他们向Z轴的负方向移动，这个过程循环10次
 for (var j =0; j<10; j++) {
    const moon= new THREE.InstancedMesh(moonGeometry,moonMaterial,100)
    moon.scale.set(0.1,0.1,0.1)
    //创建100个月球不同的位置
    for(var i=0; i<100; i++) {
    
        let x = Math.random() * 1000 - 500;
        let y = Math.random() * 1000 - 500;
        let z = Math.random() * 1000 - 500;
        //四维矩阵
        const martix = new THREE.Matrix4()

        //设置每个月球的大小
        let size = Math.random() * 20 - 8
        martix.makeScale(size,size,size)

        //在XYZ轴的平移量
        martix.makeTranslation(x,y,z)
        //https://threejs.org/docs/index.html?q=InstancedMesh#api/zh/objects/InstancedMesh
        moon.setMatrixAt(i,martix)
       
    }

    gsap.to(moon.position,{
        duration:Math.random() * 10 + 2,
        z: -100,
        ease:"linear",
        repeat:-1
    
    })
    
   
    
    scene.add(moon)
 }


//添加灯光
const light1 = new DirectionalLight(0xffffff,1)
light1.position.set(0,0,1)

const light2 = new DirectionalLight(0xffffff,0.5)
light2.position.set(0,0,-1)

const light3 = new DirectionalLight(0xffffff,0.5)
light3.position.set(-1,1,1)
scene.add(light1,light2,light3)







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
// const controls = new OrbitControls( camera, renderer.domElement );
//设置阻尼，让其拥有惯性,必须再动画循环里调用update()
// controls.enableDamping = true;


/** 添加坐标轴辅助器 s */
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );
/** 添加坐标轴辅助器 e */





function animate(time) {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
    // controls.update();
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