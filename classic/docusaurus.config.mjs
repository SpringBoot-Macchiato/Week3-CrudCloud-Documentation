import { themes as prismThemes } from 'prism-react-renderer';

const config = {
    title: 'Documentation',
    tagline: 'Documentación técnica completa del proyecto',
    favicon: 'img/favicon.ico',

    future: {
        v4: true,
    },

    url: 'https://docs.macchiato.crudzaso.com',
    baseUrl: '/',

    organizationName: 'SpringBoot-Macchiato',
    projectName: 'Week3-CrudCloud-Documentation',

    onBrokenLinks: 'throw',

    i18n: {
        defaultLocale: 'es',
        locales: ['es'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.js',
                    editUrl:
                        'https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Documentation/tree/develop/',
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            },
        ],
    ],

    themeConfig: {
        image: 'img/docusaurus-social-card.jpg',
        colorMode: {
            defaultMode: 'dark',
            disableSwitch: false,
            respectPrefersColorScheme: false,
        },
        navbar: {
            title: 'CrudCloud',
            logo: {
                alt: 'CrudCloud Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'docsSidebar',
                    position: 'left',
                    label: 'Documentación',
                },
                {
                    type: 'dropdown',
                    label: 'Repositorios',
                    position: 'left',
                    items: [
                        {
                            label: 'Frontend',
                            href: 'https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Frontend',
                        },
                        {
                            label: 'Backend',
                            href: 'https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Backend',
                        },
                        {
                            label: 'Documentación',
                            href: 'https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Documentation',
                        },
                    ],
                },
                {
                    type: 'dropdown',
                    label: 'Enlaces',
                    position: 'right',
                    items: [
                        {
                            label: 'API Backend',
                            href: 'https://api.macchiato.crudzaso.com/swagger-ui/index.html#/',
                        },
                        {
                            label: 'Aplicación',
                            href: 'https://macchiato.crudzaso.com',
                        },
                    ],
                },
                {
                    href: 'https://github.com/SpringBoot-Macchiato',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Documentación',
                    items: [
                        {
                            label: 'Introducción',
                            to: '/docs/intro',
                        },
                        {
                            label: 'Arquitectura',
                            to: '/docs/arquitectura/general',
                        },
                        {
                            label: 'API Endpoints',
                            to: '/docs/backend/endpoints',
                        },
                    ],
                },
                {
                    title: 'Repositorios',
                    items: [
                        {
                            label: 'Frontend',
                            href: 'https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Frontend',
                        },
                        {
                            label: 'Backend',
                            href: 'https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Backend',
                        },
                    ],
                },
                {
                    title: 'Más',
                    items: [
                        {
                            label: 'Contribuir',
                            to: '/docs/contribuir',
                        },
                        {
                            label: 'GitHub',
                            href: 'https://github.com/SpringBoot-Macchiato',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Week3-CrudCloud. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            additionalLanguages: ['java', 'bash', 'nginx', 'yaml', 'json'],
        },
    },
};

export default config;
