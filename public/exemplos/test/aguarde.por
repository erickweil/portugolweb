programa
{
        inclua biblioteca Util --> u

        funcao inicio()
        {
                // Testa chamada de funcao de biblioteca nao-jsSafe via promisify.
                // u.aguarde() retorna {state: STATE_DELAY} para a VM antiga;
                // no modo JS o JsGenerator gera:
                //   (await (u.promisify(u.aguarde)(ms)))
                // que resolve via setTimeout, mantendo execucao sequencial.
                escreva("inicio\n")
                u.aguarde(1)
                escreva("depois do aguarde\n")
                u.aguarde(1)
                escreva("fim")
        }
}

/*---
inicio
depois do aguarde
fim
---*/
