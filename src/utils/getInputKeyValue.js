import getDeep from './getDeep';

export default (input, req, res) => {
  let key;
  const separatorI = input.indexOf(':');
  if(separatorI > -1) {
    key = input.slice(separatorI + 1);
    input = input.slice(0, separatorI);
  }
  const inputArr = input.split('.');
  const rootEl = inputArr[0];
  let value;
  if(rootEl === 'res') {
    value = res;
  } else if(rootEl === 'req') {
    value = req;
  } else if(rootEl === 'result'){
    value = res.locals.__result;
  } else {
    value = (res.locals.__saved || {})[input];
  }

  key = key || inputArr[inputArr.length - 1];
  if(inputArr.length > 1) {
    value = getDeep(value, inputArr.slice(1).join('.'));
  }

  return { key, value };
  
}