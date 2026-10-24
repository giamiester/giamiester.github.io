import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const AU_DAY = 0.01720209895;
const J2000 = 2451545.0;
const bodyData = [
  { name:'Mercury', code:'mercury', type:'PLANET', kind:'planet', color:'#b9a08b', a:.38709927, e:.20563593, i:7.00497902, L:252.25032350, peri:77.45779628, node:48.33076593, da:.00000037, de:.00001906, di:-.00594749, dL:149472.67411175, dperi:.16047689, dnode:-.12534081, radius:5, diameter:'4,879 km', periodLabel:'88 DAYS', fact:'A day on Mercury lasts longer than its year.' },
  { name:'Venus', code:'venus', type:'PLANET', kind:'planet', color:'#d7b07b', a:.72333566, e:.00677672, i:3.39467605, L:181.97909950, peri:131.60246718, node:76.67984255, da:.00000390, de:-.00004107, di:-.00078890, dL:58517.81538729, dperi:.00268329, dnode:-.27769418, radius:7, diameter:'12,104 km', periodLabel:'225 DAYS', fact:'Venus rotates in the opposite direction to most planets.' },
  { name:'Earth', code:'earth', type:'TERRESTRIAL', kind:'planet', color:'#ffffff', a:1.00000261, e:.01671123, i:-.00001531, L:100.46457166, peri:102.93768193, node:0, da:.00000562, de:-.00004392, di:-.01294668, dL:35999.37244981, dperi:.32327364, dnode:0, radius:8, diameter:'12,742 km', periodLabel:'365 DAYS', fact:'About 71% of Earth’s surface is covered by water.' },
  { name:'Mars', code:'mars', type:'TERRESTRIAL', kind:'planet', color:'#ffffff', a:1.52371034, e:.09339410, i:1.84969142, L:-4.55343205, peri:-23.94362959, node:49.55953891, da:.00001847, de:.00007882, di:-.00813131, dL:19140.30268499, dperi:.44441088, dnode:-.29257343, radius:6, diameter:'6,779 km', periodLabel:'687 DAYS', fact:'Olympus Mons is the largest volcano in the solar system.' },
  { name:'Jupiter', code:'jupiter', type:'GAS GIANT', kind:'planet', color:'#ffffff', a:5.20288700, e:.04838624, i:1.30439695, L:34.39644051, peri:14.72847983, node:100.47390909, da:-.00011607, de:-.00013253, di:-.00183714, dL:3034.74612775, dperi:.21252668, dnode:.20469106, radius:12, diameter:'139,820 km', periodLabel:'11.9 YEARS', fact:'The Great Red Spot is a storm wider than Earth.' },
  { name:'Saturn', code:'saturn', type:'GAS GIANT', kind:'planet', color:'#ffffff', a:9.53667594, e:.05386179, i:2.48599187, L:49.95424423, peri:92.59887831, node:113.66242448, da:-.00125060, de:-.00050991, di:.00193609, dL:1222.49362201, dperi:-.41897216, dnode:-.28867794, radius:10, diameter:'116,460 km', periodLabel:'29.4 YEARS', fact:'Saturn’s rings are broad, bright, and remarkably thin.', ringed:true },
  { name:'Uranus', code:'uranus', type:'ICE GIANT', kind:'planet', color:'#ffffff', a:19.18916464, e:.04725744, i:.77263783, L:313.23810451, peri:170.95427630, node:74.01692503, da:-.00196176, de:-.00004397, di:-.00242931, dL:428.48202785, dperi:.40805281, dnode:.04240589, radius:8, diameter:'50,724 km', periodLabel:'84 YEARS', fact:'Uranus rotates almost completely on its side.' },
  { name:'Neptune', code:'neptune', type:'ICE GIANT', kind:'planet', color:'#ffffff', a:30.06992276, e:.00859048, i:1.77004347, L:-55.12002969, peri:44.96476227, node:131.78422574, da:.00026291, de:.00005105, di:.00035372, dL:218.45945325, dperi:-.32241464, dnode:-.00508664, radius:8, diameter:'49,244 km', periodLabel:'165 YEARS', fact:'Neptune’s winds can exceed 2,000 km/h.' },
  { name:'Ceres', code:'ceres', type:'DWARF PLANET', kind:'dwarf', color:'#b9a98d', a:2.76704625, e:.07553461, i:10.59351, L:160.50717, peri:153.42526, node:80.30992, radius:5, diameter:'940 km', periodLabel:'4.6 YEARS', fact:'Bright deposits at Occator Crater are salt-rich.' },
  { name:'Pluto', code:'pluto', type:'DWARF PLANET', kind:'dwarf', color:'#c7a78f', a:39.48211675, e:.24882730, i:17.14001, L:238.92904, peri:224.06892, node:110.30394, radius:6, diameter:'2,377 km', periodLabel:'248 YEARS', fact:'Pluto and Neptune are locked in a stable 3:2 orbital resonance.' },
  { name:'Eris', code:'eris', type:'DWARF PLANET', kind:'dwarf', color:'#d3d9de', a:67.781, e:.44068, i:44.04, L:21.79, peri:187.59, node:35.95, radius:5.5, diameter:'2,326 km', periodLabel:'558 YEARS', fact:'Sunlight takes more than nine hours to reach Eris.' },
  { name:'1P/Halley', code:'halley', type:'COMET', kind:'comet', color:'#b5d8e6', a:17.83414508, e:.96714291, i:162.26269, L:236.20751, peri:169.75257, node:58.42008, radius:3.8, diameter:'~11 km', periodLabel:'75 YEARS', fact:'Halley’s Comet returns to the inner solar system about once every 75 years.' },
  { name:'2P/Encke', code:'encke', type:'COMET', kind:'comet', color:'#b9d7c9', a:2.21449314, e:.84833156, i:11.78308, L:83.66150, peri:521.11552, node:334.56582, radius:3.8, diameter:'~4.8 km', periodLabel:'3.3 YEARS', fact:'Encke has the shortest orbital period of any well-established periodic comet.' },
  { name:'67P/Churyumov-Gerasimenko', code:'67p', type:'COMET', kind:'comet', color:'#a9c8b9', a:3.458992, e:.649493, i:3.8661, L:276.50057, peri:58.5260, node:36.2874, radius:4, diameter:'~4.3 km', periodLabel:'6.4 YEARS', fact:'ESA’s Rosetta mission orbited 67P and delivered the Philae lander to its surface.' },
];

