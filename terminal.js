/* eslint-env node */
// Ponto de partida para executar um programa do portugol direto
// Obtendo o código do programa a ser executado de um arquivo ou da entrada de dados

import { readFile } from 'fs/promises';
import { createInterface } from 'readline/promises';
import PortugolRuntime from "./src/compiler/vm/portugolrun.js";

// Obter o código do programa a ser executado
let programa = `
programa {
    funcao inicio() {
        escreva("Olá mundo no Portugol!\\n")
    }
}
`;

let filePrograma = undefined;
let ajuda =  false;
let escreverTempo = true;
let compilarJS = false;

let argumentos = process.argv.slice(2);
for(let i = 0; i < argumentos.length; i++) {
    let key = argumentos[i];
    
    switch(key) {
        case "-f":
        case "--file": 
        case "-p":
        case "--programa": 
            filePrograma = argumentos[++i];
            break;
        case "-t":
        case "--tempo": 
            escreverTempo = parseInt(argumentos[++i]) != 0;
            break;
        case "--js": 
            compilarJS = parseInt(argumentos[++i]) != 0;
            break;
        case "-h":
        case "--help":
        case "-a":
        case "--ajuda":
            ajuda = true;
        break;
    }
}

if(ajuda) {
    console.log("node terminal.js [--programa <arquivo>] [--tempo <0|1>] [--js <0|1>] [--ajuda]");
    console.log("programa: arquivo com o código a ser executado");
    console.log("Se não for informado, o programa padrão será executado");
    console.log("tempo: se deve ou não imprimir o tempo de execução");
    console.log("js: se deve ou não compilar para JS");
    console.log("ajuda: exibe esta mensagem");
    process.exit(0);
}

if(filePrograma) {
    programa = await readFile(new URL(filePrograma, import.meta.url),{encoding:"utf8"});
}

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});
try {
    let saidaEscrita = "";
    const run = new PortugolRuntime({
        value:"",
        leia: async () => {
            const valorLido = await readline.question("");
            saidaEscrita += valorLido+"\n";
            return valorLido+"\n";
        }
    });
    run.escrever_tempo = escreverTempo;
    run.escrever_erros = false;

    // Sem gráficos
    run.iniciarBibliotecas(false,false,false,false,false);

    const compilado = run.compilar(programa,false,compilarJS);

    if(!compilado.success) throw "Erro na compilação";

    const escreverSaida = () => {
        const saida = run.div_saida.value;
        if(saidaEscrita.length == saida.length) return;

        if(saida.length < saidaEscrita.length) {
            // Para não pular linha
            process.stdout.write(saida);
            saidaEscrita = saida;
        } else {
            process.stdout.write(saida.substring(saidaEscrita.length, saida.length));
            saidaEscrita = saida;
        }
    };
    let saidaListener = setInterval(escreverSaida,100);

    try {
        let saida = await run.executar(programa,compilado,false);

        // escreve a saida uma ultima vez, é como um flush()
        escreverSaida();
        console.log();
    } finally {
        clearInterval(saidaListener);
    }
} finally {
    readline.close();
}