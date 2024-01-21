module.exports = {
  visitor: {
    Identifier(path) {
      console.log(path);
      path.node.name = "";
    },
  },
}
