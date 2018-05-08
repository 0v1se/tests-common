module.exports.awaitEvent = function(event) {
  return new Promise((resolve, reject) => {
    function handler(err, result) {
      event.stopWatching();
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    }
    event.watch(handler);
  });
};
module.exports.expectThrow = async function(promise) {
  try {
    await promise;
  } catch (error) {
    // TODO: Check jump destination to destinguish between a throw
    //       and an actual invalid jump.
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    // TODO: When we contract A calls contract B, and B throws, instead
    //       of an 'invalid jump', we get an 'out of gas' error. How do
    //       we distinguish this from an actual out of gas event? (The
    //       testrpc log actually show an 'invalid jump' event.)
    const outOfGas = error.message.search('out of gas') >= 0;
    const revert = error.message.search('while processing transaction: revert') >= 0;
    assert(
      invalidOpcode || outOfGas || revert,
      "Expected throw, got '" + error + "' instead",
    );
    return;
  }
  assert.fail('Expected throw not received');
};
function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
function randomHexString(length) {
  return "0x" + randomString(length, '0123456789abcdef');
}
function randomInt(max) {
  return Math.floor(Math.random() * max);
}
module.exports.randomString = randomString;
module.exports.randomInt = randomInt;
module.exports.randomAddress = function() {
  return randomHexString(40);
}