const cometMeanMotion = { halley:.0130865639, encke:.2990835761, '67p':.1532073983 };
for (const body of bodyData) {
  if (body.kind !== 'planet') {
    body.elements = { a:body.a, e:body.e, i:body.i, node:body.node, w:body.peri-body.node, epoch:J2000, ma:((body.L-body.peri)%360+360)%360, n:cometMeanMotion[body.code] || 0.9856076686/Math.pow(body.a,1.5) };
  }
}

const byCode = code => bodyData.find(body => body.code === code) || customObjects.get(code);
const tracked = new Set(bodyData.map(body => body.code));
const customObjects = new Map();
const positions = new Map();
const views = new Map();
let selected = 'earth';
let renderer, scene, camera, controls, sunLight, sunMesh, selectionRing;
let simDate = new Date();
let lastFocusPoint = new THREE.Vector3();
let labelsVisible = false;
let frameClock = new THREE.Clock();
const orbitStage = document.querySelector('#orbit-stage');
const canvas = document.querySelector('#system-map');
const labelLayer = document.querySelector('#object-labels');
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const vectorUp = new THREE.Vector3(0, 1, 0);
const planetTextureFiles = new Set(['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune']);
const textureLoader = new THREE.TextureLoader();

const radians = value => value * Math.PI / 180;
const normalize = value => (value % 360 + 360) % 360;
const jdNow = date => date.getTime() / 86400000 + 2440587.5;
const formatDistance = distance => distance < 10 ? distance.toFixed(3) : distance.toFixed(2);

function solveElliptic(meanAnomaly, eccentricity) {
  let E = meanAnomaly;
  for (let n = 0; n < 16; n++) {
    const delta = (E - eccentricity * Math.sin(E) - meanAnomaly) / (1 - eccentricity * Math.cos(E));
    E -= delta;
    if (Math.abs(delta) < 1e-11) break;
  }
  return E;
}

