programa
{
    inclua biblioteca Util --> u

    // Testa sobrecarga com mesmo numero de parametros mas tipos diferentes,
    // onde uma variante e jsSafe e a outra nao (usa aguarde).
    // Exercita o bugfix em getJsSafe que usava referencia direta ao array
    // de parametros ao inves de comparar apenas nome + quantidade.
    funcao inicio()
    {
        escreva(processar(42))
        escreva("\n")
        escreva(processar("texto"))
    }

    funcao cadeia processar(inteiro n)
    {
        // jsSafe: sem chamadas assincronas
        retorne "int=" + n
    }

    funcao cadeia processar(cadeia s)
    {
        // nao-jsSafe: chama aguarde (biblioteca assincrona)
        u.aguarde(1)
        retorne "str=" + s
    }
}

/*---
int=42
str=texto
---*/
