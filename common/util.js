module.exports = {
  getResultData(data, message){
    return {
      code: 0,
      message,
      result: data
    }
  }
};