function rotateOrbit(x, y, argument, node, inclination) {
  const cw = Math.cos(argument), sw = Math.sin(argument), co = Math.cos(node), so = Math.sin(node), ci = Math.cos(inclination), si = Math.sin(inclination);
  return new THREE.Vector3(
    (cw*co-sw*so*ci)*x + (-sw*co-cw*so*ci)*y,
    sw*si*x + cw*si*y,
    (cw*so+sw*co*ci)*x + (-sw*so+cw*co*ci)*y,
  );
}

function getPosition(body, jd) {
  if (body.kind === 'planet') {
    const T = (jd - J2000) / 36525;
    const a = body.a + body.da*T, e = body.e + body.de*T;
    const inclination = radians(body.i + body.di*T), L = body.L + body.dL*T;
    const peri = body.peri + body.dperi*T, node = body.node + body.dnode*T;
    const M = radians(normalize(L-peri)), E = solveElliptic(M,e);
    const p = rotateOrbit(a*(Math.cos(E)-e),a*Math.sqrt(1-e*e)*Math.sin(E),radians(peri-node),radians(node),inclination);
    return { p, distance:p.length(), a, e, period:365.2568983*Math.sqrt(a*a*a), progress:normalize(L-peri)/360 };
  }
  const el = body.elements, e = el.e;
  let a = el.a, x, y, period = Infinity, progress = 0;
  if (Number.isFinite(a) && a > 0 && e < 1) {
    const meanDegrees = normalize(el.ma + el.n*(jd-el.epoch));
    const E = solveElliptic(radians(meanDegrees),e);
    x = a*(Math.cos(E)-e); y = a*Math.sqrt(1-e*e)*Math.sin(E);
    period = 365.2568983*Math.sqrt(a*a*a); progress = meanDegrees/360;
  } else {
    const perihelion = el.q || Math.abs(a*(1-e));
    const semi = perihelion/(1-e); a = semi;
    if (e < 1) {
      const M = (jd-el.tp)*AU_DAY/Math.pow(semi,1.5), E = solveElliptic(M,e);
      x = semi*(Math.cos(E)-e); y = semi*Math.sqrt(1-e*e)*Math.sin(E); period = 365.2568983*Math.sqrt(semi*semi*semi);
    } else {
      const aa = -semi, M = (jd-el.tp)*AU_DAY/Math.pow(aa,1.5); let H = Math.asinh(M/e);
      for (let n=0;n<18;n++) { const d=(e*Math.sinh(H)-H-M)/(e*Math.cosh(H)-1); H-=d; if(Math.abs(d)<1e-10)break; }
      x = aa*(e-Math.cosh(H)); y = aa*Math.sqrt(e*e-1)*Math.sinh(H);
    }
  }
  const p = rotateOrbit(x,y,radians(el.w||0),radians(el.node||0),radians(el.i||0));
  return { p, distance:p.length(), a, e, period, progress };
}

// Compress AU radii for readability while retaining the orbital direction and true 3D depth ordering.
function scenePosition(position) {
  const distance = position.length();
  if (distance < 1e-8) return new THREE.Vector3();
  const compressedDistance = Math.sqrt(distance / 30);
  const scale = compressedDistance / distance;
  return new THREE.Vector3(position.x*scale, position.z*scale, position.y*scale);
}

function createOrbitPoints(body, jd) {
  const points = [];
  if (body.kind === 'planet') {
    const T = (jd-J2000)/36525, a=body.a+body.da*T, e=body.e+body.de*T;
    const inclination=radians(body.i+body.di*T), peri=body.peri+body.dperi*T, node=body.node+body.dnode*T;
    for (let j=0;j<220;j++) { const E=j/220*Math.PI*2; const p=rotateOrbit(a*(Math.cos(E)-e),a*Math.sqrt(1-e*e)*Math.sin(E),radians(peri-node),radians(node),inclination); points.push(scenePosition(p)); }
  } else {
    const el=body.elements, e=el.e;
    if (Number.isFinite(el.a) && el.a>0 && e<1) {
      for (let j=0;j<220;j++) { const E=j/220*Math.PI*2; const p=rotateOrbit(el.a*(Math.cos(E)-e),el.a*Math.sqrt(1-e*e)*Math.sin(E),radians(el.w||0),radians(el.node||0),radians(el.i||0)); points.push(scenePosition(p)); }
    } else {
      const peri=el.q||Math.abs(el.a*(1-e)), limit=Math.acos(-1/e)*.88, parameter=peri*(1+e);
      for (let j=0;j<=220;j++) { const nu=(j/220*2-1)*limit, r=parameter/(1+e*Math.cos(nu)); points.push(scenePosition(rotateOrbit(r*Math.cos(nu),r*Math.sin(nu),radians(el.w||0),radians(el.node||0),radians(el.i||0)))); }
    }
  }
  return points;
}

