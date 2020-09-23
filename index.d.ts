declare module 'polybooljs' {
  type Polygon = {
    regions: number[][][];
    inverted: boolean;
  }

  type Segment = {
    segments: Segment[],
    inverted: boolean;
  }

  type GeoJSON = {
    type: string;
    geopolys: Polygon[];
  }

  /**
   * Getter/setter for buildLog
   */
  export function buildLog(bl: boolean): object[] | boolean;

  /**
   * Getter/setter for epsilon
   */
  export function epsilon(value: number): number;

  export function segments(poly: Polygon): Segment;
  export function combine(segment1: Segment, segment2: Segment): {
    combined: object;
    inverted1: boolean;
    inverted2: boolean;
  };
  export function selectUnion(combined: object): Segment;
  export function selectIntersect(combined: object): Segment;
  export function selectDifference(combined: object): Segment;
  export function selectDifferenceRev(combined: object): Segment;
  export function selectXor(combined: object): Segment;
  export function polygon(segments: Segment): Polygon;
  export function polygonFromGeoJSON(geojson: GeoJSON): Polygon;
  export function polygonToGeoJSON(poly: Polygon): GeoJSON;
  export function union(poly1: Polygon, poly2: Polygon): Polygon;
  export function intersect(poly1: Polygon, poly2: Polygon): Polygon;
  export function difference(poly1: Polygon, poly2: Polygon): Polygon;
  export function differenceRev(poly1: Polygon, poly2: Polygon): Polygon;
  export function xor(poly1: Polygon, poly2: Polygon): Polygon;
}
