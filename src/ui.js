export class UI {
  constructor(player) {
    this.player = player;

    // Create container
    this.hud = document.createElement('div');
    this.hud.style.position = 'absolute';
    this.hud.style.left = '20px';
    this.hud.style.bottom = '20px';
    this.hud.style.width = '250px';
    this.hud.style.fontFamily = 'sans-serif';
    this.hud.style.color = '#fff';
    this.hud.style.textShadow = '0 0 5px black';
    document.body.appendChild(this.hud);

    // Health bar
    this.hpBar = document.createElement('div');
    this.hpBar.style.height = '20px';
    this.hpBar.style.background = 'red';
    this.hpBar.style.marginBottom = '6px';
    this.hpBarFill = document.createElement('div');
    this.hpBarFill.style.height = '100%';
    this.hpBarFill.style.background = 'lime';
    this.hpBarFill.style.width = '100%';
    this.hpBar.appendChild(this.hpBarFill);
    this.hud.appendChild(this.hpBar);

    // Stamina bar
    this.stamBar = document.createElement('div');
    this.stamBar.style.height = '14px';
    this.stamBar.style.background = 'gray';
    this.stamBarFill = document.createElement('div');
    this.stamBarFill.style.height = '100%';
    this.stamBarFill.style.background = 'yellow';
    this.stamBarFill.style.width = '100%';
    this.stamBar.appendChild(this.stamBarFill);
    this.hud.appendChild(this.stamBar);
  }

  update() {
    // Update health bar
    const hpPct = (this.player.health / this.player.maxHealth) * 100;
    this.hpBarFill.style.width = `${hpPct}%`;

    // Update stamina bar
    const stamPct = (this.player.stamina / this.player.maxStamina) * 100;
    this.stamBarFill.style.width = `${stamPct}%`;
  }
}
