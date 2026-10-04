// Name: Star Wars API (unofficial)
// ID: starwarsapi
// Description: offers integration with the Star Wars API (https://swapi.dev/) to fetch information about characters and planets.
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

    const CapivaraModBuilder = {

        Broadcasts: new function() {
            this.raw_ = {};
            this.register = (name, blocks) => {
                (this.raw_[name] = this.raw_[name] || []).push(blocks);
            };
            this.execute = async (name, util) => {
                const handlers = this.raw_[name];
                if (!handlers) return;
                await Promise.all(handlers.map(fn => fn(util)));
            };
        },

        Hats: new function() {
            this.listeners_ = {};
            this.patched_ = false;
            this.on = (opcode, callback) => {
                (this.listeners_[opcode] = this.listeners_[opcode] || []).push(callback);
                if (this.patched_) return;
                this.patched_ = true;
                const runtime = Scratch.vm.runtime;
                const original = runtime.startHats;
                const self = this;
                runtime.startHats = function(hatOpcode, fields, target) {
                    const list = self.listeners_[hatOpcode];
                    if (list) {
                        for (const fn of list.slice()) {
                            Promise.resolve().then(() => fn(target, fields)).catch(e => console.error(e));
                        }
                    }
                    return original.apply(this, arguments);
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
    };

    const MENU_ICON_URI = "data:image/png;base64,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";

    class Extension {

        getInfo() {
            return {
                "menuIconURI": MENU_ICON_URI,
                "id": "starwarsapi",
                "name": "Star Wars API",
                "color1": "#6f0fbd",
                "blocks": [

                    { blockType: Scratch.BlockType.LABEL, text: 'Personagem: seleção' },
                    {
                        "opcode": "block_6e0dd5608d42cac4",
                        "text": "selecionar personagem [7348514f29628a75]",
                        "blockType": "command",
                        "arguments": {
                            "7348514f29628a75": {
                                "type": "number",
                                "defaultValue": 1
                            }
                        }
                    }, {
                        "opcode": "block_cbf6837af9ca10ca",
                        "text": "escolher personagem aleatorio",
                        "blockType": "command",
                        "arguments": {}
                    }, {
                        "opcode": "block_a02bea1eec37a49b",
                        "text": "numero do personagem selecionado",
                        "blockType": "reporter",
                        "arguments": {}
                    }, {
                        "opcode": "block_3d5e54d8449615cb",
                        "text": "numero de personagem aleatorio",
                        "blockType": "reporter",
                        "arguments": {}
                    },

                    { blockType: Scratch.BlockType.LABEL, text: 'Personagem: informações' },
                    {
                        "opcode": "block_e8ea2b80b2565445",
                        "text": "nome do personagem selecionado",
                        "blockType": "reporter",
                        "arguments": {}
                    }, {
                        "opcode": "block_95fbdee07d876bd2",
                        "text": "altura do personagem selecionado (em cm)",
                        "blockType": "reporter",
                        "arguments": {}
                    }, {
                        "opcode": "block_cd5a4b68ab46aa51",
                        "text": "peso do personagem selecionado (em kg)",
                        "blockType": "reporter",
                        "arguments": {}
                    }, {
                        "opcode": "block_a5adde0c7d72a139",
                        "text": "genero do personagem selecionado",
                        "blockType": "reporter",
                        "arguments": {}
                    }, {
                        "opcode": "block_29b57bc8dae08a73",
                        "text": "ano de aniversario do personagem selecionado",
                        "blockType": "reporter",
                        "arguments": {}
                    }, {
                        "opcode": "block_c591827d2ce9cbc4",
                        "text": "cor do cabelo do personagem selecionado",
                        "blockType": "reporter",
                        "arguments": {}
                    }, {
                        "opcode": "block_42c0c05e670c45dc",
                        "text": "cor da pele do personagem selecionado",
                        "blockType": "reporter",
                        "arguments": {}
                    }, {
                        "opcode": "block_691551c7ea03a98c",
                        "text": "cor dos olhos do personagem selecionado",
                        "blockType": "reporter",
                        "arguments": {}
                    }, {
                        "opcode": "block_04e4ea880ea5c42d",
                        "text": "planeta onde mora o personagem selecionado (id)",
                        "blockType": "reporter",
                        "arguments": {}
                    },

                    { blockType: Scratch.BlockType.LABEL, text: 'Planetas' },
                    {
                        "opcode": "block_475782fbebc211f1",
                        "text": "nome do planeta com o id [8da7c7463769eab4]",
                        "blockType": "reporter",
                        "arguments": {
                            "8da7c7463769eab4": {
                                "type": "number",
                                "defaultValue": 1
                            }
                        }
                    }, {
                        "opcode": "block_9d88a255ff604dad",
                        "text": "terreno do planeta com o id [f8883b76fda6d63b]",
                        "blockType": "reporter",
                        "arguments": {
                            "f8883b76fda6d63b": {
                                "type": "number",
                                "defaultValue": 1
                            }
                        }
                    }, {
                        "opcode": "block_ae598a5603d759ab",
                        "text": "população do planeta com o id [148754c49dae07af]",
                        "blockType": "reporter",
                        "arguments": {
                            "148754c49dae07af": {
                                "type": "number",
                                "defaultValue": 1
                            }
                        }
                    }
                ]
            }
        }

        async block_6e0dd5608d42cac4(args, util) {
            CapivaraModBuilder.Variables.set("personagemselecionado", args["7348514f29628a75"]);
        }

        async block_cbf6837af9ca10ca(args, util) {
            CapivaraModBuilder.Variables.set("personagemselecionado", vm.runtime.ext_scratch3_operators._random((1), Number(((await (await fetch(("https://swapi.dev/api/people/"))).json()))?.[("count")])));
        }

        async block_a02bea1eec37a49b(args, util) {
            return (CapivaraModBuilder.Variables.get("personagemselecionado"));
        }

        async block_3d5e54d8449615cb(args, util) {
            return (vm.runtime.ext_scratch3_operators._random((1), Number(((await (await fetch(("https://swapi.dev/api/people/"))).json()))?.[("count")])));
        }

        async block_e8ea2b80b2565445(args, util) {
            return (((await (await fetch([String("https://swapi.dev/api/people/"), Scratch.Cast.toString(CapivaraModBuilder.Variables.get("personagemselecionado")), String("/")].join(""))).json()))?.[("name")]);
        }

        async block_95fbdee07d876bd2(args, util) {
            return (((await (await fetch([String("https://swapi.dev/api/people/"), Scratch.Cast.toString(CapivaraModBuilder.Variables.get("personagemselecionado")), String("/")].join(""))).json()))?.[("height")]);
        }

        async block_cd5a4b68ab46aa51(args, util) {
            return (((await (await fetch([String("https://swapi.dev/api/people/"), Scratch.Cast.toString(CapivaraModBuilder.Variables.get("personagemselecionado")), String("/")].join(""))).json()))?.[("mass")]);
        }

        async block_a5adde0c7d72a139(args, util) {
            return (((await (await fetch([String("https://swapi.dev/api/people/"), Scratch.Cast.toString(CapivaraModBuilder.Variables.get("personagemselecionado")), String("/")].join(""))).json()))?.[("gender")]);
        }

        async block_29b57bc8dae08a73(args, util) {
            return (((await (await fetch([String("https://swapi.dev/api/people/"), Scratch.Cast.toString(CapivaraModBuilder.Variables.get("personagemselecionado")), String("/")].join(""))).json()))?.[("birth_year")]);
        }

        async block_c591827d2ce9cbc4(args, util) {
            return (((await (await fetch([String("https://swapi.dev/api/people/"), Scratch.Cast.toString(CapivaraModBuilder.Variables.get("personagemselecionado")), String("/")].join(""))).json()))?.[("hair_color")]);
        }

        async block_42c0c05e670c45dc(args, util) {
            return (((await (await fetch([String("https://swapi.dev/api/people/"), Scratch.Cast.toString(CapivaraModBuilder.Variables.get("personagemselecionado")), String("/")].join(""))).json()))?.[("skin_color")]);
        }

        async block_691551c7ea03a98c(args, util) {
            return (((await (await fetch([String("https://swapi.dev/api/people/"), Scratch.Cast.toString(CapivaraModBuilder.Variables.get("personagemselecionado")), String("/")].join(""))).json()))?.[("eye_color")]);
        }

        async block_04e4ea880ea5c42d(args, util) {
            return (((String(((await (await fetch([String("https://swapi.dev/api/people/"), Scratch.Cast.toString(CapivaraModBuilder.Variables.get("personagemselecionado")), String("/")].join(""))).json()))?.[("homeworld")]).split(("/")))[(6) - 1]));
        }

        async block_475782fbebc211f1(args, util) {
            return (((await (await fetch([String("https://swapi.dev/api/planets/"), Scratch.Cast.toString(args["8da7c7463769eab4"]), String("/")].join(""))).json()))?.[("name")]);
        }

        async block_9d88a255ff604dad(args, util) {
            return (((await (await fetch([String("https://swapi.dev/api/planets/"), Scratch.Cast.toString(args["f8883b76fda6d63b"]), String("/")].join(""))).json()))?.[("terrain")]);
        }

        async block_ae598a5603d759ab(args, util) {
            return (((await (await fetch([String("https://swapi.dev/api/planets/"), Scratch.Cast.toString(args["148754c49dae07af"]), String("/")].join(""))).json()))?.[("population")]);
        }
    }

    let extension = new Extension();

    // code compiled from CapivaraModBuilder
    (async () => {
        CapivaraModBuilder.Variables.set("personagemselecionado", Scratch.Cast.toNumber((1)));
    })();

    Scratch.extensions.register(extension);

})(Scratch);

