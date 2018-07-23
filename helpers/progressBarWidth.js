module.exports = (progress) => {
    let parsedProgress = parseFloat(progress);

    return `${parsedProgress * 100}%;`;
};