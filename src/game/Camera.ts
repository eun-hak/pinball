import { VectorLike } from './types/VectorLike';
import { Marble } from './Marble';
import { initialZoom } from './constants';

export class Camera {
  private _position: VectorLike = { x: 0, y: 0 };
  private _targetPosition: VectorLike = { x: 0, y: 0 };
  private _zoom: number = 1;
  private _targetZoom: number = 1;
  private _locked = false;
  private _shouldFollowMarbles = false;

  get zoom() {
    return this._zoom;
  }
  set zoom(v: number) {
    this._targetZoom = v;
  }

  get x() {
    return this._position.x;
  }
  set x(v: number) {
    this._targetPosition.x = v;
  }
  get y() {
    return this._position.y;
  }
  set y(v: number) {
    this._targetPosition.y = v;
  }

  get position() {
    return this._position;
  }

  setPosition(v: VectorLike, force: boolean = false) {
    if (force) {
      return (this._position = { x: v.x, y: v.y });
    }
    return (this._targetPosition = { x: v.x, y: v.y });
  }

  lock(v: boolean) {
    this._locked = v;
  }

  startFollowingMarbles() {
    this._shouldFollowMarbles = true;
  }

  initializePosition() {
    // Race 게임: 시작선 중심
    this._position = { x: 0, y: 0 };
    this._targetPosition = { x: 0, y: 0 };
    this._shouldFollowMarbles = false;
  }

  update({
    marbles,
    finishLineY,
    needToZoom,
    targetIndex,
  }: {
    marbles: Marble[];
    finishLineY: number;
    needToZoom: boolean;
    targetIndex: number;
  }) {
    // set target position
    if (!this._locked) {
      this._calcTargetPositionAndZoom(marbles, finishLineY, needToZoom, targetIndex);
    }

    // interpolate position
    this._position.x = this._interpolation(this.x, this._targetPosition.x);
    this._position.y = this._interpolation(this.y, this._targetPosition.y);

    // interpolate zoom
    this._zoom = this._interpolation(this._zoom, this._targetZoom);
  }

  private _calcTargetPositionAndZoom(
    marbles: Marble[],
    finishLineY: number,
    needToZoom: boolean,
    targetIndex: number
  ) {
    if (!this._shouldFollowMarbles) {
      return;
    }

    if (marbles.length > 0) {
      const targetMarble = marbles[targetIndex]
        ? marbles[targetIndex]
        : marbles[0];
      // Race: Y축(수직) 추적, X는 중심 유지
      this.setPosition({ x: 0, y: targetMarble.y });
      if (needToZoom) {
        const goalDist = Math.abs(finishLineY - this._position.y);
        this.zoom = Math.max(1, (1 - goalDist / 50) * 2);
      } else {
        this.zoom = 1;
      }
    } else {
      this.zoom = 1;
    }
  }

  private _interpolation(current: number, target: number) {
    const d = target - current;
    if (Math.abs(d) < 1 / initialZoom) {
      return target;
    }
    return current + d / 10;
  }

  renderScene(
    ctx: CanvasRenderingContext2D,
    callback: (ctx: CanvasRenderingContext2D) => void
  ) {
    const zoomFactor = initialZoom * 2 * this._zoom;
    ctx.save();
    ctx.translate(-this.x * this._zoom, -this.y * this._zoom);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(
      ctx.canvas.width / zoomFactor,
      ctx.canvas.height / zoomFactor
    );
    callback(ctx);
    ctx.restore();
  }
}

