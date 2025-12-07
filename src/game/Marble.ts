import { Skills, STUCK_DELAY, Themes } from './constants';
import { rad } from './utils/utils';
import { VectorLike } from './types/VectorLike';
import { Vector } from './utils/Vector';
import { IPhysics } from './types/IPhysics';
import { ColorTheme } from './types/ColorTheme';

export class Marble {
  type = 'marble' as const;
  name: string = '';
  size: number = 0.5;
  color: string = 'red';
  hue: number = 0;
  impact: number = 0;
  weight: number = 1;
  skill: Skills = Skills.None;
  isActive: boolean = false;

  private _skillRate = 0.0005;
  private _coolTime = 5000;
  private _maxCoolTime = 5000;
  private _stuckTime = 0;
  private lastPosition: VectorLike = { x: 0, y: 0 };
  private theme: ColorTheme = Themes.dark;

  private physics: IPhysics;
  id: number;

  get position() {
    return this.physics.getMarblePosition(this.id) || { x: 0, y: 0, angle: 0 };
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  get angle() {
    return this.position.angle;
  }

  constructor(
    physics: IPhysics,
    order: number,
    max: number,
    name?: string,
    weight: number = 1,
  ) {
    this.name = name || `M${order}`;
    this.weight = weight;
    this.physics = physics;

    this._maxCoolTime = 1000 + (1 - this.weight) * 4000;
    this._coolTime = this._maxCoolTime * Math.random();
    this._skillRate = 0.2 * this.weight;

    this.hue = (360 / max) * order;
    this.color = `hsl(${this.hue} 100% 70%)`;
    this.id = order;
  }

  update(deltaTime: number, useSkills: boolean = false) {
    if (
      this.isActive &&
      Vector.lenSq(Vector.sub(this.lastPosition, this.position)) < 0.00001
    ) {
      this._stuckTime += deltaTime;

      if (this._stuckTime > STUCK_DELAY) {
        this.physics.shakeMarble(this.id);
        this._stuckTime = 0;
      }
    } else {
      this._stuckTime = 0;
    }
    this.lastPosition = { x: this.position.x, y: this.position.y };

    this.skill = Skills.None;
    if (this.impact) {
      this.impact = Math.max(0, this.impact - deltaTime);
    }
    if (!this.isActive) return;
    if (useSkills) {
      this._updateSkillInformation(deltaTime);
    }
  }

  private _updateSkillInformation(deltaTime: number) {
    if (this._coolTime > 0) {
      this._coolTime -= deltaTime;
    }

    if (this._coolTime <= 0) {
      this.skill =
        Math.random() < this._skillRate ? Skills.Impact : Skills.None;
      this._coolTime = this._maxCoolTime;
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    zoom: number,
    outline: boolean,
    theme: ColorTheme,
  ) {
    this.theme = theme;
    const hs = this.size / 2;

    ctx.fillStyle = `hsl(${this.hue} 100% ${this.theme.marbleLightness + 25 * Math.min(1, this.impact / 500)}%`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, hs, 0, Math.PI * 2);
    ctx.fill();

    this._drawName(ctx, zoom);

    if (outline) {
      this._drawOutline(ctx, 2);
    }
  }

  private _drawName(ctx: CanvasRenderingContext2D, zoom: number) {
    const transform = ctx.getTransform();
    ctx.font = `12pt sans-serif`;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2 / zoom;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 0;
    ctx.translate(this.x, this.y + 0.25);
    ctx.scale(1 / zoom, 1 / zoom);
    ctx.strokeText(this.name, 0, 0);
    ctx.fillText(this.name, 0, 0);
    ctx.setTransform(transform);
  }

  private _drawOutline(ctx: CanvasRenderingContext2D, lineWidth: number) {
    ctx.beginPath();
    ctx.strokeStyle = this.theme.marbleWinningBorder;
    ctx.lineWidth = lineWidth;
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.stroke();
  }
}

