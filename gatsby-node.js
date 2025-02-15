const path = require(`path`)
const slugify = require('slugify')
const { createFilePath } = require(`gatsby-source-filesystem`)
const fs = require('fs')
const grayMatter = require('gray-matter')

const PATH_TO_MD_PAGES = path.resolve('src/pages/markdown')
const { siteMetadata: { defaultLanguage } } = require('./gatsby-config')

const PAGE_TEMPLATE = path.resolve(`src/templates/pageTemplate.js`)

const SLUGOPTS = {
  lower: true,
  remove: /[*#.]/g,
}

const _getMarkdownNodeIdAndLanguage = node => {
  const relativePath = path.relative(PATH_TO_MD_PAGES, node.absolutePath)
  // e.g. static/code/my-project/en.md => { pageType: static, pageId: code/my-project, lang: en }
  const tok = relativePath.split('/')
  const pageType = tok[0]
  const mdfile = tok[tok.length - 1]
  const pageId = tok.slice(1, tok.length - 1).join('/')
  const lang = path.basename(mdfile, '.md')
  return { pageType, pageId, lang }
}

const _isMarkdownNode = n => n.internal.mediaType === `text/markdown`

const _loadMarkdownFile = n => grayMatter(fs.readFileSync(n.absolutePath, 'utf-8').toString())

const _generatePagePath = ({ pageType, pageId, date }) => {
  if ('blog' === pageType) {
    const [ year, month, day ] = date.split('-')
    return `/archives/${year}/${month}/${day}/${pageId}`
  } else {
    return `/${pageId}`
  }
}

const _wrapGraphql = graphql => async str => {
  const result = await graphql(str)
  if (result.errors) {
    throw result.errors
  }
  return result
}

const _createMarkdownPages = ({ pages, getNode, createPage }, cb) => {
  pages.forEach(({ id, relativePath }, index) => {
    const node = getNode(id)
    const { fields: { page: { path: pagePath, lang } } } = node

    if (defaultLanguage === lang) {
      createPage({
        path: pagePath,
        component: PAGE_TEMPLATE,
        context: {
          relativePath,
          ...(cb ? cb(index, node) : null)
        },
      })
    }
  })
}

// @TODO move to query!
exports.onCreateNode = ({ node, getNodes, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `Contacts`) {
    const category = slugify(node.Description, SLUGOPTS)
    const county = slugify(node.County, SLUGOPTS)
    const city = slugify(node.City, SLUGOPTS)
    const name = slugify(node.UnitName, SLUGOPTS)

    createNodeField({
      node,
      name: `path`,
      value: `${county}/${name}-${category}`,
    })
    createNodeField({
      node,
      name: `categorySlug`,
      value: category,
    })
  }

  // From https://hiddentao.com/archives/2019/05/07/building-a-multilingual-static-site-with-gatsby
  if (_isMarkdownNode(node)) {
    // pageType = "blog" or "static"
    // pageId = page slug
    // lang = "en" or "zh-TW"
    const { pageType, pageId, lang } = _getMarkdownNodeIdAndLanguage(node)

    // these values are extracted from within the markdown
    const { data: { title, date, draft }, content: body } = _loadMarkdownFile(node)

    const pageData = {
      pageId,
      type: pageType,
      path: _generatePagePath({ pageType, pageId, date }),
      lang,
      date,
      draft: !!draft,
      versions: []
    }

    // if is default language node then load in versions in other languages
    if (lang === defaultLanguage) {
      // generate all versions of the node (including default language version)
      getNodes().forEach(n => {
        if (_isMarkdownNode(n)) {
          const r = _getMarkdownNodeIdAndLanguage(n)

          if (r.pageId === pageId) {
            const gm = _loadMarkdownFile(n)

            pageData.versions.push({
              lang: r.lang,
              summary: gm.data.summary,
              title: gm.data.title,
              date: gm.data.date,
              markdown: gm.content,
            })
          }
        }
      })
    }

    // this adds all the data above to Gatsby's internal representation of the node
    createNodeField({
      node,
      name: 'page',
      value: pageData,
    })
  }
}
exports.createPages = async ({ graphql, actions, getNode }) => {
  const { createPage, createNodeField } = actions
  const result = await graphql(`
    query {
      allContacts {
        nodes {
          Code
          UnitName
          Description
          County

          FirstName
          LastName
          Email_GOV
          Phone
          Ext
          Fax
          Title
          City
          Address
          State
          Phone
          ZIP

          CEOFName
          CEOLName
          CEOEmail
          CEOPhone
          CEOExt
          CEOFax
          CEOTitle
          CEOAddr
          CEOCity
          CEOState
          CEOZIP

          CFOFName
          CFOLName
          CFOEmail
          CFOPhone
          CFOExt
          CFOFax
          CFOTitle
          CFOAddr
          CFOCity
          CFOState
          CFOZIP

          FOIAFName
          FOIALName
          FOIAEmail
          FOIAPhone
          FOIAExt
          FOIAFax
          FOIATitle
          FOIAAddr
          FOIACity
          FOIAState
          FOIAZIP

          PAFName
          PALName
          PAEmail
          PAPhone
          PAExt
          PAFax
          PATitle
          PAAddr
          PACity
          PAState
          PAZIP

          TIFFName
          TIFLName
          TIFEmail
          TIFPhone
          TIFExt
          TIFFax
          TIFTitle

          fields {
            categorySlug
            path
          }
        }
      }
    }
  `)
  result.data.allContacts.nodes.forEach((node) => {
    createPage({
      path: node.fields.path,
      component: path.resolve(`./src/templates/unit.js`),
      context: {
        contact: node,
      },
    })
  })

  const _graphql = _wrapGraphql(graphql)
  const { data: { allFile: { nodes: staticPages } } } = await _graphql(`
    {
      allFile( filter: { fields: { page: { type: { eq: "static" } } } } ) {
        nodes {
          id
          relativePath
        }
      }
    }
  `)
  _createMarkdownPages({ pages: staticPages, getNode, createPage })

}
