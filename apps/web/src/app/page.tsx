'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 1000);
    camera.position.set(2.5, 2, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(5, 10, 7.5);
    scene.add(dir);
    scene.add(new THREE.GridHelper(10, 20));

    const loader = new GLTFLoader();
    loader.load('/models/sample.glb', (gltf) => scene.add(gltf.scene));

    // mini-orbit
    let down = false, sx = 0, sy = 0, az = 0, elv = 0;
    const downH = (e: MouseEvent) => { down = true; sx = e.clientX; sy = e.clientY; };
    const moveH = (e: MouseEvent) => {
      if (!down) return;
      az += (e.clientX - sx) * 0.005; elv += (e.clientY - sy) * 0.005; sx = e.clientX; sy = e.clientY;
      const r = 5, y = 2 + elv, x = r * Math.sin(az), z = r * Math.cos(az);
      camera.position.set(x, y, z); camera.lookAt(0, 0, 0);
    };
    const upH = () => { down = false; };
    renderer.domElement.addEventListener('mousedown', downH);
    window.addEventListener('mousemove', moveH);
    window.addEventListener('mouseup', upH);

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let id = 0;
    const loop = () => { renderer.render(scene, camera); id = requestAnimationFrame(loop); };
    loop();

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', moveH);
      window.removeEventListener('mouseup', upH);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <main className="h-screen w-screen"><div ref={containerRef} className="h-full w-full" /></main>;
}

