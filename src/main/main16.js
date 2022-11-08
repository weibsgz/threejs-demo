import * as THREE from 'three'


//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'


//场景
const scene = new THREE.Scene();
//相机 透视相机PerspectiveCamera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
//设置相机位置 继承 Object3D 的方法 X,Y,Z z轴设置的小一些 靠近些CUBE内部效果好
camera.position.set(0,50,300)
//更新摄像头 宽高比，
camera.aspect = window.innerWidth / window.innerHeight
//更新摄像机的投影矩阵 因为摄像头宽高比变化后 像素矩阵要重新计算
camera.updateProjectionMatrix()
scene.add( camera );



/****  main  *** */

//经纬度转换函数 把经纬度转换为3D坐标
const lon2xyz = (R, longitude, latitude) => {
	let lon = (longitude * Math.PI) / 180; // 转弧度值
	const lat = (latitude * Math.PI) / 180; // 转弧度值
	lon = -lon; // js坐标系z坐标轴对应经度-90度，而不是90度
  
	// 经纬度坐标转球面坐标计算公式
	const x = R * Math.cos(lat) * Math.cos(lon);
	const y = R * Math.sin(lat);
	const z = R * Math.cos(lat) * Math.sin(lon);
	// 返回球面坐标
	return new THREE.Vector3(x, y, z);
};


//设置星空背景色
scene.background = new THREE.Color(0x030311)


// 使用点材质创建星空星星点点效果
const vertices = [];
for (let i = 0; i < 500; i++) {
const vertex = new THREE.Vector3();
vertex.x = 800 * Math.random() - 400;
vertex.y = 800 * Math.random() - 400;
vertex.z = 800 * Math.random() - 400;
vertices.push(vertex.x, vertex.y, vertex.z);
}
console.log(vertices)

//创建星空效果

const starsGeometry = new THREE.BufferGeometry();
const positionArray = new Float32Array(vertices)
// itemSize = 3 因为每个顶点都是一个三元组。
starsGeometry.setAttribute( 'position', new THREE.BufferAttribute( positionArray, 3 ) );

  // 加载点材质纹理
const starsTexture = new THREE.TextureLoader().load("./textture/stars.png");
const starsMaterial = new THREE.PointsMaterial({
size: 2,
sizeAttenuation: true, // 尺寸衰减 指定点的大小是否因相机深度而衰减。
color: 0x4d76cf,
transparent: true,
opacity: 1,
map: starsTexture,
});

let stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);


 // 创建地球
 let earthGeometry = new THREE.SphereGeometry(50, 32, 32);
 let earthTexture = new THREE.TextureLoader().load("./textture/map.jpg");

 let earthMaterial = new THREE.MeshBasicMaterial({
   map: earthTexture,
 });
 let earth = new THREE.Mesh(earthGeometry, earthMaterial);
 scene.add(earth);


// 发光地球
let lightTexture = new THREE.TextureLoader().load("./textture/earth.png");
let lightEarthGeometry = new THREE.SphereGeometry(53, 32, 32);
let lightEarthMaterial = new THREE.MeshBasicMaterial({
	map: lightTexture,
	alphaMap: lightTexture, //alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（颜色越深越透明）。
	blending: THREE.AdditiveBlending, //？
	transparent: true,
});
let lightEarth = new THREE.Mesh(lightEarthGeometry, lightEarthMaterial);
scene.add(lightEarth);


// 添加地球内外发光精灵 精灵是一个总是面朝着摄像机的平面，通常含有使用一个半透明的纹理。

//外发光 https://threejs.org/docs/index.html?q=SpriteMaterial#api/zh/materials/Material
let spriteTexture = new THREE.TextureLoader().load("./textture/glow.png");
let spriteMaterial = new THREE.SpriteMaterial({
  map: spriteTexture,
  color: 0x4d76cf,
  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: THREE.AdditiveBlending,
});
let sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(155, 155, 0);
scene.add(sprite);


  // 内发光
