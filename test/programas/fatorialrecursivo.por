programa
{
	funcao inicio()
	{
        // Suportar números acima de 2^31 é um bug ou feature?
		para(inteiro i = 0;i<= 10;i++)
		escreva("O fatorial de ", i, ": ", fatorial(i), "\n") 
	}
	
	funcao inteiro fatorial(inteiro numero)
	{
		se (numero == 1 ou numero == 0)
		retorne 1
		
		retorne numero * fatorial(numero - 1)
	}
}
/*---
O fatorial de 0: 1
O fatorial de 1: 1
O fatorial de 2: 2
O fatorial de 3: 6
O fatorial de 4: 24
O fatorial de 5: 120
O fatorial de 6: 720
O fatorial de 7: 5040
O fatorial de 8: 40320
O fatorial de 9: 362880
O fatorial de 10: 3628800

---*/