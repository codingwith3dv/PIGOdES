export let source = {
  vertexSource: `#version 300 es
      layout(location = 0) in float base_angle;
      layout(location = 1) in float offsetX;
      layout(location = 2) in float offsetZ;
      
      uniform mat4 u_model;
      uniform mat4 u_view;
      uniform mat4 u_proj;
      
      out vec2 offset;
      
      void main(void) {
        vec3 p;
        offset = vec2(offsetX, offsetZ);
        p.x = (50.0 + offsetX) * cos(base_angle);
        p.z = (50.0 + offsetZ) * sin(base_angle);
        p.y += (50.0 + offsetX / 1.0) * cos(base_angle);
      
        gl_Position = u_proj * u_view * u_model * vec4(p, 1.0);
        gl_PointSize = 3.0;
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