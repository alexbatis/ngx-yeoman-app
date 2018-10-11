var ProcessAdapter = module.exports = function ProcessAdapter() {};

ProcessAdapter.prototype.prompt = function (questions, callback) {
  process.send({
    event: 'generator:prompt-questions',
    data: questions
  });

  if (callback){
    this.answerCallback = callback;
  } else {
    return new Promise((resolve) => {
      this.answerCallback = resolve;
    });
  }
};

ProcessAdapter.prototype.diff = function (actual, expected) {
  process.send({
    event: 'generator:diff',
    data: {
      actual: actual,
      expected: expected
    }
  });
};

// TODO: Implement logger
ProcessAdapter.prototype.log = require('yeoman-environment/lib/util/log')();
