// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Colony Documentation',
  tagline: 'Colony',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://colony.konstruct.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: 'docs',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: [
    'docusaurus-theme-search-typesense'
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      //image: 'img/docusaurus-social-card.jpg',
      navbar: {
        logo: {
          alt: 'Colony Docs',
          src: 'img/colony.svg',
          href: 'https://colony.konstruct.io/docs',
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
          {
            href: 'https://konstruct.io/colony',
            label: 'Website',
            position: 'right',
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} kubefirst`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      typesense: {
        typesenseCollectionName: 'colony',
        typesenseServerConfig: {
          nodes: [
            {
              host: 'typesense.mgmt-20.kubefirst.com',
              port: 443,
              protocol: 'https',
            },
          ],
          apiKey: 'bXLafYINyTtPXLo8KeP1znyMUDXtwVUl',
        },
        contextualSearch: true,
      },
    }),
};

export default config;
