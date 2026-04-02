programa
{
	inclua biblioteca Texto --> t
	
	funcao inicio()
	{
		cadeia frase
		escreva("Digite um texto para inverter: ")
		leia(frase)

		escreva("Invertido: ", inverter(frase), "\n")
	}

	funcao cadeia inverter(cadeia txt)
	{
		inteiro tamanho = t.numero_caracteres(txt)
		// 1. Caso Base: 
		// Se o texto tiver 1 ou 0 caracteres,
		// ele já está "invertido"
		se (tamanho <= 1)
		{
			retorne txt
		}
		senao
		{
			// Divide a última letra do texto
			cadeia ultima_letra = t.extrair_subtexto(txt, tamanho - 1, tamanho)
			cadeia restante = t.extrair_subtexto(txt, 0, tamanho - 1)

			// Retorna a última letra no início
			// e chama inverter recursivamente
			retorne ultima_letra + inverter(restante)
		}
	}
}