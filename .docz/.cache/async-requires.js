// prefer default export if available
const preferDefault = m => (m && m.default) || m

exports.components = {
  "component---cache-dev-404-page-js": () => import("./../../dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---docs-components-mdx": () => import("./../../../../docs/components.mdx" /* webpackChunkName: "component---docs-components-mdx" */),
  "component---docs-dependencies-mdx": () => import("./../../../../docs/dependencies.mdx" /* webpackChunkName: "component---docs-dependencies-mdx" */),
  "component---docs-index-mdx": () => import("./../../../../docs/index.mdx" /* webpackChunkName: "component---docs-index-mdx" */),
  "component---docs-styling-mdx": () => import("./../../../../docs/styling.mdx" /* webpackChunkName: "component---docs-styling-mdx" */),
  "component---readme-md": () => import("./../../../../README.md" /* webpackChunkName: "component---readme-md" */),
  "component---src-pages-404-js": () => import("./../../../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */)
}

