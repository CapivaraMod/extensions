// Name: Matrix
// ID: matrix
// Description: A Matrix-style text effect for Scratch.
// By: CapivaraMod
// License: MIT AND LGPL-3.0

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('A extensão Matrix precisa rodar fora da sandbox');
  }

  const runtime = Scratch.vm.runtime;
  const effects = new Map();
  const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFZ:.=*+-<>';

  const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const parseColor = (value) => {
    const text = String(value).trim();
    if (/^#[0-9a-fA-F]{6}$/.test(text)) return text;
    if (/^#[0-9a-fA-F]{3}$/.test(text)) {
      return '#' + text[1] + text[1] + text[2] + text[2] + text[3] + text[3];
    }
    return '#00ff41';
  };

  const buildMask = (text, width, height, size) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const lines = String(text).split('\n');
    let fontSize = Math.floor(height / Math.max(lines.length, 1));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (;;) {
      ctx.font = 'bold ' + fontSize + 'px monospace';
      let widest = 0;
      for (const line of lines) widest = Math.max(widest, ctx.measureText(line).width);
      if ((widest <= width * 0.94 && fontSize * lines.length <= height * 0.94) || fontSize <= 6) break;
      fontSize -= 2;
    }
    ctx.fillStyle = '#ffffff';
    const lineHeight = fontSize * 1.05;
    const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
    const data = ctx.getImageData(0, 0, width, height).data;
    const cols = Math.floor(width / size);
    const rows = Math.floor(height / size);
    const mask = new Uint8Array(cols * rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let hits = 0;
        let total = 0;
        for (let dy = 0; dy < size; dy += 2) {
          for (let dx = 0; dx < size; dx += 2) {
            const x = Math.min(width - 1, c * size + dx);
            const y = Math.min(height - 1, r * size + dy);
            total++;
            if (data[(y * width + x) * 4 + 3] > 100) hits++;
          }
        }
        if (hits / total > 0.35) mask[r * cols + c] = 1;
      }
    }
    return { mask, cols, rows };
  };

  const stopEffect = (targetId) => {
    const effect = effects.get(targetId);
    if (!effect) return;
    effect.active = false;
    cancelAnimationFrame(effect.frame);
    if (effect.cleanup) effect.cleanup();
    const renderer = runtime.renderer;
    if (renderer && effect.skinId !== null) {
      renderer.destroySkin(effect.skinId);
    }
    const target = runtime.getTargetById(targetId);
    if (target) {
      target.setCostume(target.currentCostume);
      runtime.requestRedraw();
    }
    effects.delete(targetId);
  };

  const stopAll = () => {
    for (const id of Array.from(effects.keys())) stopEffect(id);
  };

  runtime.on('PROJECT_STOP_ALL', stopAll);

  const startEffect = (target, text, width, height, size, color, textColor, speed) => {
    const renderer = runtime.renderer;
    if (!renderer || !target || target.drawableID === undefined) return;
    stopEffect(target.id);

    width = clamp(Math.round(width) || 480, 32, 1920);
    height = clamp(Math.round(height) || 360, 32, 1080);
    size = clamp(Math.round(size) || 14, 6, 96);
    speed = clamp(speed || 1, 0.1, 10);

    const built = buildMask(text, width, height, size);
    const cols = built.cols;
    const rows = built.rows;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const brightness = new Float32Array(cols * rows);
    const chars = new Array(cols * rows);
    for (let i = 0; i < chars.length; i++) chars[i] = randomGlyph();

    const heads = new Float32Array(cols);
    const speeds = new Float32Array(cols);
    for (let c = 0; c < cols; c++) {
      heads[c] = -Math.random() * rows * 1.5;
      speeds[c] = 0.25 + Math.random() * 0.6;
    }

    const skinId = renderer.createBitmapSkin(canvas, 1, [width / 2, height / 2]);
    renderer.updateDrawableSkinId(target.drawableID, skinId);

    const effect = {
      active: true,
      frame: 0,
      skinId,
      speed
    };
    effects.set(target.id, effect);

    const offsetX = (width - cols * size) / 2;
    const offsetY = (height - rows * size) / 2;
    let last = performance.now();
    let accumulator = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = 'bold ' + size + 'px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c;
          const level = brightness[index];
          if (level < 0.03) continue;
          const x = offsetX + c * size + size / 2;
          const y = offsetY + r * size + size / 2;
          if (level > 0.97 && !built.mask[index]) {
            ctx.fillStyle = '#e8ffe8';
            ctx.globalAlpha = 1;
          } else if (built.mask[index] && level > 0.6) {
            ctx.fillStyle = textColor;
            ctx.globalAlpha = 1;
          } else {
            ctx.fillStyle = color;
            ctx.globalAlpha = clamp(level, 0, 1);
          }
          ctx.fillText(chars[index], x, y);
        }
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      for (let c = 0; c < cols; c++) {
        heads[c] += speeds[c] * effect.speed;
        const row = Math.floor(heads[c]);
        if (row >= 0 && row < rows) {
          const index = row * cols + c;
          brightness[index] = 1;
          chars[index] = randomGlyph();
        }
        if (heads[c] > rows + Math.random() * rows * 0.6) {
          heads[c] = -Math.random() * rows * 0.5;
          speeds[c] = 0.25 + Math.random() * 0.6;
        }
      }
      for (let i = 0; i < brightness.length; i++) {
        if (built.mask[i]) {
          if (brightness[i] > 0.62) {
            brightness[i] = Math.max(0.62, brightness[i] - 0.01);
          }
          if (brightness[i] > 0.6 && Math.random() < 0.004) {
            chars[i] = randomGlyph();
          }
        } else {
          brightness[i] *= 0.93;
        }
      }
    };

    const loop = (now) => {
      if (!effect.active) return;
      // Se o alvo foi apagado, encerra o efeito
      if (!runtime.getTargetById(target.id)) {
        stopEffect(target.id);
        return;
      }
      // Limita o tempo decorrido: ao voltar de outra aba o delta seria enorme
      // e o efeito rodaria acelerado tentando "recuperar" o tempo perdido.
      const delta = Math.min(now - last, 100);
      last = now;
      accumulator += delta;
      let guard = 0;
      while (accumulator >= 33 && guard < 4) {
        step();
        accumulator -= 33;
        guard++;
      }
      // Descarta o atraso que sobrar em vez de acumular
      if (accumulator >= 33) accumulator = 0;
      draw();
      renderer.updateBitmapSkin(skinId, canvas, 1, [width / 2, height / 2]);
      runtime.requestRedraw();
      effect.frame = requestAnimationFrame(loop);
    };

    // Ao voltar para a aba, zera o relógio para não haver salto
    const onVisibility = () => {
      if (!document.hidden) {
        last = performance.now();
        accumulator = 0;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    effect.cleanup = () => document.removeEventListener('visibilitychange', onVisibility);

    effect.frame = requestAnimationFrame(loop);
  };

  class MatrixExtension {
    getInfo() {
      return {
        id: 'matrix',
        name: 'Matrix',
        color1: '#003b12',
        blocks: [
          {
            opcode: 'start',
            blockType: Scratch.BlockType.COMMAND,
            text: 'iniciar matrix com texto [TEXT] largura [WIDTH] altura [HEIGHT] tamanho [SIZE] cor da chuva [COLOR] cor do texto [TEXTCOLOR]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'MATRIX' },
              WIDTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 480 },
              HEIGHT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 360 },
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 14 },
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#00ff41' },
              TEXTCOLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ffffff' }
            }
          },
          {
            opcode: 'setSpeed',
            blockType: Scratch.BlockType.COMMAND,
            text: 'definir velocidade da chuva para [SPEED]',
            arguments: {
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'stop',
            blockType: Scratch.BlockType.COMMAND,
            text: 'parar matrix'
          },
          {
            opcode: 'stopAll',
            blockType: Scratch.BlockType.COMMAND,
            text: 'parar todos os efeitos matrix'
          }
        ]
      };
    }

    start(args, util) {
      startEffect(
        util.target,
        Scratch.Cast.toString(args.TEXT),
        Scratch.Cast.toNumber(args.WIDTH),
        Scratch.Cast.toNumber(args.HEIGHT),
        Scratch.Cast.toNumber(args.SIZE),
        parseColor(args.COLOR),
        parseColor(args.TEXTCOLOR),
        1
      );
    }

    setSpeed(args, util) {
      const effect = effects.get(util.target.id);
      if (effect) effect.speed = clamp(Scratch.Cast.toNumber(args.SPEED) || 1, 0.1, 10);
    }

    stop(args, util) {
      stopEffect(util.target.id);
    }

    stopAll() {
      stopAll();
    }
  }

  Scratch.extensions.register(new MatrixExtension());
})(Scratch);