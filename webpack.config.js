import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'production',
  entry: './index.js',
  output: {
    path: resolve(__dirname, "bin"),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Match JavaScript files
        exclude: /node_modules/, // Exclude node_modules directory
        use: {
          loader: 'babel-loader', // Use Babel for transpiling JavaScript
          options: {
            presets: ['@babel/preset-env'], // Use preset-env for modern JavaScript
          },
        },
      }
    ]
  },
  resolve: {
    fallback: {
      "fs": false,
      "path": false,
      "assert": false
    }
  }
}
