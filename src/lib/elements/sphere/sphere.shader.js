export let source = {
  vertexSource: `#version 300 es
      layout(location = 0) in vec3 a_position;
      layout(location = 1) in vec2 a_texCoords;
      layout(location = 2) in vec3 a_normals;
      
      uniform mat4 u_model;
      uniform mat4 u_view;
      uniform mat4 u_proj;
      
      out vec2 v_texCoords;
      out vec3 v_normalCoords;
      out vec3 v_pos;
      
      void main(void) {
        v_texCoords = a_texCoords;
        
        gl_Position = u_proj * u_view * u_model * vec4(a_position, 1.0);
      }
      `,
  fragmentSource: `#version 300 es
    precision highp float;
      in vec2 v_texCoords;
      in vec3 v_normalCoords;
      in vec3 v_pos;
      
      uniform sampler2D u_image;
      uniform vec3 viewPos;
      uniform bool isSun;
      
      out vec4 color;
      void main(void) {
        if(!isSun) {
          vec3 tex = texture(u_image, vec2(v_texCoords.x, 1.0 - v_texCoords.y)).rgb;
          vec3 ambient = tex * vec3(1.0, 1.0, 1.0);
          vec3 norm = normalize(v_normalCoords);
          
          vec3 lightDirection = normalize(vec3(0.0, 0.0, 0.0) - v_pos);
          float diff = max(dot(norm, lightDirection), 0.0);
          vec3 diffuse = vec3(0.9, 0.9, 0.9) * diff * tex;
          
          vec3 viewDir = normalize(viewPos - v_pos);
          vec3 reflectDir = reflect(-lightDirection, norm);
          float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
          vec3 specular = vec3(1.0, 1.0, 1.0) * (spec * vec3(0.0, 0.0, 0.0));
          
          float distance = length(vec3(0.0, 0.0, 0.0) - v_pos);
          float attenuation = 1.0 / (1.0 + 0.0007 * distance + 0.000002 * (distance * distance));
          
          vec3 result = (ambient + diffuse + specular) * attenuation;
          color.xyzw = vec4(result, 1.0);
        } else {
          color.xyzw = texture(u_image, vec2(v_texCoords.x, 1.0 - v_texCoords.y));
        }
      }
      `
};