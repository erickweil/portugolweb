programa
{
	// Aqui inclui a biblioteca que
	// permite calcular raiz quadrada
	inclua biblioteca Matematica --> m
	
	funcao inicio ()
	{
		real a, b, c
		
		escreva("Calculadora Delta e Bhaskara \n")
		escreva("aX² + bX + c = 0 \n")
		escreva("\n")
		escreva("Insira os valores a, b e c: \n")
		escreva("a: ")
		leia(a)
		escreva("b: ")
		leia(b)
		escreva("c: ")
		leia(c)
		
		real delta = b*b - 4*a*c
		// Termina o programa caso o delta
		// seja negativo, pois não há como 
		// calcular raiz quadrada de número negativo
		se(delta < 0)
		{
			escreva("Delta negativo, não há soluções dentro dos reais \n")
			retorne
		}
	
		// Utilizando a biblioteca Matematica
		// para calcular raiz quadrada
		real raizDelta = m.raiz(delta, 2)
		
		// Os parênteses são importantes aqui
		// Eles definem a ordem das operações
		real x1 = (-b + raizDelta) / (2*a)
		real x2 = (-b - raizDelta) / (2*a)
		
		// Usando caracteres especiais
		// \t -> tab, quatro espaços alinhados
		// \" -> aspas dentro de aspas
		escreva("---------------- \n")
		escreva("Soluções:\n")
		escreva("X' \t", x1, "\n")
		escreva("X\" \t", x2, "\n")
	}
}