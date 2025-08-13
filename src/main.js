import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { UI } from './ui.js';

window.addEventListener('DOMContentLoaded', async () => {
  // Load Babylon engine
  const canvas = document.getElementById('renderCanvas');
  const engine = new BABYLON.Engine(canvas, true);

  // Scene
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.6, 0.8, 1.0);

  // Light
  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene);
  light.intensity = 0.9;

  // Ground
  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 200, height: 200 }, scene);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 1 },
    scene
  );

  // Physics (Ammo.js)
  await Ammo();
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.AmmoJSPlugin());

  // Player
  const player = new Player(scene, canvas);

  // Enemies
  const enemies = [
    new Enemy(scene, new BABYLON.Vector3(5, 3, 5)),
    new Enemy(scene, new BABYLON.Vector3(-8, 3, -4))
  ];

  // UI
  const ui = new UI(player);

  // Game loop
  let lastTime = performance.now();
  engine.runRenderLoop(() => {
    const now = performance.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    player.update(dt);
    enemies.forEach(e => e.update(dt, player));
    ui.update();

    scene.render();
  });

  // Resize
  window.addEventListener('resize', () => {
    engine.resize();
  });
});
