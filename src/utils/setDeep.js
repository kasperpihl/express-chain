export default (name, key, value, res) => {
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