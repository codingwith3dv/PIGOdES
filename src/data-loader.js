import { map } from './lib/utils/utils.js';
import {
  planetData
} from './data.js';

const data = new Map();
planetData.data.forEach((value) => {
  data.set(
    value.Planet,
    {
      'name': value.Planet,
      'distance': map(value['Distance from Sun'], 6000, -6000),
      'diameter': value.Diameter
    }
  );
});
console.log(data.get('EARTH'))

export {
  data
};