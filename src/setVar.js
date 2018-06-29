import setDeep from './utils/setDeep';

export default function setVariable(res, key, value) {
  setDeep('setVariable', key, value, res);
}