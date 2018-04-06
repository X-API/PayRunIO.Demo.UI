module.exports = (salary) => {
    if (salary) {
        return parseFloat(salary).toFixed(2);
    }
    
    return "";
};