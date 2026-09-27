// Name: Number Abbreviator
// ID: numberAbbreviator
// Description: Adds a reporter block that converts large numbers into an abbreviated format (e.g., 10928 -> 10.9k)
// By: CapivaraMod
// License: MIT AND LGPL-3.0

const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI5My45MjgiIGhlaWdodD0iOTMuOTI4IiB2aWV3Qm94PSIwLDAsOTMuOTI4LDkzLjkyOCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE5My4wMzYsLTEzMy4wMzYpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0xOTMuMDM2LDE4MGMwLC0yNS45MzcgMjEuMDI3LC00Ni45NjQgNDYuOTY0LC00Ni45NjRjMjUuOTM3LDAgNDYuOTY0LDIxLjAyNyA0Ni45NjQsNDYuOTY0YzAsMjUuOTM3IC0yMS4wMjcsNDYuOTY0IC00Ni45NjQsNDYuOTY0Yy0yNS45MzcsMCAtNDYuOTY0LC0yMS4wMjcgLTQ2Ljk2NCwtNDYuOTY0IiBmaWxsPSIjNGQzNTdkIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMTk4Ljg0OCwxODBjMCwtMjIuNzc4IDE4LjQ2NSwtNDEuMjQ0IDQxLjI0NCwtNDEuMjQ0YzIyLjc3OCwwIDQxLjI0NCwxOC40NjYgNDEuMjQ0LDQxLjI0NGMwLDIyLjc3OCAtMTguNDY2LDQxLjI0NCAtNDEuMjQ0LDQxLjI0NGMtMjIuNzc5LDAgLTQxLjI0NCwtMTguNDY2IC00MS4yNDQsLTQxLjI0NCIgZmlsbD0iIzljNmNmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjQuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48cGF0aCBkPSJNMjI5LjIyMjA5LDE3NS4xODE2NGw4LjY5MTk1LC0xMi4xNzI3aDIuOTczNTYiLz48cGF0aCBkPSJNMjQwLjg4NzU5LDE2NC4yNzY5M2wwLjI1MzYsMzIuNzE0MTQiLz48L2c+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6NDYuOTYzOTk5OTk5OTk5OTc6NDYuOTY0LS0+"
class NumberAbbreviatorExtension {
  getInfo() {
    return {
      id: 'numberAbbreviator',
      name: 'Number Abbreviator',
      menuIconURI,
      color1: '#9C6CFF',
      color2: '#7B4FE0',
      color3: '#6A3FD1',
      blocks: [
        {
          opcode: 'abbreviate',
          blockType: Scratch.BlockType.REPORTER,
          text: 'abreviar [NUM]',
          arguments: {
            NUM: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 10928
            }
          }
        },
        {
          opcode: 'abbreviateDecimals',
          blockType: Scratch.BlockType.REPORTER,
          text: 'abreviar [NUM] com [DEC] casas decimais',
          arguments: {
            NUM: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 10928
            },
            DEC: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1
            }
          }
        }
      ]
    };
  }

  _format(num, decimals) {
    num = Number(num);
    if (isNaN(num)) return '0';

    const isNegative = num < 0;
    const abs = Math.abs(num);

    const units = [
      { value: 1e12, symbol: 't' },
      { value: 1e9, symbol: 'b' },
      { value: 1e6, symbol: 'm' },
      { value: 1e3, symbol: 'k' }
    ];

    let result;
    const unit = units.find(u => abs >= u.value);

    if (unit) {
      let n = abs / unit.value;
      n = Math.floor(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
      let str = n.toFixed(decimals);
      str = str.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
      result = str + unit.symbol;
    } else {
      result = String(abs);
    }

    return (isNegative ? '-' : '') + result;
  }

  abbreviate(args) {
    return this._format(args.NUM, 1);
  }

  abbreviateDecimals(args) {
    const dec = Math.max(0, Math.min(5, Math.floor(Number(args.DEC))));
    return this._format(args.NUM, dec);
  }
}

Scratch.extensions.register(new NumberAbbreviatorExtension());