let spriteTexture1 = new THREE.TextureLoader().load("./textture/innerGlow.png");
let spriteMaterial1 = new THREE.SpriteMaterial({
map: spriteTexture1,
color: 0x4d76cf,
transparent: true,
depthWrite: false,
depthTest: false,
blending: THREE.AdditiveBlending,
});
let sprite1 = new THREE.Sprite(spriteMaterial1);
sprite1.scale.set(128, 128, 0);
scene.add(sprite1);


for (let i = 0; i < 30; i++) {
  //实现光柱
  let lightPillarTexture = new THREE.TextureLoader().load(
	"./textture/light_column.png"
  );
  let lightPillarGeometry = new THREE.PlaneGeometry(3, 20);
  let lightPillarMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	map: lightPillarTexture,
	alphaMap: lightPillarTexture,
	transparent: true,
	blending: THREE.AdditiveBlending,
	side: THREE.DoubleSide,
	depthWrite: false,
  });
  let lightPillar = new THREE.Mesh(lightPillarGeometry, lightPillarMaterial);
  //再复制一个光柱放在光柱里边 旋转90度Y轴 变成2个光柱的平面交叉在一起
  lightPillar.add(lightPillar.clone().rotateY(Math.PI / 2));



	// 创建波纹扩散效果
	let circlePlane = new THREE.PlaneGeometry(6, 6);
	let circleTexture = new THREE.TextureLoader().load("./textture/label.png");
	let circleMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	map: circleTexture,
	transparent: true,
	blending: THREE.AdditiveBlending,
	depthWrite: false,
	side: THREE.DoubleSide,
	});
	let circleMesh = new THREE.Mesh(circlePlane, circleMaterial);
	//水波纹放到光柱里，位置下移 放平
	circleMesh.rotation.x = -Math.PI / 2;
	circleMesh.position.set(0, -7, 0);

	lightPillar.add(circleMesh);
	// 放大，缩小
	gsap.to(circleMesh.scale, {
	duration: 1 + Math.random() * 0.5,
	x: 2,
	y: 2,
	z: 2,
	repeat: -1,
	delay: Math.random() * 0.5,
	yoyo: true,
	ease: "power2.inOut",
	});



	//随机按照经纬度生成XYZ的坐标
	let lat = Math.random() * 180 - 90;
	let lon = Math.random() * 360 - 180;
	let position = lon2xyz(60, lon, lat);
	lightPillar.position.set(position.x, position.y, position.z);

	//https://threejs.org/docs/index.html?q=Mesh#api/zh/core/Object3D.quaternion
	//旋转 旋转到随机生成的经纬度转换的XYZ坐标上
	lightPillar.quaternion.setFromUnitVectors(
		new THREE.Vector3(0, 1, 0),
		position.clone().normalize()
	);

	scene.add(lightPillar)

} //循环光柱结束

// 绕地球运行的月球
let moonTexture = new THREE.TextureLoader().load("./textture/moon1.jpg");
let moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  emissive: 0xffffff, //材质的放射（光）颜色
  emissiveMap: moonTexture, //设置放射（发光）贴图。
});
let moonGeometry = new THREE.SphereGeometry(5, 32, 32);
let moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(150, 0, 0);
scene.add(moon);


  // 创建月球环
  //月球环半径
  const RADIUS = 150
  let moonRingTexture = new THREE.TextureLoader().load(
    "./textture/moon_ring.png"
  );
  let moonRingMaterial = new THREE.MeshBasicMaterial({
    map: moonRingTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
    opacity: 0.5,
  });
  let moonRingGeometry = new THREE.RingGeometry(RADIUS - 5, RADIUS + 5, 64);
  let moonRing = new THREE.Mesh(moonRingGeometry, moonRingMaterial);
  moonRing.rotation.x = -Math.PI / 2;
  scene.add(moonRing);


  //环绕运动
  let time = {
    value: 0,
  };
  gsap.to(time, {
    value: 1,
    duration: 10,
    repeat: -1,
    ease: "linear",
    onUpdate: () => {
      moon.position.x = RADIUS * Math.cos(time.value * Math.PI * 2);
      moon.position.z = RADIUS * Math.sin(time.value * Math.PI * 2);
      moon.rotation.y = time.value * Math.PI * 8;
    },
  });


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