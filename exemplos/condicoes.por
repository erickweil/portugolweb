programa
{
	funcao inicio ()
	{
		escreva("#############################\n")
		escreva("###### ACESSO RESTRITO ######\n")
		escreva("#############################\n")
		escreva(" \n")
		
		escreva("Senha:")
		cadeia senha
		leia(senha)
		
		// Condições permitem que tenhamos valores verdadeiro ou falso
		// os operadores de comparação são:
		//   ==	    --> para testar se os valores são iguais
		//   <      --> se o valor à esquerda é menor que o da direita
		//   >      --> se o valor à esquerda é maior que o da direita
		
		//   existe também a junção do == com os > e <
		//   <=     --> se o valor à esquerda é menor ou igual ao da direita
		//   >=     --> se o valor à esquerda é maior ou igual ao da direita
		
		
		// aqui temos o 'se', ele permite que de acordo com uma condição, 
		// escolha entre dois trechos de código para executar
		se( senha == "123456" )
		{
			// Esta parte é executada só quando senha == "123456" é verdadeiro
			escreva(" \n")
			escreva("Olá, Seja bem vindo, seu acesso foi autorizado")
		}
		senao
		{
			// Esta parte é executada só quando senha == "123456" é falso
			escreva(" \n")
			escreva("Senha Incorreta. você só tinha uma tentativa, já era!")
		}
	}
}