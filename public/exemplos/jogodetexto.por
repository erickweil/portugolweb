programa
{
	inclua biblioteca ServicosWeb --> www
	inclua biblioteca Objetos --> j
	inclua biblioteca Texto --> t
	inclua biblioteca Tipos --> tp
	inclua biblioteca Util
	
	cadeia URL = "https://textadventures.vercel.app"

	inteiro obj_jogo_info = -1
	inteiro obj_jogador = -1
	logico exibir_banner_ola = verdadeiro
	funcao inicio ()
	{
		enquanto(verdadeiro)
		{
			inteiro erro = loop_principal()
			escolha(erro)
			{
				caso OK:
					// OK
				pare
				caso FIM:
					retorne
				pare
				caso ERRO_REQUISICAO:
					escreva("Você precisa fazer login.")
					obj_jogo_info = -1
					obj_jogador = -1
					Objetos.liberar()
					fazer_login()
				pare
			}
		}
	}
	
	inteiro OK = 0
	inteiro FIM = -1
	inteiro ERRO_REQUISICAO = 1
	funcao inteiro loop_principal()
	{
		se(obj_jogo_info == -1 ou obj_jogador == -1) 
		{
			obj_jogo_info = json_parse(www.obter_dados(URL+"/auth/info"))
			obj_jogador = _obj(obj_jogo_info, "jogador")
			se(obj_jogo_info == -1 ou obj_jogador == -1)
			{
				retorne ERRO_REQUISICAO
			}
			exibir_banner_ola = verdadeiro
			
			se(exibir_banner_ola)
			{
				escreva("Olá novamente ", _str(obj_jogador, "username"), "\n")
				escreva("Online última vez em ", _str(obj_jogador, "atualizadoEm"), "\n")
				escreva("\n")
				escreva(_str(obj_jogo_info, "usuariosOnline"), " usuários online agora ", _str(obj_jogo_info, "usuariosCadastrados"), " cadastrados.\n")
				escreva("Digite 'ajuda' ou '?' para ver o que você pode fazer.\n")
				escreva("\n")
				exibir_banner_ola = falso
			}
			
			// Olhar
			inteiro obj_post = j.criar_objeto()
			j.atribuir_propriedade(obj_post, "comando", "")
			cadeia str_post = j.obter_json(obj_post)
			j.liberar_objeto(obj_post)
			
			escreva(www.publicar_dados(URL+"/texto", str_post))
		}
		
		cadeia comando
		escreva(_str(obj_jogador, "username"),"> ")
		leia(comando)
		
		
		inteiro obj_post = j.criar_objeto()
		j.atribuir_propriedade(obj_post, "comando", comando)
		cadeia str_post = j.obter_json(obj_post)
		j.liberar_objeto(obj_post)
		
		escreva(www.publicar_dados(URL+"/texto", str_post))
		
		retorne OK
	}
	
	funcao fazer_login()
	{
		enquanto(verdadeiro)
		{
			cadeia acao
			escreva("Você já possui uma conta? (S/N)\n")
			leia(acao)
			acao = t.caixa_alta(acao)
			se(acao == "S" ou acao == "SIM")
			{
				www.abrir_conexao(URL+"/auth/login")
			}
			senao
			{
				escreva("Ok, vamos criar uma nova conta.\n")
				www.abrir_conexao(URL+"/auth/cadastrar")
			}
			
			cadeia usuario, senha
			escreva("Usuário: ")
			leia(usuario)
			escreva("Senha: ")
			leia(senha)
			
			// Limpar senha né...
			limpa()
			
			
			inteiro body = j.criar_objeto()
			j.atribuir_propriedade(body, "username", usuario)
			j.atribuir_propriedade(body, "password", senha)
			www.adicionar_parametros(j.obter_json(body))
			
			cadeia resultado = www.fazer_requisicao(www.PUBLICAR)
			
			se(t.obter_caracter(resultado, 0) != '{') {
				escreva(resultado, "\n")
				escreva("\nTente novamente. \nObs: Lembre-se que a senha deve ser forte!\n")
			} senao {
				escreva("\nLogin realizado com sucesso!\n")
				retorne
			}
		}
	}
	
	funcao inteiro json_parse(cadeia txt)
	{
		se(t.obter_caracter(txt, 0) != '{') {
			retorne -1
		}
		retorne j.criar_objeto_via_json(txt)
	}
	
	funcao cadeia _str(inteiro endereco, cadeia propriedade)
	{
		se(endereco == -1) retorne ""
		se(nao j.contem_propriedade(endereco, propriedade)) retorne ""
		retorne j.obter_propriedade_tipo_cadeia(endereco, propriedade)
	}
	
	funcao cadeia _str(inteiro endereco, cadeia propriedade, inteiro indice)
	{
		se(endereco == -1) retorne ""
		se(nao j.contem_propriedade(endereco, propriedade)) retorne ""
		se(j.obter_tamanho_vetor_propriedade(endereco, propriedade) <= indice) retorne ""
		retorne j.obter_propriedade_tipo_cadeia_em_vetor(endereco, propriedade, indice)
	}
	
	funcao inteiro _obj(inteiro endereco, cadeia propriedade)
	{
		se(endereco == -1) retorne -1
		se(nao j.contem_propriedade(endereco, propriedade)) retorne -1
		retorne j.obter_propriedade_tipo_objeto(endereco, propriedade)
	}
	
	funcao inteiro _obj(inteiro endereco, cadeia propriedade, inteiro indice)
	{
		se(endereco == -1) retorne -1
		se(nao j.contem_propriedade(endereco, propriedade)) retorne -1
		se(j.obter_tamanho_vetor_propriedade(endereco, propriedade) <= indice) retorne -1
		retorne j.obter_propriedade_tipo_objeto_em_vetor(endereco, propriedade, indice)
	}
}