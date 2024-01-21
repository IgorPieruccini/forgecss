export default (filepath) => {
  const filename = filepath.split("/").reverse()[0]
  return {
    name: filename,
    ext: filename.split(".").reverse()[0]
  }
}

