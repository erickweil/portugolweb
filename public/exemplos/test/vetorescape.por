programa
{
	
	funcao inicio()
	{
		cadeia elemento1 = "Funciona o tab \t, mas a barra é desse jeito:\\\\ e aspas \\\"assim\\\"  "
	
		cadeia teste[] = {
			"Funciona o tab \t, mas a barra é desse jeito:\\\\ e aspas \\\"assim\\\"  ",
			elemento1
			//,"Não funciona a quebra de linha:\nAçaí\nBanana\nCaqui"
			//,"Não funciona usar aspas \"Assim\" "
			//,"Não funciona a \\barra invertida\\ "
		}

		
		escreva("Usando o escreva:\n")
		escreva("Funciona o tab \t, mas a barra é desse jeito:\\\\ e aspas \\\"assim\\\"  ")
		
		escreva("\n\n")
		
		escreva("Acessando a Matriz elemento 0:\n")
		escreva(teste[0])

		escreva("\n\n")
		
		escreva("Acessando a Matriz elemento 1:\n")
		escreva(teste[1])
		
	}
}
/*---
Usando o escreva:
Funciona o tab 	, mas a barra é desse jeito:\\ e aspas \"assim\"  

Acessando a Matriz elemento 0:
Funciona o tab 	, mas a barra é desse jeito:\\ e aspas \"assim\"  

Acessando a Matriz elemento 1:
Funciona o tab 	, mas a barra é desse jeito:\\ e aspas \"assim\"  
---*/