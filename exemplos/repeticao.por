programa
{
	funcao inicio ()
	{
		escreva("Insira o número para contar:")
		
		inteiro numero
		leia(numero)
		
		escreva("Contando de "+numero+" até 1:\n")
		
		// o enquanto irá repetir esta parte do código, até que a condição dê falso.
		// por isso é chamado enquanto, pois ele repete ENQUANTO for verdadeiro.
		// a condição deve ser escolhida para que ele pare em algum momento e não repita para sempre
		enquanto(numero > 0)
		{
			escreva(numero+"\n")
			
			// essa linha faz com que o valor da variável numero seja ela mesmo menos 1
			// ou seja diminui o valor, mude para + e irá contar para cima
			numero = numero - 1
		}
		escreva("Fim da contagem")
	}
}