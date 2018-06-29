import getInputKeyValue from './getInputKeyValue';
import setDeep from './setDeep';

export default (name, saves, req, res) => {
  saves = saves || [];
  saves.forEach((input) => {
    if(typeof input === 'string') {
      let target;
      const separatorI = input.indexOf(':');
      if(separatorI > -1) {
        target = input.slice(separatorI + 1);
        input = input.slice(0, separatorI);
      }
      const traverseI = input.indexOf('.');
      if(traverseI === -1) {
        target = input;
        input = 'result';
      }

      const { key, value } = getInputKeyValue(input, req, res);
      target = target || key;

      setDeep(name, target, value, res);
      
    }
  });
};