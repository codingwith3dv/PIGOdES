export let source = {
  vertexSource: `#version 300 es
      layout(location = 0) in vec3 a_position;
      layout(location = 1) in vec2 a_texCoords;
      
      uniform mat4 u_model;
      uniform mat4 u_view;
      uniform mat4 u_proj;
      
      out vec2 v_texCoords;
      
      void main(void) {
        gl_Position = u_proj * u_view * u_model * vec4(a_position, 1.0);
        v_texCoords = a_texCoords;
      }
      `,
  fragmentSource: `#version 300 es
    precision highp float;
      in vec2 v_texCoords;
      uniform sampler2D u_image;
      
      out vec4 color;
      void main(void) {
        color = texture(u_image, v_texCoords);
      }
      `
};