import save from './utils/save';

export default function saveAs(...saves) {
  return function (req, res, next) {
    save('saveAs', saves, req, res);
    next();
  }
};