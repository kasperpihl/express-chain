import { object } from 'valjs';
import save from './utils/save';
import getInputKeyValue from './utils/getInputKeyValue';

export default function makeMiddleware(name, validator, handler) {
  if(typeof name !== 'string') {
    return console.warn('makeMiddleware: first argument should be the name of the middleware');
  }
  if(typeof validator === 'function') {
    handler = validator;
    validator = null;
  }
  if(typeof handler !== 'function') {
    return console.warn('makeMiddleware: should provide function to run');
  }
  function loadMiddleware(...inputs) {
    function middleware(req, res, next){
      const saves = this; // Using binding context to chain the save command

      const actualInput = {};
      inputs.forEach((input) => {
        if(typeof input === 'string') {
          const { key, value } = getInputKeyValue(input, req, res);
          actualInput[key] = value;
        } else if (typeof input === 'object') {
          Object.assign(actualInput, input);
        }
      });

      if (validator) {
        const error = object.as(validator).test(actualInput);
        if (error) {
          return next(`${name}: ${error}`);
        }
      }


      let calledNext = false;
      const custNext = (err, result) => {
        res.locals.__result = result || null;
        save(name, saves, req, res);

        if(calledNext){
          return console.warn(`${name}: next called multiple times`);
        } 
          
        
        next(err || undefined);
        calledNext = true;
      }
      handler(actualInput, custNext);
    }

    middleware.save = function(...saves) {
      return middleware.bind(saves);
    }
    if(inputs && inputs[0] && inputs[0].app && inputs[0].app.locals) {
      return middleware(...inputs);
    }
    return middleware;
  }
  // Add support for loading middleware without function call :)
  loadMiddleware.save = function(...saves) {
    return loadMiddleware().save(...saves);
  }
  return loadMiddleware;
}