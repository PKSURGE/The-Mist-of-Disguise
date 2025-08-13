import { Input } from './input.js';

export class Player {
  constructor(scene, canvas) {
    this.scene = scene;
    this.speed = 7.5;          // m/s
    this.sprintMult = 1.6;
    this.turnSpeed = 0.006;
    this.jumpForce = 12;
    this.stamina = 100;
    this.maxStamina = 100;
    this.health = 100;
    this.maxHealth = 100;

    this.input = new Input(canvas);

    // Player capsule mesh
    const body = BABYLON.MeshBuilder.CreateCapsule('player', { height: 1.8, radius: 0.35 }, scene);
    body.position.set(0, 3, 0);
    this.mesh = body;

    // Physics impostor (dynamic)
    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.CapsuleImpostor,
      { mass: 80, friction: 0.6, restitution: 0.0 },
      scene
    );

    // Third-person follow camera
    const cam = new BABYLON.FollowCamera('tpcam', new BABYLON.Vector3(0, 2, -6), scene);
    cam.radius = 6;
    cam.heightOffset = 2.2;
    cam.rotationOffset = 0;
    cam.attachControl(canvas, true);
    cam.lockedTarget = body;
    cam.maxCameraSpeed = 16;
    this.camera = cam;

    // Attack collider (placeholder)
    const hit = BABYLON.MeshBuilder.CreateBox('hitbox', { width: 0.6, height: 1.0, depth: 1.2 }, scene);
    hit.isVisible = false;
    hit.isPickable = false;
    hit.parent = body;
    hit.position.z = 1.0;
    this.hitbox = hit;

    this.attackCooldown = 0;
    this.isAttacking = false;
  }

  update(dt) {
    const down = this.input.down;
    const { dx } = this.input.consumeMouse();

    // Rotate player horizontally with mouse
    if (dx) {
      this.mesh.rotate(BABYLON.Axis.Y, -dx * this.turnSpeed, BABYLON.Space.LOCAL);
    }

    // Movement input
    let moveZ = (down('KeyW') ? 1 : 0) + (down('KeyS') ? -1 : 0);
    let moveX = (down('KeyD') ? 1 : 0) + (down('KeyA') ? -1 : 0);

    const sprinting = down('ShiftLeft') || down('ShiftRight');
    const moveLen = Math.hypot(moveX, moveZ);
    if (moveLen > 0) {
      moveX /= moveLen;
      moveZ /= moveLen;
    }

    // Calculate movement direction relative to player rotation
    const forward = new BABYLON.Vector3(0, 0, 1);
    forward.rotateByQuaternionToRef(
      this.mesh.rotationQuaternion || BABYLON.Quaternion.RotationYawPitchRoll(this.mesh.rotation.y, 0, 0),
      forward
    );
    forward.y = 0;
    forward.normalize();

    const right = new BABYLON.Vector3(1, 0, 0);
    right.rotateByQuaternionToRef(
      this.mesh.rotationQuaternion || BABYLON.Quaternion.RotationYawPitchRoll(this.mesh.rotation.y, 0, 0),
      right
    );
    right.y = 0;
    right.normalize();

    let desired = forward.scale(moveZ).addInPlace(right.scale(moveX));
    if (desired.lengthSquared() > 0) desired.normalize();

    let speed = this.speed * (sprinting ? this.sprintMult : 1);

    // Stamina drain/recovery
    if (sprinting && this.stamina > 0 && desired.lengthSquared() > 0) {
      this.stamina = Math.max(0, this.stamina - 20 * dt);
    } else {
      this.stamina = Math.min(this.maxStamina, this.stamina + 10 * dt);
    }

    // Apply velocity
    const impostor = this.mesh.physicsImpostor;
    const v = impostor.getLinearVelocity() || BABYLON.Vector3.Zero();
    v.x = desired.x * speed;
    v.z = desired.z * speed;

    // Jump
    if (down('Space')) {
      v.y = this.jumpForce;
    }

    impostor.setLinearVelocity(v);
  }
}
