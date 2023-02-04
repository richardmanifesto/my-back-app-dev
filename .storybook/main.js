const postcss = require('postcss')
const autoprefixer = require("autoprefixer");
const path = require("path");
const postCssConfig = require("../postcss.config");


module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: postcss,
          postcssOptions: {
            plugins: [
              'postcss-preset-env',
              autoprefixer
            ]
          }

        },
      },
    },
    "@storybook/preset-scss"
  ],
  "framework": "@storybook/react",
  "staticDirs": ["../public"],
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  webpackFinal: async (config, {configType}) => {
    config.module.rules.push({
      test: /\.scss$/i,
      include: path.resolve(__dirname, '../'),
      use: [
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: postCssConfig,
          },
        }
      ]
    })

    return config
  }
}