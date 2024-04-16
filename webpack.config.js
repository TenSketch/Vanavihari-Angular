const path = require('path');

module.exports = {
  mode: 'production',
  entry: './netlify/edge-functions/hello.js', // Path to your edge function file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  target: 'node',
};

