import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-vista-3d',
  standalone: true,
  template: `<div #caja class="visor"></div>`,
  styles: [`.visor { width: 100vw; height: 100vh; background: #000; }`]
})
export class Vista3dComponent implements OnInit {
  @ViewChild('caja', { static: true }) caja!: ElementRef;

  ngOnInit() {
    const esc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cam.position.set(0, 0, 0.1);

    const ren = new THREE.WebGLRenderer({ antialias: true });
    ren.setSize(window.innerWidth, window.innerHeight);
    this.caja.nativeElement.appendChild(ren.domElement);

    const con = new OrbitControls(cam, ren.domElement);
    con.enableZoom = false;
    con.rotateSpeed = -0.5;

    const texLoa = new THREE.TextureLoader();
    // Configuramos el cargador para permitir imágenes de otros dominios
    texLoa.setCrossOrigin('anonymous');

    // LINK DIRECTO DE THREE.JS (Evita errores de pantalla negra)
    const urlPaisaje = 'https://threejs.org/examples/textures/2294472375_b4a848c635_k.jpg';
    
    const fonTex = texLoa.load(urlPaisaje, 
      () => console.log('Imagen cargada con éxito'),
      undefined,
      (err) => console.error('Error cargando la imagen:', err)
    );

    const fon = new THREE.Mesh(
      new THREE.SphereGeometry(500, 60, 40).scale(-1, 1, 1), 
      new THREE.MeshBasicMaterial({ map: fonTex })
    );
    esc.add(fon);

    const mirMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const mir = new THREE.Mesh(new THREE.RingGeometry(0.005, 0.008, 32), mirMat);
    mir.position.z = -0.5;
    cam.add(mir);
    esc.add(cam);

    const gTex = (t: string, i: string) => {
      const c = document.createElement('canvas');
      c.width = 400; c.height = 100;
      const x = c.getContext('2d')!;
      x.fillStyle = 'rgba(0,0,0,0.8)'; x.fillRect(0, 0, 400, 100);
      x.strokeStyle = '#00ffcc'; x.lineWidth = 5; x.strokeRect(0, 0, 400, 100);
      x.fillStyle = 'white'; x.font = 'bold 40px Arial'; x.fillText(`${i} ${t}`, 20, 65);
      return new THREE.CanvasTexture(c);
    };

    const m1 = new THREE.MeshBasicMaterial({ map: gTex('Usuario', '👤'), transparent: true });
    const m2 = new THREE.MeshBasicMaterial({ map: gTex('Contraseña', '🔒'), transparent: true });
    const c1 = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), m1);
    const c2 = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), m2);
    c1.position.set(0, 0.2, -2); c2.position.set(0, -0.2, -2);
    
    const grp = new THREE.Group();
    grp.add(c1, c2);
    esc.add(grp);

    const ray = new THREE.Raycaster();
    const mou = new THREE.Vector2(0, 0);

    const loop = () => {
      requestAnimationFrame(loop);
      ray.setFromCamera(mou, cam);
      const hits = ray.intersectObjects([c1, c2]);
      
      m1.color.set(0xffffff);
      m2.color.set(0xffffff);
      mir.scale.set(1, 1, 1);

      if (hits.length > 0) {
        const mat = (hits[0].object as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.color.set(0x00ffcc);
        mir.scale.set(1.5, 1.5, 1.5);
      }
      
      con.update();
      ren.render(esc, cam);
    };
    loop();

    window.addEventListener('resize', () => {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      ren.setSize(window.innerWidth, window.innerHeight);
    });
  }
}