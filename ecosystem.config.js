const packageJson = require("./package.json");

module.exports = {
    apps: [{
        name: packageJson.name,
        script: "npm",
        args: "start",
    }],
};
