programa
{
	funcao inicio()
	{
		inteiro testeA = 5
		escreva("a = ",testeA)
		inteiro antes = maismais(testeA)

		escreva("\nA (antes): ", antes)
		escreva("\nA (depois): ", testeA)
		
		inteiro v1 = 7
		inteiro v2 = 55
		inteiro v3 = -1
		ordenar(v1,v2,v3)
		escreva("\n",v1," < ",v2," < ",v3)
	}
	
	funcao inteiro maismais(inteiro &a) {
		inteiro antes = a
		a = a + 1
		retorne antes
	}
	
	funcao ordenar(inteiro &a, inteiro &b, inteiro &c) {
		// 3, 2, 1
		se(a > b) trocar(a,b)
		// 2, 3, 1
		se(b > c) trocar(b,c)
		// 2, 1, 3
		se(a > b) trocar(a,b)
		// 1, 2, 3
	}
	
	funcao trocar(inteiro &a, inteiro &b) {
		inteiro c = a
		a = b
		b = c
	}
}

/*---
a = 5
A (antes): 5
A (depois): 6
-1 < 7 < 55
---*/