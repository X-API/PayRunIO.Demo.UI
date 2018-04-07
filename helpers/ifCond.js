module.exports = (v1, v2, context, options) => {
    if(v1 === v2) {
        return options.fn(context);
      }
      
      return options.inverse(context);
};