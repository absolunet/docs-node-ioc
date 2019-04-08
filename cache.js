'use strict';

const path = require('path');
const fss = require('@absolunet/fss');
const glob = require('glob');

const srcPath = 'src';
const codePath = `${srcPath}/lib`;
const cacheFolder = `./${codePath}/.cache`;

const cachePages = () => {
    let content = '\'use strict\';\n\nimport Vue from \'vue\';\n\nconst render = template => (new Vue({ render: h => h(template) })).$mount().$el.outerHTML;\n\nexport default {\n\t';
    const folder = 'docs';
    const files = {};
    glob.sync(`./${srcPath}/${folder}/**/*.md`).map((file) => {
        const [locale] = file.split('/').reverse()[0].split('.');
        files[locale] = files[locale] || [];
        files[locale].push(file);
    });
    Object.keys(files).forEach((locale, index, arr) => {
        content += `'${locale}': {\n\t\tcontent: {\n\t\t\t`;
        content += files[locale].map((file) => {
            const formatted = file.replace(`/${srcPath}`, '');
            const key = formatted
                .replace(/\/[0-9]+_([a-zA-Z0-9-]+)/gu, '/$1')
                .replace(/\/[a-zA-Z0-9-]+.md$/u, '')
                .replace(/\//gu, '__')
                .replace(/[.-]/gu, '_')
                .replace(new RegExp(`^[_]{0,}${folder}[_]{0,}`, 'u'), '');
            const filePath = `./${path.relative(path.join(__dirname, cacheFolder), path.join(__dirname, srcPath, formatted))}`;

            return `'${key}': render(require('${filePath}').default)`;
        }).join(',\n\t\t\t');
        content += '\n\t\t}\n\t}';

        if (index < arr.length - 1) {
            content += ',\n\t';
        }
    });
    content += '\n};\n';

    fss.writeFile(`${cacheFolder}/docs.js`, content);
};

const cacheMenus = () => {
    const folder = 'docs';
    const getDirectoryTree = (dir) => {
        const tree = [];
        fss.readdir(dir).sort((a, b) => a.localeCompare(b)).forEach((item) => {
            const f = path.join(dir, item);
            if (fss.lstat(f).isDirectory()) {
                const children = getDirectoryTree(f);
                const name = item.replace(/^[0-9]+_/, '');
                tree.push({ name, children });
            }
        });
        const keys = Object.keys(tree);
        if (keys.length === 0) {
            return [];
        }

        if (keys.some((key) => !(/^[0-9]+$/u).test(key))) {
            return tree;
        }

        return keys.sort((a, b) => parseInt(a) - parseInt(b)).map((key) => tree[key]);
    };
    const menus = getDirectoryTree(path.join(__dirname, srcPath, folder));
    let content = `'use strict';\n\nexport default ${JSON.stringify(menus)};\n`;
    fss.writeFile(`${cacheFolder}/menus.js`, content);
};

fss.ensureDir(cacheFolder);
cachePages();
cacheMenus();