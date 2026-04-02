programa
{
	funcao inicio()
	{
		inteiro distancia, velocidade

		escreva("Insira a distância em KM:")
		leia(distancia)
		
		escreva("Insira a velocidade em KM/H:")
		leia(velocidade)

		// Calcula em minutos o tempo gasto
		inteiro minutos = 60 * distancia / velocidade
		// Converte para horas
		inteiro horas = minutos / 60
		// Tira as horas dos minutos para ter o que sobra em minutos
		minutos = minutos - horas * 60
		
		escreva("total de horas gasta é ",horas," horas e ",minutos," minutos")
	}
}