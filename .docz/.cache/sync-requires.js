const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/alecjo/Desktop/elv-live-web/.docz/.cache/dev-404-page.js"))),
  "component---docs-components-mdx": hot(preferDefault(require("/Users/alecjo/Desktop/elv-live-web/docs/components.mdx"))),
  "component---docs-dependencies-mdx": hot(preferDefault(require("/Users/alecjo/Desktop/elv-live-web/docs/dependencies.mdx"))),
  "component---docs-index-mdx": hot(preferDefault(require("/Users/alecjo/Desktop/elv-live-web/docs/index.mdx"))),
  "component---docs-styling-mdx": hot(preferDefault(require("/Users/alecjo/Desktop/elv-live-web/docs/styling.mdx"))),
  "component---readme-md": hot(preferDefault(require("/Users/alecjo/Desktop/elv-live-web/README.md"))),
  "component---src-pages-404-js": hot(preferDefault(require("/Users/alecjo/Desktop/elv-live-web/.docz/src/pages/404.js")))
}

