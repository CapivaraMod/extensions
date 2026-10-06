// Name: Morse Code Song
// ID: morsecodesong
// Description: play Morse code sounds.
// By: CapivaraMod
// License: MIT AND LGPL-3.0

(async function(Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    let unidade = 0.06;
    const FREQUENCIA = 600;

    let audioCtx = null;
    let geracao = 0;
    const osciladores = new Map();
    const pendentes = new Set();

    const getCtx = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
    };

    const esperar = (segundos) =>
        new Promise(resolve => {
            const p = { resolve };
            p.timer = setTimeout(() => {
                pendentes.delete(p);
                resolve();
            }, segundos * 1000);
            pendentes.add(p);
        });

    const bipe = async (duracao, minha) => {
        const ctx = getCtx();
        if (ctx.state === "suspended") await ctx.resume();
        if (geracao !== minha) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = FREQUENCIA;
        osc.connect(gain);
        gain.connect(ctx.destination);

        const agora = ctx.currentTime;
        const rampa = Math.min(0.005, duracao / 4);
        gain.gain.setValueAtTime(0, agora);
        gain.gain.linearRampToValueAtTime(1, agora + rampa);
        gain.gain.setValueAtTime(1, agora + duracao - rampa);
        gain.gain.linearRampToValueAtTime(0, agora + duracao);

        osciladores.set(osc, gain);
        osc.onended = () => {
            osciladores.delete(osc);
            try { osc.disconnect(); gain.disconnect(); } catch (e) {}
        };
        osc.start(agora);
        osc.stop(agora + duracao);
        await esperar(duracao);
    };

    const pararTudo = () => {
        geracao++;

        pendentes.forEach(p => {
            clearTimeout(p.timer);
            p.resolve();
        });
        pendentes.clear();

        if (audioCtx) {
            const agora = audioCtx.currentTime;
            osciladores.forEach((gain, osc) => {
                try {
                    gain.gain.cancelScheduledValues(agora);
                    gain.gain.setValueAtTime(gain.gain.value, agora);
                    gain.gain.linearRampToValueAtTime(0, agora + 0.01);
                    osc.stop(agora + 0.02);
                } catch (e) {}
            });
        }
    };

    const normalizar = (texto) =>
        texto
            .replace(/[•·●∙]/g, ".")
            .replace(/[–—−_]/g, "-")
            .replace(/[\\|]/g, "/");

    const executarMorse = async (textoOriginal) => {
        const texto = normalizar(textoOriginal);
        const minha = geracao;
        const u = unidade;

        const palavras = texto.split("/");

        for (let w = 0; w < palavras.length; w++) {
            const letras = palavras[w].trim().split(/\s+/).filter(Boolean);

            for (let l = 0; l < letras.length; l++) {
                const simbolos = [...letras[l]].filter(c => c === "." || c === "-");

                for (let s = 0; s < simbolos.length; s++) {
                    if (geracao !== minha) return;

                    await bipe(simbolos[s] === "." ? u : u * 3, minha);
                    if (geracao !== minha) return;

                    if (s < simbolos.length - 1) {
                        await esperar(u);
                    }
                }

                if (geracao !== minha) return;
                if (l < letras.length - 1) {
                    await esperar(u * 3);
                }
            }

            if (geracao !== minha) return;
            if (w < palavras.length - 1) {
                await esperar(u * 7);
            }
        }
    };

    const runtime = Scratch.vm && Scratch.vm.runtime;
    if (runtime) {
        if (window.__codigoMorsePararHandler) {
            try { runtime.removeListener("PROJECT_STOP_ALL", window.__codigoMorsePararHandler); } catch (e) {}
        }
        window.__codigoMorsePararHandler = pararTudo;
        runtime.on("PROJECT_STOP_ALL", pararTudo);
    }

    class Extension {
        getInfo() {
            return {
                "id": "codigomorsesom",
                "name": "Código Morse som",
                "color1": "#0fbd8c",
                "blocks": [{
                    "opcode": "tocarMorseEsperar",
                    "text": "tocar som do codigo morse [texto] e espere",
                    "blockType": "command",
                    "arguments": {
                        "texto": {
                            "type": "string",
                            "defaultValue": "--- .-.. .-"
                        }
                    }
                }, {
                    "opcode": "tocarMorse",
                    "text": "tocar som do codigo morse [texto]",
                    "blockType": "command",
                    "arguments": {
                        "texto": {
                            "type": "string",
                            "defaultValue": "--- .-.. .-"
                        }
                    }
                }, {
                    "opcode": "pararMorse",
                    "text": "parar código morse",
                    "blockType": "command"
                }, {
                    "opcode": "mudarVelocidade",
                    "text": "mude velocidade de unidade para [velocidade]",
                    "blockType": "command",
                    "arguments": {
                        "velocidade": {
                            "type": "number",
                            "defaultValue": 0.06
                        }
                    }
                }]
            }
        }

        async tocarMorseEsperar(args) {
            await executarMorse(Scratch.Cast.toString(args.texto));
        }

        tocarMorse(args) {
            executarMorse(Scratch.Cast.toString(args.texto)).catch(e => console.error(e));
        }

        pararMorse() {
            pararTudo();
        }

        mudarVelocidade(args) {
            const v = Scratch.Cast.toNumber(args.velocidade);
            if (v > 0) unidade = v;
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);