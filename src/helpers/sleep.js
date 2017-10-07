const sleep = timeout =>
  new Promise(function(resolve, reject) {
    setTimeout(resolve, timeout);
  });

export default sleep;
