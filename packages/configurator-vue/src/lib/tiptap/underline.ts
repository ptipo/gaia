import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        underline: {
            setUnderline: () => ReturnType;
            unsetUnderline: () => ReturnType;
            toggleUnderline: () => ReturnType;
        };
    }
}

const Underline = Extension.create({
    name: 'underline',

    addGlobalAttributes() {
        return [
            {
                types: ['textStyle'],
                attributes: {
                    underline: {
                        default: false,
                        parseHTML: (element) => {
                            return element.style.textDecoration.includes('underline') ?? false;
                        },
                        renderHTML: (attributes) => {
                            if (!attributes.underline) {
                                return {};
                            }
                            return {
                                style: `text-decoration: underline`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setUnderline:
                () =>
                ({ chain }) => {
                    return chain().setMark('textStyle', { underline: true }).run();
                },
            unsetUnderline:
                () =>
                ({ chain }) => {
                    return chain().setMark('textStyle', { underline: false }).removeEmptyTextStyle().run();
                },
            toggleUnderline:
                () =>
                ({ chain, editor }) => {
                    const { underline } = editor.getAttributes('textStyle');
                    if (underline) {
                        return chain().setMark('textStyle', { underline: false }).removeEmptyTextStyle().run();
                    } else {
                        return chain().setMark('textStyle', { underline: true }).run();
                    }
                },
        };
    },

    addKeyboardShortcuts() {
        return {
            'Mod-u': () => this.editor.commands.toggleUnderline(),
            'Mod-U': () => this.editor.commands.toggleUnderline(),
        };
    },
});

export default Underline;
