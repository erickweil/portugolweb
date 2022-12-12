programa
{
	funcao inicio()
	{
		para(inteiro i =2;i<100;i++)
		{
			se(primo(i)) escreva(i,", ")
		}
	}

	funcao logico primo(inteiro n)
	{
		para(inteiro i = 2;i<n;i++)
		{
			se(n % i == 0) retorne falso
		}
		retorne verdadeiro
	}
}
/*---
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 
---*/