function makeStarfield() {
  let seed = 173;
  const random = () => { seed = (seed*1664525+1013904223)>>>0; return seed/4294967296; };
  const vertices = [];
  for (let i=0;i<1500;i++) {
    const radius=2.0+random()*2.8, theta=random()*Math.PI*2, z=(random()*2-1)*radius;
    const ring=Math.sqrt(Math.max(0,radius*radius-z*z));
    vertices.push(Math.cos(theta)*ring,z,Math.sin(theta)*ring);
  }
  const geometry=new THREE.BufferGeometry(); geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  const material=new THREE.PointsMaterial({color:0xb8cbe4,size:.009,sizeAttenuation:true,transparent:true,opacity:.76,depthWrite:false});
  scene.add(new THREE.Points(geometry,material));
}

function makeSun() {
  const geometry=new THREE.SphereGeometry(.055,64,40);
  const material=new THREE.MeshBasicMaterial({color:0xffe5a3,toneMapped:false});
  sunMesh=new THREE.Mesh(geometry,material); sunMesh.name='sun'; scene.add(sunMesh);
  sunLight=new THREE.PointLight(0xffd99a,.7,0,1); sunLight.position.set(0,0,0); scene.add(sunLight);
  const glowTextureCanvas=document.createElement('canvas'); glowTextureCanvas.width=glowTextureCanvas.height=128;
  const ctx=glowTextureCanvas.getContext('2d'), gradient=ctx.createRadialGradient(64,64,2,64,64,62);
  gradient.addColorStop(0,'rgba(255,231,168,.8)'); gradient.addColorStop(.18,'rgba(255,184,91,.35)'); gradient.addColorStop(1,'rgba(255,140,48,0)');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const glowTexture=new THREE.CanvasTexture(glowTextureCanvas);glowTexture.colorSpace=THREE.SRGBColorSpace;
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
  glow.scale.set(.62,.62,1); scene.add(glow);
}

function addBodyView(body) {
  if (views.has(body.code)) return views.get(body.code);
  const root=new THREE.Group();root.name=body.name;root.userData.code=body.code;scene.add(root);
  const radius=Math.max(.009,body.radius*.0042);
  const material=new THREE.MeshStandardMaterial({color:body.color,roughness:.88,metalness:0});
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(radius,64,48),material);mesh.name=body.name;mesh.userData.code=body.code;root.add(mesh);
  if (planetTextureFiles.has(body.code)) {
    textureLoader.load(new URL(`./textures/${body.code}.jpg`,import.meta.url).href,texture=>{
      texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
      mesh.material.map=texture;mesh.material.color.set(0xffffff);mesh.material.needsUpdate=true;
    },undefined,()=>toast(`Could not load ${body.name} texture`));
  }
  if (body.ringed) {
    const ring=new THREE.Mesh(new THREE.RingGeometry(radius*1.35,radius*2.25,96),new THREE.MeshStandardMaterial({color:0xb5a17c,roughness:1,side:THREE.DoubleSide,transparent:true,opacity:.8}));
    ring.rotation.x=-Math.PI/2+.12;ring.rotation.z=.18;root.add(ring);
    const outer=new THREE.Mesh(new THREE.RingGeometry(radius*2.26,radius*2.42,96),new THREE.MeshStandardMaterial({color:0x786b58,roughness:1,side:THREE.DoubleSide,transparent:true,opacity:.44}));
    outer.rotation.copy(ring.rotation);root.add(outer);
  }
  let tail=null,tailInner=null;
  if (body.kind==='comet') {
    const length=.16;
    tail=new THREE.Mesh(new THREE.ConeGeometry(radius*.52,length,16,1,true),new THREE.MeshBasicMaterial({color:body.color,transparent:true,opacity:.24,side:THREE.DoubleSide,depthWrite:false}));
    tailInner=new THREE.Mesh(new THREE.ConeGeometry(radius*.24,length*.76,12,1,true),new THREE.MeshBasicMaterial({color:0xdaf1ff,transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false}));
    root.add(tail,tailInner);
  }
  const orbitMaterial=new THREE.LineBasicMaterial({color:body.color,transparent:true,opacity:body.kind==='comet'?.2:.18,depthWrite:false});
  const orbit=new THREE.LineLoop(new THREE.BufferGeometry(),orbitMaterial);orbit.frustumCulled=false;scene.add(orbit);
  const label=document.createElement('span');label.className='object-label';label.textContent=body.name;labelLayer.append(label);
  const view={body,root,mesh,orbit,tail,tailInner,label,radius,position:new THREE.Vector3()};views.set(body.code,view);
  return view;
}

