export class Enemy {
  constructor(scene, position) {
    // Enemy capsule
    const body = BABYLON.MeshBuilder.CreateCapsule('enemy', { height: 1.8, radius: 0.4 }, scene);
    body.position.copyFrom(position);
    body.material = new BABYLON.StandardMaterial('em', scene);
    body.material.diffuseColor = new BABYLON.Color3(0.9, 0.2, 0.2);

    // Physics
    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.CapsuleImpostor,
      { mass: 80, friction: 0.6, restitution: 0.0 },
      scene
    );

    this.mesh = body;
    this.health = 60;
    this.maxHealth = 60;
    this.speed = 5;
    this.aggroRange = 15;
    this.attackRange = 2.0;
    this.attackCooldown = 0;
    this.dead = false;
  }

  update(dt, player) {
    if (this.dead) return;

    const toPlayer = player.mesh.position.subtract(this.mesh.position);
    const dist = toPlayer.length();

    const v = this.mesh.physicsImpostor.getLinearVelocity() || BABYLON.Vector3.Zero();

    if (dist < this.aggroRange) {
      // Move toward player
      toPlayer.y = 0;
      toPlayer.normalize();
      v.x = toPlayer.x * this.speed;
      v.z = toPlayer.z * this.speed;
      this.mesh.physicsImpostor.setLinearVelocity(v);

      // Face player
      const yaw = Math.atan2(toPlayer.x, toPlayer.z);
      this.mesh.rotation.y = yaw;

      // Attack
      if (dist < this.attackRange) {
        if (this.attackCooldown <= 0) {
          this.attackCooldown = 1.2; // seconds
          player.health = Math.max(0, player.health - 10);
        }
      }
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }
  }

  onHit(dmg) {
    if (this.dead) return;
    this.health -= dmg;
    if (this.health <= 0) {
      this.dead = true;
      this.mesh.dispose();
    }
  }
}
