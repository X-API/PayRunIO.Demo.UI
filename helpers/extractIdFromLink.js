module.exports = (obj) => {
    let href = obj["@href"];
    let parts = href.split("/");

    return parts[parts.length - 1];
};