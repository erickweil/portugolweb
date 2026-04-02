programa
{
	funcao inicio()
	{
		para(inteiro a = 0; a < 2; a++) {
			para(inteiro b = 0; b < 2; b++) {
				escreva(a,"^",b,"\n")
				escreva(a ^ b, "\n")
				escreva((a * 1.0) ^ (b * 1.0), "\n")
				escreva((a == 1) ^ (b == 1), "\n")
				escreva("\n")
				
				escreva(a,"|",b,"\n")
				escreva(a | b, "\n")
				escreva((a * 1.0) | (b * 1.0), "\n")
				escreva((a == 1) | (b == 1), "\n")
				escreva("\n")
				
				escreva(a,"&",b,"\n")
				escreva(a & b, "\n")
				escreva((a * 1.0) & (b * 1.0), "\n")
				escreva((a == 1) & (b == 1), "\n")
				escreva("\n")
			}
		}
	}
}
/*---
0^0
0
0.0
falso

0|0
0
0.0
falso

0&0
0
0.0
falso

0^1
1
1.0
verdadeiro

0|1
1
1.0
verdadeiro

0&1
0
0.0
falso

1^0
1
1.0
verdadeiro

1|0
1
1.0
verdadeiro

1&0
0
0.0
falso

1^1
0
0.0
falso

1|1
1
1.0
verdadeiro

1&1
1
1.0
verdadeiro


---*/
