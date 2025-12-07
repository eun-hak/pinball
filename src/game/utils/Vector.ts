import { VectorLike } from '../types/VectorLike';

export class Vector {
  static sub(a: VectorLike, b: VectorLike): VectorLike {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  static lenSq(v: VectorLike): number {
    return v.x * v.x + v.y * v.y;
  }
}

