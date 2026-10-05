// Name: Extra Motion
// ID: movimentacaoextra
// Description: adds extra movement blocks.
// By: CapivaraMod
// License: MIT AND LGPL-3.0

(function (Scratch) {
    'use strict';

    // 67

    if (!Scratch.extensions.unsandboxed) {
        alert('This extension needs to be unsandboxed to run!');
        return;
    }

    const vm = Scratch.vm;
    const Cast = Scratch.Cast;
    const num = (v) => Cast.toNumber(v);
    const DEG = Math.PI / 180;

    const getTarget = (util) =>
        (util && util.target) ||
        vm.runtime.getEditingTarget() ||
        vm.runtime.targets.find((t) => !t.isStage);

    const mouseX = () => vm.runtime.ioDevices.mouse.getScratchX();
    const mouseY = () => vm.runtime.ioDevices.mouse.getScratchY();

    const easings = {
        linear: (t) => t,
        in: (t) => t * t,
        out: (t) => 1 - (1 - t) * (1 - t),
        inout: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
        elastic: (t) =>
            t === 0 || t === 1
                ? t
                : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
    };

    const moveInAngle = (t, steps, angle) => {
        const r = (90 - angle) * DEG;
        t.setXY(t.x + steps * Math.cos(r), t.y + steps * Math.sin(r));
    };

    class MovimentoExtra {
        getInfo() {
            return {
                "menuIconURI": "data:image/png;base64,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",
                id: 'MovimentoExtra',
                name: 'Movimento Extra',
                color1: '#4C97FF',
                color2: '#4280D7',
                color3: '#3373CC',
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: 'Diagonais' },
                    {
                        opcode: 'diagUpRight',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Mova [N] passos na diagonal (Cima Direita)',
                        arguments: { N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 } }
                    },
                    {
                        opcode: 'diagUpLeft',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Mova [N] passos na diagonal (Cima Esquerda)',
                        arguments: { N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 } }
                    },
                    {
                        opcode: 'diagDownRight',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Mova [N] passos na diagonal (Baixo Direita)',
                        arguments: { N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 } }
                    },
                    {
                        opcode: 'diagDownLeft',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Mova [N] passos na diagonal (Baixo Esquerda)',
                        arguments: { N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 } }
                    },

                    { blockType: Scratch.BlockType.LABEL, text: 'Giros' },
                    {
                        opcode: 'spinAroundMouse',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'gire ao redor do mouse na velocidade: [SPEED] na distância: [DIST]',
                        arguments: {
                            SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 },
                            DIST: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 }
                        }
                    },
                    {
                        opcode: 'spinAroundXY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'gire em X: [X] e em Y: [Y] com velocidade: [SPEED] com distancia: [DIST]',
                        arguments: {
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 },
                            DIST: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 }
                        }
                    },
                    {
                        opcode: 'goPolar',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'ir para o ponto X: [X] Y: [Y] com raio [R] e ângulo [A]',
                        arguments: {
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
                            A: { type: Scratch.ArgumentType.NUMBER, defaultValue: 90 }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: 'Suavizado' },
                    {
                        opcode: 'smoothTo',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'aproxime suavemente de X: [X] Y: [Y] fator [F] (0-1)',
                        arguments: {
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            F: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.1 }
                        }
                    },
                    {
                        opcode: 'smoothToMouse',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'siga o mouse suavemente fator [F] (0-1)',
                        arguments: { F: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.1 } }
                    },
                    {
                        opcode: 'glideEasing',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'deslize por [S] segs até X: [X] Y: [Y] com [EASING]',
                        arguments: {
                            S: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            EASING: { type: Scratch.ArgumentType.STRING, menu: 'EASING_MENU', defaultValue: 'inout' }
                        }
                    },

                    { blockType: Scratch.BlockType.LABEL, text: 'Posição' },
                    {
                        opcode: 'mirror',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'espelhe a posição no [AXIS]',
                        arguments: {
                            AXIS: { type: Scratch.ArgumentType.STRING, menu: 'AXIS_MENU', defaultValue: 'x' }
                        }
                    },
                    {
                        opcode: 'clampPos',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'limite posição: X de [X1] a [X2] e Y de [Y1] a [Y2]',
                        arguments: {
                            X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: -100 },
                            X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
                            Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: -100 },
                            Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
                        }
                    },
                    {
                        opcode: 'sineWave',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'defina Y em onda senoidal: base [BASE] amplitude [AMP] frequência [FREQ]',
                        arguments: {
                            BASE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            AMP: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
                            FREQ: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
                        }
                    },
                ],
                menus: {
                    EASING_MENU: {
                        acceptReporters: true,
                        items: [
                            { text: 'linear', value: 'linear' },
                            { text: 'entrada suave', value: 'in' },
                            { text: 'saída suave', value: 'out' },
                            { text: 'entrada e saída suave', value: 'inout' },
                            { text: 'elástico', value: 'elastic' }
                        ]
                    },
                    AXIS_MENU: {
                        acceptReporters: true,
                        items: [
                            { text: 'eixo X', value: 'x' },
                            { text: 'eixo Y', value: 'y' },
                            { text: 'centro (X e Y)', value: 'both' }
                        ]
                    }
                }
            };
        }

        diagUpRight(args, util) {
            const t = getTarget(util), n = num(args.N);
            t.setXY(t.x + n, t.y + n);
        }
        diagUpLeft(args, util) {
            const t = getTarget(util), n = num(args.N);
            t.setXY(t.x - n, t.y + n);
        }
        diagDownRight(args, util) {
            const t = getTarget(util), n = num(args.N);
            t.setXY(t.x + n, t.y - n);
        }
        diagDownLeft(args, util) {
            const t = getTarget(util), n = num(args.N);
            t.setXY(t.x - n, t.y - n);
        }
        spinAroundMouse(args, util) {
            const t = getTarget(util);
            t.setXY(mouseX(), mouseY());
            t.setDirection(t.direction + num(args.SPEED) / 5);
            moveInAngle(t, num(args.DIST) * 5, t.direction);
        }
        spinAroundXY(args, util) {
            const t = getTarget(util);
            t.setXY(num(args.X), num(args.Y));
            t.setDirection(t.direction + num(args.SPEED) / 5);
            moveInAngle(t, num(args.DIST) * 5, t.direction);
        }
        goPolar(args, util) {
            const t = getTarget(util);
            const r = (90 - num(args.A)) * DEG;
            t.setXY(num(args.X) + num(args.R) * Math.cos(r), num(args.Y) + num(args.R) * Math.sin(r));
        }
        smoothTo(args, util) {
            const t = getTarget(util);
            const f = Math.min(1, Math.max(0, num(args.F)));
            t.setXY(t.x + (num(args.X) - t.x) * f, t.y + (num(args.Y) - t.y) * f);
        }
        smoothToMouse(args, util) {
            const t = getTarget(util);
            const f = Math.min(1, Math.max(0, num(args.F)));
            t.setXY(t.x + (mouseX() - t.x) * f, t.y + (mouseY() - t.y) * f);
        }
        async glideEasing(args, util) {
            const t = getTarget(util);
            const ms = num(args.S) * 1000;
            const x1 = num(args.X), y1 = num(args.Y);
            if (ms <= 0) {
                t.setXY(x1, y1);
                return;
            }
            const ease = easings[Cast.toString(args.EASING)] || easings.linear;
            const x0 = t.x, y0 = t.y;
            const start = performance.now();
            while (true) {
                const p = Math.min(1, (performance.now() - start) / ms);
                const e = ease(p);
                t.setXY(x0 + (x1 - x0) * e, y0 + (y1 - y0) * e);
                if (p >= 1) break;
                await new Promise((r) => requestAnimationFrame(r));
            }
        }

        mirror(args, util) {
            const t = getTarget(util);
            const axis = Cast.toString(args.AXIS);
            if (axis === 'x') t.setXY(-t.x, t.y);
            else if (axis === 'y') t.setXY(t.x, -t.y);
            else t.setXY(-t.x, -t.y);
        }
        clampPos(args, util) {
            const t = getTarget(util);
            const x1 = Math.min(num(args.X1), num(args.X2)), x2 = Math.max(num(args.X1), num(args.X2));
            const y1 = Math.min(num(args.Y1), num(args.Y2)), y2 = Math.max(num(args.Y1), num(args.Y2));
            t.setXY(Math.min(x2, Math.max(x1, t.x)), Math.min(y2, Math.max(y1, t.y)));
        }
        sineWave(args, util) {
            const t = getTarget(util);
            t.setXY(t.x, num(args.BASE) + num(args.AMP) * Math.sin(t.x * num(args.FREQ) * DEG));
        }

    }

    Scratch.extensions.register(new MovimentoExtra());
})(Scratch);

