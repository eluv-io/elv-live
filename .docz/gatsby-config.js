const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Elv Live Web',
    description: 'My awesome app using docz',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root: '/Users/alecjo/Desktop/elv-live-web/.docz',
        base: '/',
        source: './',
        'gatsby-root': null,
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Elv Live Web',
        description: 'My awesome app using docz',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '-',
        paths: {
          root: '/Users/alecjo/Desktop/elv-live-web',
          templates:
            '/Users/alecjo/Desktop/elv-live-web/node_modules/docz-core/dist/templates',
          docz: '/Users/alecjo/Desktop/elv-live-web/.docz',
          cache: '/Users/alecjo/Desktop/elv-live-web/.docz/.cache',
          app: '/Users/alecjo/Desktop/elv-live-web/.docz/app',
          appPackageJson: '/Users/alecjo/Desktop/elv-live-web/package.json',
          appTsConfig: '/Users/alecjo/Desktop/elv-live-web/tsconfig.json',
          gatsbyConfig: '/Users/alecjo/Desktop/elv-live-web/gatsby-config.js',
          gatsbyBrowser: '/Users/alecjo/Desktop/elv-live-web/gatsby-browser.js',
          gatsbyNode: '/Users/alecjo/Desktop/elv-live-web/gatsby-node.js',
          gatsbySSR: '/Users/alecjo/Desktop/elv-live-web/gatsby-ssr.js',
          importsJs: '/Users/alecjo/Desktop/elv-live-web/.docz/app/imports.js',
          rootJs: '/Users/alecjo/Desktop/elv-live-web/.docz/app/root.jsx',
          indexJs: '/Users/alecjo/Desktop/elv-live-web/.docz/app/index.jsx',
          indexHtml: '/Users/alecjo/Desktop/elv-live-web/.docz/app/index.html',
          db: '/Users/alecjo/Desktop/elv-live-web/.docz/app/db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
