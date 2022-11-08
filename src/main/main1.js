import * as THREE from 'three'
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import gsap from 'gsap'

import * as dat from 'dat.gui'


//场景
const scene = new THREE.Scene();

console.log( window.innerWidth,window.innerHeight)
//相机 透视相机PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );


//设置相机位置 继承 Object3D 的方法 X,Y,Z
camera.position.set(0,0,10)

scene.add( camera );

//添加物体
//立方缓冲几何体（BoxGeometry） x,y,z
const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
//设置材质 基础网格材质(MeshBasicMaterial)
const material = new THREE.MeshBasicMaterial( {color: 0xff6e56} );
//创建物体 mesh继承自Object3D 
const cube = new THREE.Mesh( cubeGeometry, material );

//文档找Object3D  有下边这些属性
//修改物体的位置
// cube.position.set(5,0,0)
// cube.position.x = 5;

//物体的缩放
// cube.scale.set(3,2,1)

//物体的旋转 params x,y,z角度 Math.PI = 180度 /5 =45度
// cube.rotation.set(Math.PI/4,0,0)


scene.add( cube );


/** 创建可视化GUI s **/
const gui = new dat.GUI();
console.log('cube',cube)
//设置是否显示 visible只有true,false 所以显示一个复选框
gui.add(cube,"visible").name("是否显示")

//设置移动物体的X轴 最大，最小刻度 和刻度的精度
gui.add(cube.position,"x").min(0).max(5).step(0.01).name('移动X轴').onChange(value=>{
    console.log('值被修改',value)
}).onFinishChange(value=>{
    console.log('完全停下来',value)
});


const params = {
    color:"#ffff00",
    fn:()=>{
        //让立方体运动
        gsap.to(cube.position,{x:5,duration:2,yoyo:true,repeat:-1})
    }
}

//修改物体颜色
gui.addColor(params,"color").onChange(value=>{
    console.log('颜色被修改',value)
    cube.material.color.set(value)
})

//设置按钮，点击触发事件
// gui.add(params,'fn').name('点击立方体运动')

//创建文件夹
var folder = gui.addFolder("设置立方体");
//文件夹下边增加个选项  让立方体变成线框形式
folder.add(cube.material,"wireframe")
//设置按钮，点击触发事件
folder.add(params,'fn').name('点击立方体运动')


/** 创建可视化GUI E **/



//初始化渲染器

const renderer = new THREE.WebGLRenderer();

//设置渲染的尺寸和大小  ( width : Integer, height : Integer, updateStyle : Boolean ) : undefined
renderer.setSize(window.innerWidth,window.innerHeight);

//将渲染的内容（canvas）添加到body
document.body.appendChild(renderer.domElement)

//使用渲染器，通过相机将场景渲染进来 注释掉 放在动画里执行 每一帧都重新渲染
// renderer.render(scene,camera)


//创建轨道控制器 （相机围绕着物体旋转）
const controls = new OrbitControls( camera, renderer.domElement );
//设置阻尼，让其拥有惯性,必须再动画循环里调用update()
controls.enableDamping = true;

/** 添加坐标轴辅助器 s */
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
/** 添加坐标轴辅助器 e */


//设置时钟
// const clock = new THREE.Clock();

/** gsap动画 S */

// var gsap1 = gsap.to(
//     cube.position,
//     {
//         x:5,
//         duration:5,
//         //设置重复的次数，无限次是 -1
//         repeat:2,
//         //设置往返的运动
//         yoyo:true,
//         //延迟
//         delay:1,
//         onStart:()=>{
//             console.log('动画开始')
//         },
//         onComplete:()=>{
//             console.log('动画完成')
//     }}
// )
//围绕X轴旋转360度
// gsap.to(cube.rotation,{x:2 * Math.PI,duration:5,ease:"power1.out"})
//点击暂停 再点击恢复
// window.addEventListener("click",function(){
//     if(gsap1.isActive()) {
//         gsap1.pause()
//     }else {
//         gsap1.resume()
//     }
   
// })

/** gsap动画 E */


/**双击控制屏幕进入全屏 / 退出全屏  s*/
window.addEventListener('dblclick',function() {
    //如果全屏状态fullscreenElement是一个canvas 否则是 null
    document.fullscreenElement ? document.exitFullscreen() : renderer.domElement.requestFullscreen()
})
/**双击控制屏幕进入全屏 / 退出全屏  e*/



function animate(time) {
    // 渲染下一帧讲究会调用animate函数

    //每一帧渲染的毫秒数
    // console.log(time)

    //1. 让物体运动不能按照下面的方式，因为浏览器差异 每次requestAnimationFrame运行时间间隔频率不同
    // cube.position.x += 0.01;
    // cube.rotation.x += 0.01;

    // if(cube.position.x > 5) {
    //     cube.position.x = 0
    // }


    //2. 正确的物体运动方法 步长 =  时间 * 速度
    // let t = time / 1000 ;  //time 是毫秒/1000 转成秒=》 每秒
    // cube.position.x = t * 1 //时间 * 速度（1） 
    //也可以不用下边的 用求余  let t = time / 1000 % 5    这样比如 1%5 = 1 5%5=0 这样就可以循环从0开始了 
    // if(cube.position.x > 5) {
    //     cube.position.x = 0
    // }


    //3. 更好的方法
    //获取时钟运行的总时长
    // let elaspedTime = clock.getElapsedTime()

    //两帧的间隔时间
    // // let deltaTime = clock.getDelta()

    // console.log('时钟运行的总时长 ',elaspedTime)
    // //console.log('两次获取时间的间隔时间 ',deltaTime)

    //let t = elaspedTime % 5
    //cube.position.x = t * 1 //时间 * 速度（1） 

    //4. 更更更好的方法 用gsap动画库




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