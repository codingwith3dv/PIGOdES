import { map } from './lib/utils/utils.js';
import Cube from './lib/elements/cube.js'
import {
  planetData
} from './data.js';

const data = new Map();
planetData.data.forEach((value) => {
  data.set(
    value.Planet,
    {
      'name': value.Planet,
      'distance': map(value['Distance from Sun'], 60, -60),
      'radius': map(value.Diameter / 2, 5000, -5000),
      'axisTilt': value['Obliquity to Orbit'],
      'sphere': null// Actual reference to the sphere
    }
  );
});

export {
  data
};