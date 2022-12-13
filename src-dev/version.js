/**
 *  GERAR HASHES DOS ARQUIVOS DO WEBAPP
 * 
 * Basicamente, o arquivo version.json gerado será
 * utilizado pelo aplicativo para determinar
 * se o download da atualização foi bem sucedido
 * 
 * APENAS MUDAR A VERSÃO DO WEBAPP SE EXECUTAR ESTE ARQUIVO
 */
import glob from "glob";
import path from "node:path";
import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from "node:fs";

// ATUALIZAR AQUI OS VALORES
const APPVERSION = "1.6";
const WEBAPPVERSION = 2;

// Caminho dos arquivos necessários para o aplicativo funcionar
const files = [
    "icons/*"
    ,"exemplos/*"
    ,"avaliar.html"
    ,"portugol.css"
    ,"dist/ace.js"
    ,"dist/main.js"
    ,"index.html"
];

const web_app_files = [];

console.log(path.resolve());

for(let f of files) {
    let matches = glob.sync(f,{root:path.resolve()});
    if(matches) for(let mf of matches) {
        web_app_files.push({file:mf});
    }
}

for(let row of web_app_files) {
    let arquivo = readFileSync(row.file);
    let hash = createHash("md5").update(arquivo).digest("hex");
    row.md5 = hash;
}

const versionFileJson = {
    "version":APPVERSION,
    "web_app_version":WEBAPPVERSION,
    "web_app_files": web_app_files
};

const resultVersionConfig = JSON.stringify(versionFileJson,null,2);

console.log(resultVersionConfig);

writeFileSync("version.json",resultVersionConfig,"utf-8");

