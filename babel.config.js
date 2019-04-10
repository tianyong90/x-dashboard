module.exports = function (api) {
  const { BABEL_MODULE, NODE_ENV } = process.env
  const useESModules = BABEL_MODULE !== 'commonjs' && NODE_ENV !== 'test'

  api && api.cache(false)

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['>0.5%', 'last 2 versions', 'not dead', 'not op_mini all'],
            node: 8,
          },
          modules: useESModules ? false : 'commonjs',
        },
      ],
      // [
      //   '@vue/babel-preset-jsx',
      //   {
      //     functional: false,
      //   },
      // ],
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: false,
          helpers: true,
          regenerator: false,
          useESModules,
        },
      ],
      '@babel/plugin-syntax-dynamic-import',
    ]
  }
}
