// Name: Morse Code Translator (modified version)
// ID: morsecode
// Description: Original created by https://github.com/Flappy25.
// By: Flappy25 (original version), Modified by CapivaraMod
// License: MIT AND LGPL-3.0

class MorseCodeTranslator {
    constructor() {
        this.morseCodeMap = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
            'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
            'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
            '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
            '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
            ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
            ' ': '/'
        };

        this.reverseMorseCodeMap = {};
        for (const key in this.morseCodeMap) {
            if (this.morseCodeMap.hasOwnProperty(key)) {
                this.reverseMorseCodeMap[this.morseCodeMap[key]] = key;
            }
        }
    }

    getInfo() {
        return {
            id: 'morsecode',
            name: 'Tradutor de Código Morse',
            blocks: [
                {
                    opcode: 'textToMorseCode',
                    blockType: 'reporter',
                    text: 'traduzir [text] para código Morse',
                    arguments: {
                        text: {
                            type: 'string',
                            defaultValue: 'Ola'
                        }
                    }
                },
                {
                    opcode: 'morseCodeToText',
                    blockType: 'reporter',
                    text: 'traduzir [morseCode] para texto',
                    arguments: {
                        morseCode: {
                            type: 'string',
                            defaultValue: '--- .-.. .-'
                        }
                    }
                }
            ]
        };
    }

    textToMorseCode(args) {
        const text = args.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
        let morseCode = '';
        for (let i = 0; i < text.length; i++) {
            const character = text[i];
            if (this.morseCodeMap.hasOwnProperty(character)) {
                morseCode += this.morseCodeMap[character] + ' ';
            }
        }
        return morseCode.trim();
    }

    morseCodeToText(args) {
        const morseCode = args.morseCode.trim();
        const morseCodeWords = morseCode.split(' / ');
        let text = '';
        for (let i = 0; i < morseCodeWords.length; i++) {
            const morseCodeWord = morseCodeWords[i];
            const morseCodeChars = morseCodeWord.split(' ');
            for (let j = 0; j < morseCodeChars.length; j++) {
                const morseCodeChar = morseCodeChars[j];
                if (this.reverseMorseCodeMap.hasOwnProperty(morseCodeChar)) {
                    text += this.reverseMorseCodeMap[morseCodeChar];
                }
            }
            text += ' ';
        }
        return text.trim();
    }
}

Scratch.extensions.register(new MorseCodeTranslator());