// Name: Minecraft skin
// ID: minecraftskin
// Description: An easier way to get Minecraft skins.
// By: CapivaraMod
// License: MIT AND LGPL-3.0

/*
   Created with CapivaraModBuilder
   https://capivaramod.github.io/capivaramodbuilder
*/
(async function(Scratch) {
    const variables = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }
    const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI5My45MjgiIGhlaWdodD0iOTMuOTI4IiB2aWV3Qm94PSIwLDAsOTMuOTI4LDkzLjkyOCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE5My4wMzYsLTEzMy4wMzYpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0xOTMuMDM2LDE4MGMwLC0yNS45MzcgMjEuMDI3LC00Ni45NjQgNDYuOTY0LC00Ni45NjRjMjUuOTM3LDAgNDYuOTY0LDIxLjAyNyA0Ni45NjQsNDYuOTY0YzAsMjUuOTM3IC0yMS4wMjcsNDYuOTY0IC00Ni45NjQsNDYuOTY0Yy0yNS45MzcsMCAtNDYuOTY0LC0yMS4wMjcgLTQ2Ljk2NCwtNDYuOTY0IiBmaWxsPSIjNjU0MzA4IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMTk4Ljg0OCwxODBjMCwtMjIuNzc4IDE4LjQ2NSwtNDEuMjQ0IDQxLjI0NCwtNDEuMjQ0YzIyLjc3OCwwIDQxLjI0NCwxOC40NjYgNDEuMjQ0LDQxLjI0NGMwLDIyLjc3OCAtMTguNDY2LDQxLjI0NCAtNDEuMjQ0LDQxLjI0NGMtMjIuNzc5LDAgLTQxLjI0NCwtMTguNDY2IC00MS4yNDQsLTQxLjI0NCIgZmlsbD0iI2JkN2QwZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIzMC44NTA1NSwyMDAuMTQ5NDZjLTYuMDc1MTMsMCAtMTEsLTQuOTI0ODcgLTExLC0xMXYtMTguMjk4OTFjMCwtNi4wNzUxMyA0LjkyNDg3LC0xMSAxMSwtMTFoMTguMjk4OTFjNi4wNzUxMywwIDExLDQuOTI0ODcgMTEsMTF2MTguMjk4OTFjMCw2LjA3NTEzIC00LjkyNDg3LDExIC0xMSwxMXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjEuMDAyNzcsMTczLjY1NTJsOC4yNzc5MiwwLjQwMzhsMC4yMDE5LDUuODU1MTJoNS44NTUxMmwwLjgwNzYsLTYuNDYwODJsNy44NzQxMiwwLjIwMTlsMy44MzYxMSw1Ljg1NTEybDYuNDYwODIsMC4yMDE5bDMuMDI4NTEsLTMuNjM0MjFsMS44MTcxLC0xLjQxMzMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjo0Ni45NjQ6NDYuOTY0LS0+"

    const CapivaraModBuilder = {
        Broadcasts: new function() {
            this.raw_ = {};
            this.register = (name, blocks) => {
                this.raw_[name] = blocks;
            };
            this.execute = async (name) => {
                if (this.raw_[name]) {
                    await this.raw_[name]();
                };
            };
        },

        Variables: new function() {
            this.raw_ = {};
            this.set = (name, value) => {
                this.raw_[name] = value;
            };
            this.get = (name) => {
                return this.raw_[name] ?? null;
            }
        },

        Vector: class {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }

            static from(v) {
                if (v instanceof CapivaraModBuilder.Vector) return v
                if (v instanceof Array) return new CapivaraModBuilder.Vector(Number(v[0]), Number(v[1]))
                if (v instanceof Object) return new CapivaraModBuilder.Vector(Number(v.x), Number(v.y))
                return new CapivaraModBuilder.Vector()
            }

            add(v) {
                return new CapivaraModBuilder.Vector(this.x + v.x, this.y + v.y);
            }

            set(x, y) {
                return new CapivaraModBuilder.Vector(x ?? this.x, y ?? this.y)
            }
        },

        Utils: {
            setList: (list, index, value) => {
                list[index] = value;
                return list;
            },
            lists_foreach: {
                index: [0],
                value: [null],
                depth: 0
            },
            countString: (x, y) => {
                return y.length == 0 ? 0 : x.split(y).length - 1
            }
        }
    }

    class Extension {
        getInfo() {
            return {
                "id": "minecraftapi",
                "name": "Minecraft Skins",
                menuIconURI,
                "color1": "#bd7d0f",
                "blocks": [{
                    "opcode": "block_cc036cefde2f8f85",
                    "text": "pegar url da skin da conta com o nome [95b75a6c3a27b230]",
                    "blockType": "reporter",
                    "arguments": {
                        "95b75a6c3a27b230": {
                            "type": "string",
                            "defaultValue": "Notch"
                        }
                    }
                }, {
                    "opcode": "block_736f753df8708909",
                    "text": "pegar data url da skin da conta com o nome [6814c41680660883]",
                    "blockType": "reporter",
                    "arguments": {
                        "6814c41680660883": {
                            "type": "string",
                            "defaultValue": "Notch"
                        }
                    }
                }, {
                    "opcode": "block_d2bda8d1ccb3d921",
                    "text": "definir para pegar corpo inteiro",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_495a15d646c78df2",
                    "text": "definir para pegar a cabeça",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_d255f1bd52d0eec4",
                    "text": "definir para pegar do tronco até a cabeça",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_13fbc33445d03eaa",
                    "text": "definir para pegar a cabeça em 3d",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_295064b04982fd37",
                    "text": "definir para pegar skin",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_71494ede62f7e10b",
                    "text": "ativar segunda camada",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_93c5e39cf7b5d8f5",
                    "text": "desativar segunda camada",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_2abe2379506b954a",
                    "text": "tipo sendo pegado",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_e52ea9a1c7c4726e",
                    "text": "segunda camada ativada?",
                    "blockType": "Boolean",
                    "arguments": {}
                }]
            }
        }
        async block_cc036cefde2f8f85(args) {
            if ((("0") == ("1"))) {
                return ([String("https://mineskin.eu"), CapivaraModBuilder.Variables.get("segundacamada"), String("/"), CapivaraModBuilder.Variables.get("tipo"), String("/"), args["95b75a6c3a27b230"], String("/"), String("100.png")].join(""))
            } else if (((CapivaraModBuilder.Variables.get("tipo") ==
                    ("avatar")) && (CapivaraModBuilder.Variables.get("segundacamada") ==
                    ("/armor")))) {
                return ([String("https://mineskin.eu"), String(""), String("/"), String("helm"), String("/"), args["95b75a6c3a27b230"], String("/"), String("100.png")].join(""))
            } else if ((CapivaraModBuilder.Variables.get("tipo") ==
                    ("skin"))) {
                return ([String("https://mineskin.eu"), String(""), String("/"), String("skin/"), String(""), args["95b75a6c3a27b230"], String(""), String("")].join(""))
            } else if (((CapivaraModBuilder.Variables.get("tipo") ==
                    ("head")) && (CapivaraModBuilder.Variables.get("segundacamada") ==
                    ("/armor")))) {
                return ([String("https://mineskin.eu"), String(""), String("/"), String("headhelm"), String("/"), args["95b75a6c3a27b230"], String("/"), String("100.png")].join(""))
            } else {
                return ([String("https://mineskin.eu"), CapivaraModBuilder.Variables.get("segundacamada"), String("/"), CapivaraModBuilder.Variables.get("tipo"), String("/"), args["95b75a6c3a27b230"], String("/"), String("100.png")].join(""))
            };
        }
        async block_736f753df8708909(args) {
            await (async () => {
                const __name = ("imagem");
                const __url = await extension["block_cc036cefde2f8f85"]({
                    "95b75a6c3a27b230": args["6814c41680660883"]
                });
                const store = (window.__capivaraImages || (window.__capivaraImages = {}));
                const __loadImg = (src) => new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = src;
                });
                let img;
                try {
                    img = await __loadImg(__url);
                } catch (e) {
                    const __noProto = String(__url).replace(/^https?:\/\//, "");
                    const __proxied = "https://images.weserv.nl/?url=" + (String(__url).startsWith("https") ? "ssl:" : "") + __noProto;
                    img = await __loadImg(__proxied);
                }
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                store[__name] = canvas;
            })();
            return (((window.__capivaraImages || (window.__capivaraImages = {}))[("imagem")] ? (window.__capivaraImages || (window.__capivaraImages = {}))[("imagem")].toDataURL("image/png") : ""))
        }
        async block_d2bda8d1ccb3d921(args) {
            CapivaraModBuilder.Variables.set("tipo", Scratch.Cast.toString(("body")))
        }
        async block_495a15d646c78df2(args) {
            CapivaraModBuilder.Variables.set("tipo", Scratch.Cast.toString(("avatar")))
        }
        async block_d255f1bd52d0eec4(args) {
            CapivaraModBuilder.Variables.set("tipo", Scratch.Cast.toString(("bust")))
        }
        async block_13fbc33445d03eaa(args) {
            CapivaraModBuilder.Variables.set("tipo", Scratch.Cast.toString(("head")))
        }
        async block_295064b04982fd37(args) {
            CapivaraModBuilder.Variables.set("tipo", Scratch.Cast.toString(("skin")))
        }
        async block_71494ede62f7e10b(args) {
            CapivaraModBuilder.Variables.set("segundacamada", Scratch.Cast.toString(("/armor")))
        }
        async block_93c5e39cf7b5d8f5(args) {
            CapivaraModBuilder.Variables.set("segundacamada", Scratch.Cast.toString(("")))
        }
        async block_2abe2379506b954a(args) {
            return (CapivaraModBuilder.Variables.get("tipo"))
        }
        async block_e52ea9a1c7c4726e(args) {
            if ((!(CapivaraModBuilder.Variables.get("segundacamada") ==
                    ("")))) {
                return (true)
            } else {
                return (false)
            };
        }
    }

    let extension = new Extension();
    // code compiled from extforge
    (async () => {
        await extension["block_d2bda8d1ccb3d921"]({});
        await extension["block_71494ede62f7e10b"]({});
    })();

    Scratch.extensions.register(extension);
})(Scratch);
