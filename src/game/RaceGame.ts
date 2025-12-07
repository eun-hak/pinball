import { Marble } from './Marble';
import { Box2dPhysics } from './physics/Box2dPhysics';
import { IPhysics, MapEntity } from './types/IPhysics';
import { Camera } from './Camera';
import { parseName, shuffle } from './utils/utils';
import { Skills } from './constants';
import { ColorTheme, Themes } from './constants';

export interface RaceGameOptions {
  useSkills?: boolean;
  theme?: keyof typeof Themes;
}

export class RaceGame extends EventTarget {
  private physics!: IPhysics;
  private marbles: Marble[] = [];
  private winners: Marble[] = [];
  private camera: Camera = new Camera();
  private isRunning: boolean = false;
  private winnerRank: number = 0;
  private totalMarbleCount: number = 0;
  private finishLineY: number = 0;
  private options: RaceGameOptions;
  private theme: ColorTheme = Themes.dark;

  private lastTime: number = 0;
  private elapsed: number = 0;
  private updateInterval = 10;
  private timeScale = 1;
  private speed = 1;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private entities: MapEntity[] = [];

  constructor(canvas: HTMLCanvasElement, options: RaceGameOptions = {}) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.options = options;
    this.theme = Themes[options.theme || 'dark'];
  }

  async init() {
    this.physics = new Box2dPhysics();
    await this.physics.init();
    this.camera.initializePosition();
  }

  setFinishLine(y: number) {
    this.finishLineY = y;
  }

  setEntities(entities: MapEntity[]) {
    this.entities = entities;
    this.physics.clear();
    this.physics.createStage(entities);
  }

  setMarbles(names: string[], startX: number, startY: number, spacing: number) {
    this.reset();

    let maxWeight = -Infinity;
    let minWeight = Infinity;

    const members = names
      .map((nameString) => {
        const result = parseName(nameString);
        if (!result) return null;
        const { name, weight, count } = result;
        if (weight > maxWeight) maxWeight = weight;
        if (weight < minWeight) minWeight = weight;
        return { name, weight, count };
      })
      .filter((member) => !!member);

    const gap = maxWeight - minWeight;

    let totalCount = 0;
    members.forEach((member) => {
      if (member) {
        member.weight = 0.1 + (gap ? (member.weight - minWeight) / gap : 0);
        totalCount += member.count;
      }
    });

    const orders = shuffle(
      Array(totalCount)
        .fill(0)
        .map((_, i) => i),
    );

    this.marbles = [];
    let orderIndex = 0;
    members.forEach((member) => {
      if (member) {
        for (let j = 0; j < member.count; j++) {
          const order = orders.pop() || 0;
          // Race: 시작선에 일렬 배치
          this.physics.createMarble(
            orderIndex,
            startX + orderIndex * spacing,
            startY,
          );
          const marble = new Marble(
            this.physics,
            orderIndex,
            totalCount,
            member.name,
            member.weight,
          );
          this.marbles.push(marble);
          orderIndex++;
        }
      }
    });
    this.totalMarbleCount = totalCount;
  }

  start() {
    this.isRunning = true;
    this.winnerRank = 0; // 첫 번째 도착자
    this.camera.startFollowingMarbles();
    this.physics.start();
    this.marbles.forEach((marble) => (marble.isActive = true));
    this.update();
  }

  reset() {
    this.physics.clearMarbles();
    this.winners = [];
    this.marbles = [];
    this.isRunning = false;
    this.camera.initializePosition();
  }

  private update() {
    if (!this.lastTime) this.lastTime = Date.now();
    const currentTime = Date.now();

    this.elapsed += (currentTime - this.lastTime) * this.speed;
    if (this.elapsed > 100) {
      this.elapsed %= 100;
    }
    this.lastTime = currentTime;

    const interval = (this.updateInterval / 1000) * this.timeScale;

    while (this.elapsed >= this.updateInterval) {
      this.physics.step(interval);
      this.updateMarbles(this.updateInterval);
      this.elapsed -= this.updateInterval;
    }

    // Y축 기준 정렬 (낮은 Y가 앞서감)
    if (this.marbles.length > 1) {
      this.marbles.sort((a, b) => a.y - b.y);
    }

    this.camera.update({
      marbles: this.marbles,
      finishLineY: this.finishLineY,
      needToZoom: false,
      targetIndex: this.winners.length > 0 ? this.winnerRank - this.winners.length : 0,
    });

    this.render();
    
    if (this.isRunning || this.marbles.length > 0) {
      requestAnimationFrame(() => this.update());
    }
  }

  private updateMarbles(deltaTime: number) {
    for (let i = 0; i < this.marbles.length; i++) {
      const marble = this.marbles[i];
      marble.update(deltaTime, this.options.useSkills || false);
      
      if (marble.skill === Skills.Impact) {
        this.physics.impact(marble.id);
      }
      
      // 결승선 도착 체크
      if (marble.y >= this.finishLineY && !this.winners.find(w => w.id === marble.id)) {
        this.winners.push(marble);
        if (this.isRunning && this.winners.length === this.winnerRank + 1) {
          this.dispatchEvent(
            new CustomEvent('goal', { detail: { winner: marble.name } }),
          );
          this.isRunning = false;
        }
        setTimeout(() => {
          this.physics.removeMarble(marble.id);
        }, 500);
      }
    }

    this.marbles = this.marbles.filter(
      (marble) => marble.y < this.finishLineY,
    );
  }

  private render() {
    this.ctx.fillStyle = this.theme.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.scale(30, 30);
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.font = '0.4pt sans-serif';
    this.ctx.lineWidth = 3 / (this.camera.zoom + 30);
    
    this.camera.renderScene(this.ctx, () => {
      this.renderEntities();
      this.renderMarbles();
    });
    
    this.ctx.restore();
    this.renderWinner();
  }

  private renderEntities() {
    const entities = this.physics.getEntities();
    this.ctx.save();
    entities.forEach((entity) => {
      const transform = this.ctx.getTransform();
      this.ctx.translate(entity.x, entity.y);
      this.ctx.rotate(entity.angle);
      this.ctx.fillStyle = entity.shape.color ?? this.theme.entity[entity.shape.type].fill;
      this.ctx.strokeStyle = entity.shape.color ?? this.theme.entity[entity.shape.type].outline;
      this.ctx.shadowBlur = this.theme.entity[entity.shape.type].bloomRadius;
      this.ctx.shadowColor = entity.shape.bloomColor ?? entity.shape.color ?? this.theme.entity[entity.shape.type].bloom;
      
      const shape = entity.shape;
      switch (shape.type) {
        case 'polyline':
          if (shape.points && shape.points.length > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(shape.points[0][0], shape.points[0][1]);
            for (let i = 1; i < shape.points.length; i++) {
              this.ctx.lineTo(shape.points[i][0], shape.points[i][1]);
            }
            this.ctx.stroke();
          }
          break;
        case 'box':
          const w = shape.width! * 2;
          const h = shape.height! * 2;
          this.ctx.rotate(shape.rotation || 0);
          this.ctx.fillRect(-w / 2, -h / 2, w, h);
          this.ctx.strokeRect(-w / 2, -h / 2, w, h);
          break;
        case 'circle':
          this.ctx.beginPath();
          this.ctx.arc(0, 0, shape.radius!, 0, Math.PI * 2, false);
          this.ctx.stroke();
          break;
      }
      this.ctx.setTransform(transform);
    });
    this.ctx.restore();
  }

  private renderMarbles() {
    const winnerIndex = this.winnerRank - this.winners.length;
    this.marbles.forEach((marble, i) => {
      marble.render(
        this.ctx,
        this.camera.zoom * 30,
        i === winnerIndex,
        this.theme,
      );
    });
  }

  private renderWinner() {
    const winner = this.winners[this.winnerRank];
    if (!winner) return;
    
    this.ctx.save();
    this.ctx.fillStyle = this.theme.winnerBackground;
    this.ctx.fillRect(
      this.canvas.width / 2,
      this.canvas.height - 168,
      this.canvas.width / 2,
      168,
    );
    this.ctx.fillStyle = this.theme.winnerText;
    this.ctx.strokeStyle = this.theme.winnerOutline;
    this.ctx.font = 'bold 48px sans-serif';
    this.ctx.textAlign = 'right';
    this.ctx.lineWidth = 4;
    if (this.theme.winnerOutline) {
      this.ctx.strokeText(
        'Winner',
        this.canvas.width - 10,
        this.canvas.height - 120,
      );
    }
    this.ctx.fillText(
      'Winner',
      this.canvas.width - 10,
      this.canvas.height - 120,
    );
    this.ctx.font = 'bold 72px sans-serif';
    this.ctx.fillStyle = `hsl(${winner.hue} 100% ${this.theme.marbleLightness}`;
    if (this.theme.winnerOutline) {
      this.ctx.strokeText(
        winner.name,
        this.canvas.width - 10,
        this.canvas.height - 55,
      );
    }
    this.ctx.fillText(
      winner.name,
      this.canvas.width - 10,
      this.canvas.height - 55,
    );
    this.ctx.restore();
  }

  getCount() {
    return this.marbles.length;
  }

  getWinners() {
    return this.winners;
  }
}

