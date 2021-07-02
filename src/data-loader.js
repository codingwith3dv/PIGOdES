import {
  solarData
} from './data.js';

const data = new Array();

const texPaths = [
  './res/2k_sun.jpg',
  './res/2k_mercury.jpg',
  './res/2k_venus_surface.jpg',
  './res/2k_earth_daymap.jpg',
  './res/2k_mars.jpg',
  './res/2k_jupiter.jpg',
  './res/2k_saturn.jpg',
  './res/2k_uranus.jpg',
  './res/2k_neptune.jpg'
];

{
  for(let i = 0; i < solarData.data.length; i++) {
    let value = solarData.data[i];
    let isSun = false;
    if(value.name === 'SUN') {
      isSun = true;
    }
    data.push(
      {
        'name': value.name,
        'distance': parseFloat(value['Distance from Sun']),
        'radius': (parseFloat(value.Diameter) / 2) / (12756 / 2),
        'axisTilt': parseFloat(value['Obliquity to Orbit']),
        'orbPeriod': parseFloat(value['Orbital Period'].slice(0, -7)),
        'rotPeriod':(parseFloat(value['Rotation Period'].slice(0, -8)) / 24),
        'isSun': isSun,
        'texturePath': texPaths[i],
        'sphere': null, // Actual reference to the sphere
        'orbit': null, // Actual reference to the orbit
      }
    );
  }
}

export {
  data
};