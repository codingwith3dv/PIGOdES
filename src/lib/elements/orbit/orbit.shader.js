export let source = {
  vertexSource: `#version 300 es
      layout(location = 0) in vec3 a_position;
      
      uniform mat4 u_model;
      uniform mat4 u_view;
      uniform mat4 u_proj;
      
      void main(void) {
        gl_Position = u_proj * u_view * u_model * vec4(a_position, 1.0);
      }
      `,
  fragmentSource: `#version 300 es
    precision highp float;
      
      out vec4 color;
      void main(void) {
        color = vec4(1.0, 1.0, 1.0, 1.0);
      }
      `
};