export interface IPhysics {
  init(): Promise<void>;
  clear(): void;
  clearMarbles(): void;
  createStage(entities: MapEntity[]): void;
  createMarble(id: number, x: number, y: number): void;
  shakeMarble(id: number): void;
  removeMarble(id: number): void;
  getMarblePosition(id: number): { x: number; y: number; angle: number };
  getEntities(): MapEntityState[];
  impact(id: number): void;
  start(): void;
  step(deltaSeconds: number): void;
}

export interface MapEntity {
  position: { x: number; y: number };
  shape: {
    type: 'box' | 'circle' | 'polyline';
    width?: number;
    height?: number;
    radius?: number;
    points?: number[][];
    rotation?: number;
    color?: string;
    bloomColor?: string;
  };
  type: 'static' | 'kinematic';
  props: {
    density: number;
    angularVelocity: number;
    restitution: number;
    life?: number;
  };
}

export interface MapEntityState {
  x: number;
  y: number;
  angle: number;
  shape: MapEntity['shape'];
  life?: number;
}

