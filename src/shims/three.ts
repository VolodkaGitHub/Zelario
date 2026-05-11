const Mock = class {
  constructor(..._args: unknown[]) {}
  dispose() {}
  setAttribute() {}
  setSize() {}
  setPixelRatio() {}
  render() {}
  add() {}
  position = { set: () => undefined, x: 0, y: 0, z: 0 };
  rotation = { x: 0, y: 0, z: 0 };
};

export class Color {
  constructor(_hex?: number) {}
}

export class Vector3 {
  x = 0;
  y = 0;
  z = 0;
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class WebGLRenderer extends Mock {}
export class Scene extends Mock {}
export class PerspectiveCamera extends Mock {}
export class BufferGeometry extends Mock {}
export class BufferAttribute extends Mock {}
export class Points extends Mock {}
export class PointsMaterial extends Mock {}
export class Group extends Mock {}
export class Mesh extends Mock {}
export class CylinderGeometry extends Mock {}
export class MeshStandardMaterial extends Mock {}
export class TorusGeometry extends Mock {}
export class MeshBasicMaterial extends Mock {}
export class OctahedronGeometry extends Mock {}
export class MeshPhongMaterial extends Mock {}
export class IcosahedronGeometry extends Mock {}
export class PointLight extends Mock {}
export class AmbientLight extends Mock {}

const THREE = {
  Color,
  Vector3,
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  Group,
  Mesh,
  CylinderGeometry,
  MeshStandardMaterial,
  TorusGeometry,
  MeshBasicMaterial,
  OctahedronGeometry,
  MeshPhongMaterial,
  IcosahedronGeometry,
  PointLight,
  AmbientLight,
};

export default THREE;
