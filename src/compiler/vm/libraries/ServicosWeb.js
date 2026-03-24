import { T_cadeia, T_inteiro, T_parO, T_vazio, T_word } from "../../tokenizer";
import Internet from "./Internet";
import { BibliotecaBase } from "./libHelper";

export default class ServicosWeb extends BibliotecaBase {
    /**
     * @param {Internet} internet
     */
    constructor(internet) {
        super();

        this.internet = internet;
        this.OBTER = 1;
        this.PUBLICAR = 2;
        this.ATUALIZAR = 3;
        this.EXCLUIR = 4;
        this.MODIFICAR = 5;

        // Variável para armazenar as opções de conexão (cabeçalhos, corpo, etc.)
        this.opcoesConexao = null;

        this.members = {
            "OBTER":{id:T_word,type:T_inteiro},
            "PUBLICAR":{id:T_word,type:T_inteiro},
            "ATUALIZAR":{id:T_word,type:T_inteiro},
            "EXCLUIR":{id:T_word,type:T_inteiro},
            "MODIFICAR":{id:T_word,type:T_inteiro},
            // Jeito 1: Abrir conexão e depois fazer requisição
            "abrir_conexao": {id:T_parO,parameters:[{name:"endereco",type:T_cadeia}],type:T_vazio,jsSafe:true},
            "adicionar_cabecalho": {id:T_parO,parameters:[{name:"chave",type:T_cadeia},{name:"valor",type:T_cadeia}],type:T_vazio,jsSafe:true},
            "adicionar_parametros": {id:T_parO,parameters:[{name:"objeto",type:T_cadeia}],type:T_vazio,jsSafe:true},
            "fazer_requisicao": {id:T_parO,parameters:[{name:"metodoHttp",type:T_inteiro}],type:T_cadeia,jsSafe:false},

            // Jeito 2: Fazer requisição diretamente
            // GET
            "obter_dados": {id:T_parO,parameters:[{name:"endereco",type:T_cadeia}],type:T_cadeia,jsSafe:false},
            // POST
            "publicar_dados": {id:T_parO,parameters:[{name:"endereco",type:T_cadeia},{name:"objeto",type:T_cadeia}],type:T_cadeia,jsSafe:false},
            // PATCH
            "modificar_dados": {id:T_parO,parameters:[{name:"endereco",type:T_cadeia},{name:"objeto",type:T_cadeia}],type:T_cadeia,jsSafe:false},
            // PUT
            "atualizar_dados": {id:T_parO,parameters:[{name:"endereco",type:T_cadeia},{name:"objeto",type:T_cadeia}],type:T_cadeia,jsSafe:false},
            // DELETE
            "deletar_dados": {id:T_parO,parameters:[{name:"endereco",type:T_cadeia}],type:T_cadeia,jsSafe:false},
            
        };

        this.resetar();
    }

    resetar() {
        this.opcoesConexao = null;
    }

    abrir_conexao(endereco) {
        this.opcoesConexao = {
            url: endereco,
            headers: {},
            body: null
        };
    }

    adicionar_cabecalho(chave, valor) {
        if (!this.opcoesConexao) {
            throw new Error("Nenhuma conexão aberta. Use abrir_conexao() antes de adicionar cabeçalhos.");
        }
        this.opcoesConexao.headers[chave] = valor;
    }

    adicionar_parametros(objeto) {
        if (!this.opcoesConexao) {
            throw new Error("Nenhuma conexão aberta. Use abrir_conexao() antes de adicionar parâmetros.");
        }
        this.opcoesConexao.body = ""+objeto;
        this.opcoesConexao.headers["Content-Type"] = "application/json";
    }

    fazer_requisicao(metodoHttp) {
        if (!this.opcoesConexao) {
            throw new Error("Nenhuma conexão aberta. Use abrir_conexao() antes de fazer uma requisição.");
        }
        if((metodoHttp == this.OBTER || metodoHttp == this.EXCLUIR) && this.opcoesConexao.body) {
            throw new Error("Métodos OBTER e EXCLUIR não devem ter corpo na requisição.");
        }
        let metodoStr;
        switch(metodoHttp) {
            case this.OBTER: metodoStr = "GET"; break;
            case this.PUBLICAR: metodoStr = "POST"; break;
            case this.ATUALIZAR: metodoStr = "PUT"; break;
            case this.EXCLUIR: metodoStr = "DELETE"; break;
            case this.MODIFICAR: metodoStr = "PATCH"; break;
            default: throw new Error("Método HTTP inválido.");
        }
        const { url, headers, body } = this.opcoesConexao;
        const result = this.internet._fazer_requisicao(url, metodoStr, { headers, body });
        if (result.value) {
            this.opcoesConexao = null; // Resetar após a requisição
        }
        return result;
    }

    obter_dados(endereco) {
		return this.internet._fazer_requisicao(endereco, "GET", {
            credentials: 'include', // Incluir cookies e credenciais na requisição
        });
    }

    publicar_dados(endereco, objeto) {
        return this.internet._fazer_requisicao(endereco, "POST", {
            body: objeto,
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    modificar_dados(endereco, objeto) {
        return this.internet._fazer_requisicao(endereco, "PATCH", {
            body: objeto,
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    atualizar_dados(endereco, objeto) {
        return this.internet._fazer_requisicao(endereco, "PUT", {
            body: objeto,
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    deletar_dados(endereco) {
        return this.internet._fazer_requisicao(endereco, "DELETE", {
            credentials: 'include'
        });
    }
}