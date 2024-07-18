import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const REM_REGEX = /(?<=\d)rem/g;
const PROCESSED = Symbol('processed');

let isFormCSS = true;
const convertRemToEm = {
    postcssPlugin: 'convertRemToEm',
    // When debugging this, https://astexplorer.net/#/2uBU1BLuJ1 is very helpful
    Once(css) {
        const filePath = css.source.input.file;
        isFormCSS = filePath.includes('form.css?inline');
    },
    Declaration(decl) {
        const filePath = decl.source?.input?.file;
        if (isFormCSS && filePath && !decl[PROCESSED]) {
            decl.value = decl.value.replace(REM_REGEX, 'em');
            decl[PROCESSED] = true;
        }
    },
};

export default {
    plugins: [tailwindcss, autoprefixer, convertRemToEm],
};