function updateOrbit(view,jd) {
  view.orbit.geometry.dispose();
  view.orbit.geometry.setFromPoints(createOrbitPoints(view.body,jd));
}

function initializeScene() {
  scene=new THREE.Scene();scene.background=new THREE.Color(0x080d18);
  camera=new THREE.PerspectiveCamera(48,1,.008,100);
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;
  controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.065;controls.enablePan=true;controls.screenSpacePanning=true;controls.zoomSpeed=.8;controls.panSpeed=.8;controls.minDistance=.045;controls.maxDistance=18;controls.minPolarAngle=.001;controls.maxPolarAngle=Math.PI-.001;controls.target.set(0,0,0);
  scene.add(new THREE.HemisphereLight(0x9bb9df,0x111522,.12));
  makeStarfield();makeSun();
  const jd=jdNow(simDate);
  for (const body of bodyData) { const view=addBodyView(body);updateOrbit(view,jd); }
  const earthPosition=scenePosition(getPosition(byCode(selected),jd).p);
  controls.target.copy(earthPosition);camera.position.copy(earthPosition).add(new THREE.Vector3(.86,1.08,3.05));controls.update();lastFocusPoint.copy(earthPosition);
  selectionRing=new THREE.LineLoop(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0xc4f36a,transparent:true,opacity:.8,depthWrite:false}));scene.add(selectionRing);
  resizeRenderer();
  controls.addEventListener('change',updateZoomLabel);
  renderer.setAnimationLoop(animate);
}

function resizeRenderer() {
  const width=canvas.clientWidth,height=canvas.clientHeight;if(!width||!height||!renderer)return;
  renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
}

function updateClock() {
  const now=new Date();
  document.querySelector('#utc-clock').textContent=now.toISOString().slice(11,19)+' UTC';
  document.querySelector('#local-date').textContent=new Intl.DateTimeFormat('en-US',{year:'numeric',month:'short',day:'2-digit'}).format(now).toUpperCase();
}

function speed(body,pos) { return Number.isFinite(pos.a)&&pos.a>0 ? 29.7847*Math.sqrt(Math.max(0,2/pos.distance-1/pos.a)) : 0; }

function renderFocus(body,jd) {
  const isSun=!body,pos=isSun?{distance:0,a:0,e:0,period:Infinity,progress:0}:getPosition(body,jd);
  const shown=body||{name:'Sun',type:'STAR',color:'#ffd783',diameter:'1,392,700 km',periodLabel:'225 MILLION YEARS',fact:'The Sun contains more than 99% of the solar system’s mass.'};
  document.querySelector('#selected-name').textContent=shown.name;
  document.querySelector('#object-kind').textContent=shown.type;
  document.querySelector('#distance').textContent=formatDistance(pos.distance);
  document.querySelector('#orbital-speed').innerHTML=`${isSun?'—':speed(body,pos).toFixed(2)} <small>${isSun?'':'KM/S'}</small>`;
  document.querySelector('#eccentricity').textContent=isSun?'—':pos.e.toFixed(4);
  document.querySelector('#orbit-period').textContent=isSun?'CENTER OF THE SOLAR SYSTEM':shown.periodLabel||`${(pos.period/365.2568983).toFixed(1)} YEARS`;
  const progress=isSun?0:(pos.progress||0);document.querySelector('#orbit-progress-label').textContent=isSun?'—':`${Math.floor(progress*100).toString().padStart(2,'0')}%`;
  document.querySelector('#orbit-progress').style.width=`${progress*100}%`;
  const art=document.querySelector('#focus-planet');art.style.setProperty('--planet-color',shown.color);art.className=`focus-planet ${shown.ringed?'ringed':''}`;
  document.querySelector('#object-fact').textContent=shown.fact||'Approximate osculating orbit from JPL Small-Body Database.';
  const button=document.querySelector('#track-button');button.disabled=isSun;button.classList.toggle('is-tracked',!isSun&&tracked.has(body.code));button.innerHTML=isSun?'<span>☼</span> THE SUN IS ALWAYS VISIBLE':tracked.has(body.code)?'<span>✓</span> TRACKING':'<span>＋</span> TRACK OBJECT';
  const external=document.querySelector('#external-link');external.disabled=isSun;external.onclick=()=>{if(isSun)return;const id=body.kind==='planet'?({mercury:'199',venus:'299',earth:'399',mars:'499',jupiter:'599',saturn:'699',uranus:'799',neptune:'899'}[body.code]||body.name):body.name;window.open(`https://ssd.jpl.nasa.gov/horizons/app.html#/?COMMAND='${encodeURIComponent(id)}'`,'_blank','noopener');};
}

