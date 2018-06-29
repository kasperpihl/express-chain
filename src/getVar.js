import getDeep from './utils/getDeep';

export default function getVar(res, key) {
  if(!res || !res.locals) {
    console.warn('getVar error: first parameter must be res object');
    return;
  }
  if(!res.locals.__saved) {
    res.locals.saved = {};
  }
  if(key === 'result') {
    return res.locals.__result;
  }
  if(key.startsWith('result.')) {
    return getDeep(res.locals.__result, key.substr(7));
  } 
  return getDeep(res.locals.__saved, key);
}