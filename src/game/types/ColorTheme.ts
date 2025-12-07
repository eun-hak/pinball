export interface ColorTheme {
  background: string;
  marbleLightness: number;
  marbleWinningBorder: string;
  skillColor: string;
  coolTimeIndicator: string;
  entity: {
    box: {
      fill: string;
      outline: string;
      bloom: string;
      bloomRadius: number;
    };
    circle: {
      fill: string;
      outline: string;
      bloom: string;
      bloomRadius: number;
    };
    polyline: {
      fill: string;
      outline: string;
      bloom: string;
      bloomRadius: number;
    };
  };
  rankStroke: string;
  minimapBackground: string;
  minimapViewport: string;
  winnerBackground: string;
  winnerOutline: string;
  winnerText: string;
}

