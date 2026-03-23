programa
{
    funcao inicio()
    {
        // Testa faca..enquanto: soma 1+2+3+4+5 = 15
        inteiro i = 1
        inteiro soma = 0
        faca
        {
            soma = soma + i
            i = i + 1
        }
        enquanto(i <= 5)
        escreva(soma)
        escreva("\n")

        // Garante que o bloco executa ao menos uma vez (condicao falsa desde o inicio)
        inteiro x = 99
        faca
        {
            escreva(x)
        }
        enquanto(x < 10)
    }
}

/*---
15
99
---*/
