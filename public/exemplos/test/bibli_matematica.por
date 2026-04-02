programa {
	inclua biblioteca Matematica --> m
	funcao inicio()
	{
		escreva(m.PI,"\n")
		escreva(m.potencia(2.0, 10.0),"\n")
		escreva(m.arredondar(1.0/3.0, 2),"\n")
		escreva(m.cosseno(m.PI / 2.0),"\n")
		escreva(m.seno(m.PI / 2.0),"\n")
		escreva(m.tangente(m.PI / 2.0),"\n")
		escreva(m.logaritmo(10, 2),"\n")
		escreva(m.maior_numero(10, 20),"\n")
		escreva(m.menor_numero(10, 20),"\n")
		escreva(m.raiz(64,2.0),"\n")
		escreva(m.raiz(2,2.0),"\n")
		escreva(m.valor_absoluto(-10),"\n")
		escreva(m.valor_absoluto(10),"\n")
	}

}
/*---
3.141592653589793
1024.0
0.33
6.123233995736766e-17
1.0
16331239353195370.0
3.3219280948873626
20.0
10.0
8.0
1.4142135623730951
10.0
10.0

---*/