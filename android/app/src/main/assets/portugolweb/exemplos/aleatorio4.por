//por André Capelasso
programa
{
	funcao inicio()
	{
		
	escreva("---------- Desafio 6 ----------\n")
	escreva("Maria quer ir para a casa de Joana, mas o caminho até a casa de Joana tem muitos obstáculos \n")
	escreva("Primeiro ela deve atravessar o rio. Se a ponte estver quebrada Maria terá que ir atravessando o camihno de pedras do rio, mas apenas se o rio estier baixo \n ")
	escreva("A ponte está quebrada? (sim ou nao) ")
	cadeia resp
	leia (resp)


	
     se( resp == "sim" )
     
     {
     	escreva("O rio está cheio?(sim ou nao) ")
     	leia (resp)
         se(  resp == "sim" )
         {
         		escreva("Então ela não vai passar \n")
         		escreva("Maria não conseguiu ir a casa de Joana")
         		retorne
         }
         senao 
         {
         		escreva("Estão ela passa pelo caminho de pedras \n")
         }
     }
     senao 
     {
     	escreva("Então ela atravessa pela ponte \n ")
     }




     escreva("O próximo obstáculo é passar pela floresta, se estiver de noite Maria estará com muito medo de atravessar a floresta, então ela não poderá ir \n")
     escreva("Está de noite?(sim ou nao) ")
     cadeia resp2
     leia (resp2)

     se ( resp2 == "sim" )
     {
     escreva("Então ela não poderá passar \n")
     escreva("Maria não conseguiu ir a casa de Joana")
     retorne
     }
     senao
     {
     escreva("Que bom! Maria passará pela floresta")
     }

     escreva("Por fim, ela deve pegar um trem, mas o trem não passa no ponto se for sabado ou domingo \n")
     escreva("É sábado ou domingo?(sim ou não) ")
     cadeia resp3
     leia (resp3)

     se( resp3 == "sim")
     {
     escreva("Maria não conseguiu ir a casa de Joana")
     }
     senao
     {
     escreva("Maria conseguiu chegar a casa de Joana")
     }
     
	}
}