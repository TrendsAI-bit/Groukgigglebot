declare module 'ogl' {
  export class Renderer {
    constructor(options?: any);
    gl: WebGLRenderingContext;
    setSize(width: number, height: number): void;
    render(options: any): void;
  }

  export class Program {
    constructor(gl: WebGLRenderingContext, options: any);
    uniforms: any;
  }

  export class Mesh {
    constructor(gl: WebGLRenderingContext, options: any);
  }

  export class Color {
    constructor(r: number, g: number, b: number);
    value: Float32Array;
  }

  export class Triangle {
    constructor(gl: WebGLRenderingContext);
  }
}
