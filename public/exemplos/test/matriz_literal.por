programa
{
    funcao inicio()
    {
        // Testa inicializacao de matriz 2D com literal
        // Exercita o bugfix em compileDeclArray que adicionou os colchetes internos
        inteiro m[2][3] = {{10,20,30},{40,50,60}}

        para(inteiro l = 0; l < 2; l++)
        {
            para(inteiro c = 0; c < 3; c++)
            {
                se(c != 0) escreva(" ")
                escreva(m[l][c])
            }
            escreva("\n")
        }

        // Testa vetor 1D com literal para comparacao
        inteiro v[3] = {7, 8, 9}
        escreva(v[0]," ",v[1]," ",v[2])
    }
}

/*---
10 20 30
40 50 60
7 8 9
---*/