function renderList(jd) {
  const list=document.querySelector('#tracked-list'),scroll=list.scrollTop;list.replaceChildren();
  const objects=[...bodyData,...customObjects.values()].filter(body=>tracked.has(body.code));
  for (const body of objects) {
    const pos=getPosition(body,jd),row=document.createElement('div');row.className='tracked-row'+(body.code===selected?' active':'');row.style.setProperty('--row-color',body.color);row.tabIndex=0;row.setAttribute('role','button');row.setAttribute('aria-label',`Select ${body.name}`);
    const dot=document.createElement('span');dot.className='row-dot';
    const nameWrap=document.createElement('span');nameWrap.className='row-name';nameWrap.append(document.createTextNode(body.name));const type=document.createElement('small');type.className='row-type';type.textContent=body.type;nameWrap.append(type);
    const distance=document.createElement('span');distance.className='row-distance';distance.append(document.createTextNode(formatDistance(pos.distance)+' '));const au=document.createElement('small');au.textContent='AU';distance.append(au);
    const remove=document.createElement('button');remove.className='remove-object';remove.type='button';remove.setAttribute('aria-label',`Stop tracking ${body.name}`);remove.title='Stop tracking';remove.textContent='×';
    row.append(dot,nameWrap,distance,remove);row.addEventListener('click',event=>{if(!event.target.closest('.remove-object'))selectBody(body.code)});row.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectBody(body.code);}});
    remove.addEventListener('click',event=>{event.stopPropagation();tracked.delete(body.code);const view=views.get(body.code);if(view){view.root.visible=false;view.orbit.visible=false;view.label.style.display='none';}if(selected===body.code)selectBody('sun');render();});list.append(row);
  }
  list.scrollTop=scroll;document.querySelector('#tracked-count').textContent=String(tracked.size).padStart(2,'0');
}

function selectBody(code) {
  const body=code==='sun'?null:byCode(code);
  if (code!=='sun'&&!body)return;
  if (body&&!tracked.has(body.code))tracked.add(body.code);
  selected=body?.code||null;
  const jd=jdNow(simDate),next=body?scenePosition(getPosition(body,jd).p):new THREE.Vector3();
  const shift=next.clone().sub(controls.target);camera.position.add(shift);controls.target.copy(next);controls.update();lastFocusPoint.copy(next);
  render();
}

function render() {
  const jd=jdNow(simDate);positions.clear();
  for(const body of [...bodyData,...customObjects.values()])positions.set(body.code,getPosition(body,jd));
  const focus=selected?byCode(selected):null;renderFocus(focus,jd);renderList(jd);
  document.querySelector('#updated-at').textContent=`UPDATED ${simDate.toISOString().slice(11,19)} UTC`;
  const labelsButton=document.querySelector('.view-btn[data-mode="labels"]');labelsVisible=labelsButton.classList.contains('active');orbitStage.classList.toggle('labels-hidden',!labelsVisible);
  for(const [code,view] of views){const visible=tracked.has(code);view.root.visible=visible;view.orbit.visible=visible;view.label.style.display=visible&&labelsVisible?'block':'none';}
}

function updateZoomLabel() {
  const baseline=3.34, current=camera.position.distanceTo(controls.target);
  document.querySelector('#zoom-level').textContent=`${Math.round(baseline/current*100)}%`;
}

