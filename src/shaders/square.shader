#shader vertex
#version 330 es
in vec2 a_pos;
  void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}

#shader fragment
#version 330 es
precision highp float;
uniform vec4 u_Color;
out vec4 color;
void main() {
  color = u_Color;
}