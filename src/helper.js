module.exports = function (time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  });
}
