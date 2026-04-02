programa
{
	funcao inicio()
	{
		// Expressão que prova que a ordem dos operadores está correta e inteiros continuam inteiros
		// Se inteiro virasse float daria -1.333333333
		// Se a ordem dos operadores tiver errada, por exemplo:
		//	- Executar como numa calculadora sem priorizar: -1
		//  - Executar a multiplicação antes da divisão, com inteiro virando float: -3,833333333333333
		escreva(1 + 2 / 3 * 4 - 5,"\n") // 1 + ((2/3) * 4) - 5 --> 1 + (0 * 4) - 5 --> 1 - 5 --> 4
		
		inteiro a = 0
		escreva(a++,a++,a++,a++,a,"\n")
		
		escreva(a--,a--,a--,a--,a,"\n")
		
		a += 1
		escreva(a,"\n")
		
		a -= 1
		escreva(a,"\n")
		
		escreva(-a,"\n")
		
		escreva(a % 10,"\n")
		
		inteiro binario = 127
		inteiro outro = 42
		escreva(binario,"\n")
		escreva(binario << 1,"\n")
		escreva(binario >> 1,"\n")
		escreva(binario | outro,"\n")
		escreva(binario & outro,"\n")
		escreva(binario ^ outro,"\n")
		escreva(~binario,"\n")
	}
}
/*---
-4
01234
43210
1
0
-0
0
127
254
63
127
42
85
-128

---*/