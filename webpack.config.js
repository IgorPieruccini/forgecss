import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'development',
  entry: './index.js',
  target: 'node',
  output: {
    path: resolve(__dirname, "bin"),
    filename: "[name].js"
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}
