import getInputKeyValue from './getInputKeyValue';

const setDeep = (name, key, value, res) => {
  if(!res.locals.__saved) {
    res.locals.__saved = {};
  }

  const keyArr = key.split('.');
  const rootEl = keyArr[0];
  if(rootEl === 'res' || rootEl === 'req' || rootEl === 'result') {
    return console.warn(`${name}: ${rootEl} is a reserved word. you cant save it`)
  }

  if(keyArr.length === 1) {
    res.locals.__saved[keyArr[0]] = value;
  } else {
    let targetObj = res.locals.__saved;
    keyArr.forEach((k, i) => {
      if(i < keyArr.length - 1) {
        if(typeof targetObj[k] !== 'object') {
          targetObj[k] = {};
        }
        targetObj = targetObj[k];
      } else {
        targetObj[k] = value;
      }
    });
  }
  
  
}

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