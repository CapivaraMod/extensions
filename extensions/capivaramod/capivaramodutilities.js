// Name: CapivaraMod Utilities
// ID: capivaramodutilities
// Description: utility block for CapivaraMod.
// By: CapivaraMod
// License: MIT AND LGPL-3.0

(function (Scratch) {
    "use strict";

    class CapivaraModUtilities {
        getInfo() {
            return {
                id: "capivaramodutilities",
                name: "Utilidades do CapivaraMod",
                color1: "#a66e3c",
                color2: "#8a5a2f",
                color3: "#6e4825",

                blocks: [
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Texto"
                    },
                    {
                        opcode: "newline",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Nova linha"
                    },
                    {
                        opcode: "unique_letters",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Obter lista de letras do texto [text] dividido por [sep]",
                        arguments: {
                            text: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "banana"
                            },
                            sep: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ","
                            }
                        }
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Lógica e matemática"
                    },
                    {
                        opcode: "strict_equality",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Igualdade estrita [one]=[two]",
                        arguments: {
                            one: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            two: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        opcode: "exponent",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "[one] ^ [two]",
                        arguments: {
                            one: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: ""
                            },
                            two: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: ""
                            }
                        }
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Caixas de diálogo"
                    },
                    {
                        opcode: "alert_ext",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Alerta [one]",
                        arguments: {
                            one: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Alerta..."
                            }
                        }
                    },
                    {
                        opcode: "confirm_ext",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Confirmar [one]",
                        arguments: {
                            one: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Confirmar..."
                            }
                        }
                    },
                    {
                        opcode: "prompt_ext",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Perguntar [one] padrão [two]",
                        arguments: {
                            one: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Digite o nome de usuário:"
                            },
                            two: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "griffpatch"
                            }
                        }
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Página e links"
                    },
                    {
                        opcode: "open_link",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Abrir link [one]",
                        arguments: {
                            one: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "https://capivaramod.github.io/"
                            }
                        }
                    },
                    {
                        opcode: "redirect",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Redirecionar para [one]",
                        arguments: {
                            one: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "https://capivaramod.github.io/"
                            }
                        }
                    },
                    {
                        opcode: "get_current_url",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "URL atual"
                    },
                    {
                        opcode: "get_url_param",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Parâmetro [name] da URL",
                        arguments: {
                            name: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "id"
                            }
                        }
                    },
                    {
                        opcode: "set_clipboard",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Definir área de transferência como [one]",
                        arguments: {
                            one: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Sistema"
                    },
                    {
                        opcode: "get_browser",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Navegador"
                    },
                    {
                        opcode: "is_online",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Está online?"
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Console"
                    },
                    {
                        opcode: "consoleLog",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Registrar no console [input] fonte [font] tamanho [size] cor [color]",
                        arguments: {
                            input: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "CapivaraMod"
                            },
                            font: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "monospace",
                                menu: "consoleFonts"
                            },
                            size: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "8"
                            },
                            color: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: "#000000"
                            }
                        }
                    },
                    {
                        opcode: "consoleClear",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Limpar console"
                    }
                ],
                menus: {
                    consoleFonts: {
                        acceptReporters: true,
                        items: [
                            { text: "Serifada (padrão)", value: "serif" },
                            { text: "Monoespaçada", value: "monospace" },
                            { text: "Sem serifa", value: "sans-serif" }
                        ]
                    }
                }
            };
        }
        newline() {
            return "\n";
        }

        unique_letters(args) {
            const letras = Array.from(String(args.text)).filter(c => /\p{L}/u.test(c));
            return Array.from(new Set(letras)).join(String(args.sep));
        }
        strict_equality(args) {
            return (args.one == args.two);
        }
        exponent(args) {
            return args.one ** args.two;
        }
        alert_ext(args) {
            alert(args.one);
        }
        confirm_ext(args) {
            return confirm(args.one) ? true : false;
        }
        prompt_ext(args) {
            let userInput = prompt(args.one, args.two);
            if (userInput == null || userInput == "") {
                return "";
            } else {
                return userInput;
            }
        }

        open_link(args) {
            Scratch.openWindow(args.one);
        }

        redirect(args) {
            Scratch.redirect(args.one);
        }

        get_current_url() {
            return window.location.href;
        }

        get_url_param(args) {
            const valor = new URLSearchParams(window.location.search).get(String(args.name));
            return valor === null ? "" : valor;
        }

        set_clipboard(args) {
            navigator.clipboard.writeText(args.one);
        }

        get_browser() {
            const userAgent = navigator.userAgent;

            if (userAgent.match(/edg/i)) {
                return "Edge";
            } else if (userAgent.match(/opr\//i)) {
                return "Opera";
            } else if (userAgent.match(/firefox|fxios/i)) {
                return "Firefox";
            } else if (userAgent.match(/chrome|chromium|crios/i)) {
                return "Chrome";
            } else if (userAgent.match(/safari/i)) {
                return "Safari";
            } else {
                return "Navegador não detectado";
            }
        }

        is_online() {
            return navigator.onLine;
        }

        consoleLog(args) {
            console.log(`%c${args.input}`, `color:${args.color}; font-family:${args.font}; font-size: ${args.size}px;`);
        }

        consoleClear() {
            console.clear();
        }
    }
    Scratch.extensions.register(new CapivaraModUtilities());
})(Scratch);