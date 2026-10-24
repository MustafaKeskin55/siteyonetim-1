"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeHeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getIsDark = () => document.documentElement.classList.contains("dark");
    let isDark = getIsDark();

    // Fast scene setup
    const scene = new THREE.Scene();
    const fogColor = isDark ? 0x070b14 : 0xf8fafc;
    scene.fog = new THREE.FogExp2(fogColor, 0.035);

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80);
    camera.position.set(8, 7, 10);
    camera.lookAt(0, 1.2, 0);

    // Fast, lightweight renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0); // Always fully transparent background
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Grid Helper
    const grid = new THREE.GridHelper(24, 24, isDark ? 0x06b6d4 : 0x0284c7, isDark ? 0x1e293b : 0xe2e8f0);
    grid.position.y = -0.01;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = isDark ? 0.35 : 0.45;
    scene.add(grid);

    // Dynamic Materials
    const buildingMat = new THREE.MeshLambertMaterial({
      color: isDark ? 0x111c30 : 0xe2e8f0,
      transparent: true,
      opacity: isDark ? 0.9 : 0.85,
    });

    const accentMat = new THREE.MeshLambertMaterial({
      color: isDark ? 0x0e7490 : 0x38bdf8,
      transparent: true,
      opacity: 0.95,
    });

    const edgeMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x22d3ee : 0x0284c7,
      transparent: true,
      opacity: 0.75,
    });

    const glowMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0xf43f5e,
    });

    // Isometric residential blocks
    const buildings = [
      { x: 0, z: 0, w: 2.0, d: 2.0, h: 4.8, accent: true },
      { x: -2.4, z: -0.6, w: 1.6, d: 1.6, h: 3.4, accent: false },
      { x: 2.4, z: -0.4, w: 1.5, d: 1.7, h: 3.8, accent: false },
      { x: -1.6, z: 2.0, w: 1.4, d: 1.4, h: 2.5, accent: false },
      { x: 1.6, z: 2.0, w: 1.5, d: 1.4, h: 2.8, accent: false },
      { x: 0, z: 2.8, w: 1.2, d: 1.2, h: 1.8, accent: false },
    ];

    buildings.forEach((b) => {
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const mesh = new THREE.Mesh(geo, b.accent ? accentMat : buildingMat);
      mesh.position.set(b.x, b.h / 2, b.z);

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
      mesh.add(edges);

      // Floor lights
      const floorCount = Math.floor(b.h / 0.9);
      for (let f = 1; f < floorCount; f++) {
        const lightGeo = new THREE.BoxGeometry(b.w * 0.75, 0.06, b.d * 0.75);
        const lightMesh = new THREE.Mesh(lightGeo, glowMat);
        lightMesh.position.y = f * 0.9 - b.h / 2;
        mesh.add(lightMesh);
      }

      group.add(mesh);
    });

    // Particles
    const particleCount = 28;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 1] = Math.random() * 5 + 0.5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      size: 0.16,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(pGeo, pMat);
    group.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.5 : 2.0);
    scene.add(ambientLight);
    const dir = new THREE.DirectionalLight(isDark ? 0x38bdf8 : 0x0284c7, 2);
    dir.position.set(8, 15, 10);
    scene.add(dir);

    // Theme Change Observer
    const updateThemeColors = () => {
      const currentDark = getIsDark();
      if (currentDark === isDark) return;
      isDark = currentDark;

      scene.fog = new THREE.FogExp2(isDark ? 0x070b14 : 0xf8fafc, 0.035);
      buildingMat.color.setHex(isDark ? 0x111c30 : 0xe2e8f0);
      buildingMat.opacity = isDark ? 0.9 : 0.85;
      accentMat.color.setHex(isDark ? 0x0e7490 : 0x38bdf8);
      edgeMat.color.setHex(isDark ? 0x22d3ee : 0x0284c7);
      glowMat.color.setHex(isDark ? 0x38bdf8 : 0xf43f5e);
      pMat.color.setHex(isDark ? 0x38bdf8 : 0x0284c7);
      dir.color.setHex(isDark ? 0x38bdf8 : 0x0284c7);
      ambientLight.intensity = isDark ? 1.5 : 2.0;
    };

    const observer = new MutationObserver(updateThemeColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.35;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.2;
    };

    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      group.rotation.y = delta * 0.1 + mouseX;
      group.rotation.x = mouseY * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      pGeo.dispose();
      pMat.dispose();
      buildingMat.dispose();
      accentMat.dispose();
      edgeMat.dispose();
      glowMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing select-none"
    >
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-cyan-500/30 text-[11px] font-semibold text-slate-700 dark:text-cyan-300 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>3D Akıllı Komşuluk Ağı • Canlı</span>
      </div>
    </div>
  );
}
