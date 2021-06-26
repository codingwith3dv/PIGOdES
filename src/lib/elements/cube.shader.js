export let source = {
  vertexSource: `#version 300 es
      layout(location = 0) in vec3 a_position;
      layout(location = 1) in float a_op;
      uniform mat4 u_model;
      uniform mat4 u_view;
      uniform mat4 u_proj;
      out vec4 v_color;
      
      void main(void) {
        gl_Position = u_proj * u_view * u_model * vec4(a_position, 1.0);
        v_color = vec4(0.2, 0.6, 0.8, a_op);
      }
      `,
  fragmentSource: `#version 300 es
    precision highp float;
      in vec4 v_color;
      out vec4 color;
      void main(void) {
        color = v_color;
      }
      `
};