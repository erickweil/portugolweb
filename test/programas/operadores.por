programa
{
	funcao inicio()
	{
		escreva(1 + 2 / 3 * 4 - 5,"\n")
		
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