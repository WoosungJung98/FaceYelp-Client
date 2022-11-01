module.exports = {
  apps : [{
    name: "faceyelp_client",
    script: "node_modules/react-scripts/scripts/start.js",
    args: "",
    cwd: "./",
    instances: 2,
    exec_mode: "cluster"
  }],
};