function resetCamera() {
  const body=selected?byCode(selected):null,target=body?scenePosition(getPosition(body,jdNow(simDate)).p):new THREE.Vector3();
  const offset=new THREE.Vector3(.86,1.08,3.05);camera.position.copy(target).add(offset);controls.target.copy(target);controls.update();lastFocusPoint.copy(target);updateZoomLabel();
}

function updateSelectionRing() {
  const view=selected?views.get(selected):null;
  if(!view||!view.root.visible){selectionRing.visible=false;return;}
  const radius=view.radius*1.62,points=[];
  for(let n=0;n<96;n++){const angle=n/96*Math.PI*2;points.push(new THREE.Vector3(Math.cos(angle)*radius,radius*.08,Math.sin(angle)*radius));}
  selectionRing.geometry.dispose();selectionRing.geometry.setFromPoints(points);selectionRing.position.copy(view.position);selectionRing.visible=true;
}

function animate() {
  const dt=Math.min(frameClock.getDelta(),.05);
  controls.update();
  const jd=jdNow(simDate),followBody=selected?byCode(selected):null;
  for(const [code,view] of views){
    if(!tracked.has(code))continue;
    const data=getPosition(view.body,jd),position=scenePosition(data.p);view.position.copy(position);view.root.position.copy(position);view.mesh.rotation.y+=dt*(view.body.code==='earth'?.055:.018);
    if(view.tail||view.tailInner){const direction=position.clone().normalize();const length=Math.max(.08,view.radius*5.5);for(const tail of [view.tail,view.tailInner]){if(!tail)continue;tail.scale.set(1,tail===view.tail?1:.76,1);tail.position.copy(direction).multiplyScalar(length*.48);tail.quaternion.setFromUnitVectors(vectorUp,direction);}}
    view.label.style.display=labelsVisible?'block':'none';
    if(labelsVisible){const projected=position.clone().project(camera),rect=canvas.getBoundingClientRect();const x=(projected.x*.5+.5)*rect.width,y=(-projected.y*.5+.5)*rect.height;view.label.style.transform=`translate(${x+view.radius*40}px,${y}px)`;view.label.classList.toggle('selected',code===selected);}
  }
  if(followBody){const current=views.get(followBody.code)?.position;if(current){const delta=current.clone().sub(lastFocusPoint);if(delta.lengthSq()>1e-12){controls.target.add(delta);camera.position.add(delta);lastFocusPoint.copy(current);}}}
  updateSelectionRing();renderer.render(scene,camera);
}

function toast(message) {
  let element=document.querySelector('.toast');if(!element){element=document.createElement('div');element.className='toast';document.body.append(element);}
  element.textContent=message;element.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>element.classList.remove('show'),2200);
}

function pointerToNdc(event) {
  const rect=canvas.getBoundingClientRect();pointer.x=((event.clientX-rect.left)/rect.width)*2-1;pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
}

function bindUi() {
  document.querySelector('#track-button').addEventListener('click',()=>{
    if(!selected){toast('The Sun is always in view');return;}
    if(tracked.has(selected)){toast('Already in your tracking list');return;}
    tracked.add(selected);const view=views.get(selected);if(view){view.root.visible=true;view.orbit.visible=true;}
    render();toast(`${byCode(selected).name} added to tracking`);
  });
  document.querySelectorAll('.view-btn').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.view-btn').forEach(other=>other.classList.toggle('active',other===button));labelsVisible=button.dataset.mode==='labels';render();}));
  document.querySelector('#open-search').addEventListener('click',()=>{document.querySelector('#search-form').classList.add('open');document.querySelector('#object-search').focus();});
  document.querySelector('#close-search').addEventListener('click',()=>{document.querySelector('#search-form').classList.remove('open');document.querySelector('#object-search').value='';document.querySelector('#search-hint').textContent='SEARCH JPL SMALL-BODY DATABASE';});
  document.querySelector('#search-form').addEventListener('submit',lookupObject);
  document.querySelector('#object-search').addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelector('#close-search').click();});
  document.querySelector('#zoom-reset').addEventListener('click',resetCamera);
  canvas.addEventListener('click',event=>{
    pointerToNdc(event);raycaster.setFromCamera(pointer,camera);
    const targets=[...views.values()].filter(view=>tracked.has(view.body.code)).map(view=>view.mesh);
    const hit=raycaster.intersectObjects(targets,false)[0];selectBody(hit?.object.userData.code||'sun');
  });
  canvas.addEventListener('dblclick',event=>{event.preventDefault();pointerToNdc(event);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects([...views.values()].map(view=>view.mesh),false)[0];if(hit)selectBody(hit.object.userData.code);});
  document.addEventListener('keydown',event=>{
    if(event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement)return;
    if(event.key==='Home'||event.key.toLowerCase()==='r'){event.preventDefault();resetCamera();}
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
      event.preventDefault();const list=[...tracked].map(byCode).filter(Boolean);if(!list.length)return;const index=list.findIndex(body=>body.code===selected);const step=event.key==='ArrowRight'?1:-1;const next=list[(index<0?(step>0?0:list.length-1):(index+step+list.length)%list.length)];selectBody(next.code);
    }
  });
  window.addEventListener('resize',resizeRenderer);
}

