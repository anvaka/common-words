/* global window */
/**
 * A very basic ajax client with promises and progress reporting.
 */
import Promise from 'bluebird';

function request(url, options) {
  if (!options) options = {};
  if (url.indexOf('.json') === url.length - 5) {
    options.responseType = 'json';
  }

  return new Promise(download);

  function download(resolve, reject) {
    const req = new window.XMLHttpRequest();

    if (typeof options.progress === 'function') {
      req.addEventListener('progress', updateProgress, false);
    }

    req.addEventListener('load', transferComplete, false);
    req.addEventListener('error', transferFailed, false);
    req.addEventListener('abort', transferCanceled, false);

    req.open('GET', url);
    if (options.responseType) {
      req.responseType = options.responseType;
    }
    req.send(null);

    function updateProgress(e) {
      if (e.lengthComputable) {
        options.progress({
          loaded: e.loaded,
          total: e.total,
          percent: e.loaded / e.total,
        });
      }
    }

    function transferComplete() {
      if (req.status !== 200) {
        reject(`Unexpected status code ${req.status} when calling ${url}`);
        return;
      }
      let response = req.response;

      if (options.responseType === 'json' && typeof response === 'string') {
        // IE
        response = JSON.parse(response);
      }

      resolve(response);
    }

    function transferFailed() {
      reject(`Failed to download ${url}`);
    }

    function transferCanceled() {
      reject(`Cancelled download of ${url}`);
    }
  }
}

export default request;
