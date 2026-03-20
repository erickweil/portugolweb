programa
{
	inclua biblioteca Tipos --> t

	funcao inicio()
	{
		// cadeia_para_inteiro base 16
		escreva(t.cadeia_para_inteiro("FF", 16), "\n")
		// cadeia_para_inteiro base 2
		escreva(t.cadeia_para_inteiro("1010", 2), "\n")
		// cadeia_para_inteiro base 10
		escreva(t.cadeia_para_inteiro("42", 10), "\n")

		// real_para_cadeia: reais sem parte decimal devem conter ".0"
		// (consistência com o comportamento de escreva() para reais)
		escreva(t.real_para_cadeia(1.0), "\n")
		escreva(t.real_para_cadeia(3.14), "\n")
		escreva(t.real_para_cadeia(-7.0), "\n")
		escreva(t.real_para_cadeia(1e21), "\n")

		// caracter_para_inteiro: converte dígito para valor numérico
		escreva(t.caracter_para_inteiro('5'), "\n")
		escreva(t.caracter_para_inteiro('0'), "\n")

		// inteiro_para_cadeia
		escreva(t.inteiro_para_cadeia(255, 16), "\n")
		escreva(t.inteiro_para_cadeia(10, 2))
	}
}
/*---
255
10
42
1.0
3.14
-7.0
1e+21
5
0
ff
1010
---*/