async function lookupObject(event) {
  event.preventDefault();const input=document.querySelector('#object-search'),hint=document.querySelector('#search-hint'),query=input.value.trim();if(!query)return;
  const known=[...bodyData,...customObjects.values()].find(body=>body.name.toLowerCase()===query.toLowerCase()||body.code.toLowerCase()===query.toLowerCase());
  if(known){tracked.add(known.code);if(!views.has(known.code)){const view=addBodyView(known);updateOrbit(view,jdNow(simDate));}selectBody(known.code);hint.textContent=`${known.name.toUpperCase()} ADDED`;input.value='';return;}
  hint.textContent='QUERYING JPL SBDB…';
  try{
    const url=new URL('https://ssd-api.jpl.nasa.gov/sbdb.api');url.searchParams.set('sstr',query);url.searchParams.set('full-prec','true');
    const response=await fetch(url);if(!response.ok)throw new Error('JPL request failed');const data=await response.json();if(data.error)throw new Error(data.error);if(data.list)throw new Error('Multiple matches. Try a numbered designation, like 433.');
    const orbit=Object.fromEntries((data.orbit?.elements||[]).map(item=>[item.name,Number(item.value)]));
    if(!Number.isFinite(orbit.e)||!Number.isFinite(orbit.i)||!Number.isFinite(orbit.om)||!Number.isFinite(orbit.w))throw new Error('JPL did not return enough orbital elements.');
    const body={code:`sbdb-${data.object.spkid||data.object.des}`,name:data.object.fullname||data.object.name||data.object.des,type:data.object.kind?.toUpperCase()||'SMALL BODY',kind:'small-body',color:'#b8d2e8',radius:4,fact:'Approximate osculating orbit from JPL Small-Body Database.',elements:{e:orbit.e,i:orbit.i,node:orbit.om,w:orbit.w,a:orbit.a,q:orbit.q,tp:orbit.tp,epoch:Number(data.orbit.epoch),ma:orbit.ma,n:orbit.n}};
    if(!Number.isFinite(body.elements.epoch))throw new Error('JPL did not return an orbit epoch.');
    customObjects.set(body.code,body);tracked.add(body.code);const view=addBodyView(body);updateOrbit(view,jdNow(simDate));selectBody(body.code);input.value='';hint.textContent='JPL ORBIT DATA LOADED';
  }catch(error){hint.textContent=String(error.message||'Lookup failed').toLowerCase().includes('fetch')?'JPL LOOKUP UNAVAILABLE — CHECK CONNECTION':String(error.message||'No match found').toUpperCase();}
}

function tickSimulation() {
  simDate=new Date();const jd=jdNow(simDate);positions.clear();
  for(const body of [...bodyData,...customObjects.values()])if(tracked.has(body.code))positions.set(body.code,getPosition(body,jd));
  for(const view of views.values())if(tracked.has(view.body.code))updateOrbit(view,jd);
  updateClock();render();
}

function showWebGlError(error) {
  const box=document.createElement('div');box.className='webgl-error';box.textContent=error;orbitStage.append(box);
}

try {
  initializeScene();bindUi();updateClock();render();updateZoomLabel();
  setInterval(tickSimulation,1000);
} catch(error) {
  console.error(error);showWebGlError('This browser could not start WebGL 2. Try a recent version of Chrome, Edge, or Firefox with hardware acceleration enabled.');
}
