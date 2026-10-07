// Name: Text Comparison Extension (modified version)
// ID: textcomparison
// Description: Original created by https://github.com/Flappy25.
// By: Flappy25 (original version), Modified by CapivaraMod
// License: none

class TextComparisonExtension {
    getInfo() {
        return {
            id: 'textcomparison',
            name: 'Comparação de Texto',
            blocks: [
                {
                    opcode: 'calculateLevenshteinDistance',
                    blockType: 'reporter',
                    text: 'calcular distância de Levenshtein entre [text1] e [text2]',
                    arguments: {
                        text1: {
                            type: 'string',
                            defaultValue: 'Bolo'
                        },
                        text2: {
                            type: 'string',
                            defaultValue: 'Bol'
                        }
                    }
                },
                {
                    opcode: 'calculateSimilarityScore',
                    blockType: 'reporter',
                    text: 'calcular pontuação de similaridade entre [text1] e [text2]',
                    arguments: {
                        text1: {
                            type: 'string',
                            defaultValue: 'Bolo'
                        },
                        text2: {
                            type: 'string',
                            defaultValue: 'Bol'
                        }
                    }
                }
            ]
        };
    }

    calculateLevenshteinDistance(args) {
        const text1 = args.text1;
        const text2 = args.text2;
        return this.levenshteinDistance(text1, text2);
    }

    calculateSimilarityScore(args) {
        const text1 = args.text1;
        const text2 = args.text2;
        return this.similarityScore(text1, text2);
    }

    levenshteinDistance(text1, text2) {
        const m = text1.length;
        const n = text2.length;

        // Cria uma matriz 2D para armazenar as distâncias de Levenshtein
        const dp = new Array(m + 1);
        for (let i = 0; i <= m; i++) {
            dp[i] = new Array(n + 1);
        }

        // Inicializa a primeira linha e a primeira coluna da matriz
        for (let i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (let j = 0; j <= n; j++) {
            dp[0][j] = j;
        }

        // Calcula as distâncias de Levenshtein
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (text1[i - 1] === text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1, // Remoção
                        dp[i][j - 1] + 1, // Inserção
                        dp[i - 1][j - 1] + 1 // Substituição
                    );
                }
            }
        }

        return dp[m][n];
    }

    similarityScore(text1, text2) {
        const distance = this.levenshteinDistance(text1, text2);
        const maxLength = Math.max(text1.length, text2.length);
        // Dois textos vazios são idênticos (evita divisão por zero)
        if (maxLength === 0) return 1;
        return 1 - distance / maxLength;
    }
}

Scratch.extensions.register(new TextComparisonExtension());