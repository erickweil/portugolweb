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
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";

// ATUALIZAR AQUI OS VALORES
// Qualquer versão antes dessa avisa que é preciso atualizar
// Se a atualização do app não é 'necessária', pode deixar esse numa versão passada
// Assim usuários não serão notificados a cada abertura do app sobre isso
const APPVERSION = "1.7"; 

// Causa o app ser atualizado automaticamente caso seja menor que isso
// Atualizar também o VERSAO_ASSETS_WEBAPP no arquivo VersionChecker.java no aplicativo quando mudar aqui
// Não tem efeito se a versão webapp dos assets for maior... (Não vai desatualizar)
const WEBAPPVERSION = 4; 


const ANDROIDPATH = "android/app/src/main/assets/portugolweb";
// Caminho dos arquivos necessários para o aplicativo funcionar
const files = [
    "icons/*"
    ,"exemplos/*"
    ,"avaliar.html"
    ,"portugol.css"
    ,"dist/ace.js"
    ,"dist/main.js"
    ,"index.html"
    ,"favicon.ico"
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

    console.log("Copiando '"+row.file+"' para '"+path.join(ANDROIDPATH,row.file)+"'");
    copyFileSync(row.file,path.join(ANDROIDPATH,row.file));
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

