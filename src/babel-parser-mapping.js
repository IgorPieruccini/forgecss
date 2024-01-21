export const babelParserMapping = {
  "tsx": {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      "@babel/plugin-syntax-jsx",
      '@babel/plugin-transform-typescript',
      '@babel/plugin-proposal-object-rest-spread',
      "@babel/plugin-syntax-typescript",
      "@babel/plugin-transform-react-jsx",
      "@babel/plugin-proposal-class-properties",
    ]
  },
  "jsx": {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
    ],
    plugins: [
      "@babel/plugin-syntax-jsx",
      '@babel/plugin-proposal-object-rest-spread',
      "@babel/plugin-transform-react-jsx",
      "@babel/plugin-transform-class-properties",
      "@babel/plugin-proposal-class-properties",
    ]
  },
  "js": {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
    ],
    plugins: [
      "@babel/plugin-syntax-jsx",
      '@babel/plugin-proposal-object-rest-spread',
      "@babel/plugin-transform-react-jsx",
      "@babel/plugin-proposal-class-properties",
    ]

  },
  "ts": {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      "@babel/plugin-syntax-jsx",
      '@babel/plugin-transform-typescript',
      '@babel/plugin-proposal-object-rest-spread',
      "@babel/plugin-syntax-typescript",
      "@babel/plugin-transform-react-jsx",
      "@babel/plugin-proposal-class-properties",
    ]
  },
}
