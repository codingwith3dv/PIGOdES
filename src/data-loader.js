import {
  solarData
} from './data.js';

const data = new Array();
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
        'sphere': null // Actual reference to the sphere
      }
    );
  }
}

export {
  data
};