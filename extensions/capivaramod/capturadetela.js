// Name: Screenshot
// ID: screenshot
// Description: adds new blocks to take screenshots of the stage.
// By: CapivaraMod
// License: MIT AND LGPL-3.0

// 67
(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('A extensão "Captura de Tela" precisa ser carregada sem sandbox (unsandboxed).');
    }

    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const Cast = Scratch.Cast;

    const MIME = { png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp' };

    const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

    class ScreenCapture {
        constructor() {
            this.original = '';
            this.img = null;
            this.W = 0;
            this.H = 0;
            this.result = '';
            this.resW = 0;
            this.resH = 0;
            this.format = 'png';
            this.quality = 0.92;
        }

        getInfo() {
            return {
                "menuIconURI": "data:image/png;base64,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",
                id: 'screencapture',
                name: 'Captura de Tela',
                color1: '#3d8fd1',
                color2: '#2f77b0',
                blocks: [
                    {
                        opcode: 'takePhoto',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'capturar tela'
                    },
                    {
                        opcode: 'cropCoords',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'recortar captura de x: [X1] y: [Y1] até x: [X2] y: [Y2]',
                        arguments: {
                            X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: -100 },
                            Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
                            X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
                            Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: -100 }
                        }
                    },
                    '---',
                    {
                        opcode: 'downloadPhoto',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'baixar captura como [NAME]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'captura' }
                        }
                    },
                    {
                        opcode: 'getDataURL',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'captura (data URL)',
                        disableMonitor: true
                    },
                    {
                        opcode: 'getWidth',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'largura da captura'
                    },
                    {
                        opcode: 'getHeight',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'altura da captura'
                    },
                    {
                        opcode: 'hasPhoto',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'existe captura?'
                    },
                    '---',
                    {
                        opcode: 'clearPhoto',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'limpar captura'
                    }
                ],
            };
        }

        _stageSize() {
            return {
                w: runtime.stageWidth || 480,
                h: runtime.stageHeight || 360
            };
        }

        _snapshot() {
            return new Promise((resolve, reject) => {
                const renderer = runtime.renderer;
                if (!renderer) {
                    reject(new Error('Renderer indisponível'));
                    return;
                }
                let done = false;
                const finish = (fn, v) => {
                    if (done) return;
                    done = true;
                    clearTimeout(timer);
                    fn(v);
                };
                const timer = setTimeout(() => {

                    try {
                        renderer.draw();
                        const url = renderer.canvas.toDataURL('image/png');
                        if (url && url.length > 32) {
                            finish(resolve, url);
                            return;
                        }
                    } catch (e) { }
                    finish(reject, new Error('Tempo esgotado ao capturar a tela'));
                }, 1500);

                try {
                    renderer.requestSnapshot((url) => finish(resolve, url));
                    if (typeof runtime.requestRedraw === 'function') runtime.requestRedraw();
                    renderer.draw();
                } catch (e) {
                    finish(reject, e);
                }
            });
        }

        _loadImage(src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Falha ao carregar a imagem'));
                img.src = src;
            });
        }

        async _capture() {
            try {
                const url = await this._snapshot();
                const img = await this._loadImage(url);
                this.original = url;
                this.img = img;
                this.W = img.naturalWidth;
                this.H = img.naturalHeight;
                this._encode(0, 0, this.W, this.H);
                return true;
            } catch (e) {
                console.warn('[Captura de Tela]', e);
                return false;
            }
        }

        _encode(sx, sy, sw, sh) {
            if (!this.img) return;
            sx = clamp(Math.round(sx), 0, this.W - 1);
            sy = clamp(Math.round(sy), 0, this.H - 1);
            sw = clamp(Math.round(sw), 1, this.W - sx);
            sh = clamp(Math.round(sh), 1, this.H - sy);

            const canvas = document.createElement('canvas');
            canvas.width = sw;
            canvas.height = sh;
            const ctx = canvas.getContext('2d');
            const mime = MIME[this.format] || MIME.png;
            if (mime !== MIME.png) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, sw, sh);
            }
            ctx.drawImage(this.img, sx, sy, sw, sh, 0, 0, sw, sh);
            this.result = canvas.toDataURL(mime, this.quality);
            this.resW = sw;
            this.resH = sh;
        }

        async takePhoto() {
            await this._capture();
        }

        cropCoords(args) {
            if (!this.img) return;
            const { w: sw, h: sh } = this._stageSize();
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);

            const toPx = (x) => ((x + sw / 2) / sw) * this.W;
            const toPy = (y) => ((sh / 2 - y) / sh) * this.H;

            const left = clamp(Math.min(toPx(x1), toPx(x2)), 0, this.W);
            const right = clamp(Math.max(toPx(x1), toPx(x2)), 0, this.W);
            const top = clamp(Math.min(toPy(y1), toPy(y2)), 0, this.H);
            const bottom = clamp(Math.max(toPy(y1), toPy(y2)), 0, this.H);

            this._encode(left, top, right - left, bottom - top);
        }

        downloadPhoto(args) {
            if (!this.result) return;
            try {
                const m = /^data:([^;,]+)(;base64)?,/.exec(this.result);
                if (!m) return;
                const mime = m[1];
                const ext = mime === 'image/jpeg' ? 'jpg' : mime === 'image/webp' ? 'webp' : 'png';

                const bin = atob(this.result.slice(m[0].length));
                const bytes = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
                const blob = new Blob([bytes], { type: mime });

                let name = Cast.toString(args.NAME).replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').trim();
                name = name.replace(/\.(png|jpe?g|webp)$/i, '') || 'captura';

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = name + '.' + ext;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    if (a.parentNode) a.parentNode.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 1000);
            } catch (e) {
                console.warn('[Captura de Tela] Falha ao baixar', e);
            }
        }

        getDataURL() {
            return this.result;
        }

        getWidth() {
            return this.resW;
        }

        getHeight() {
            return this.resH;
        }

        hasPhoto() {
            return !!this.result;
        }


        clearPhoto() {
            this.original = '';
            this.img = null;
            this.W = this.H = this.resW = this.resH = 0;
            this.result = '';
        }
    }

    Scratch.extensions.register(new ScreenCapture());
})(Scratch);