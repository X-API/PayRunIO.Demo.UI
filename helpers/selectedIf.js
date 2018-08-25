module.exports = (condition) => {
    return condition === true || (condition && condition.toString().toLowerCase() === "true") ? "selected" : "";
};