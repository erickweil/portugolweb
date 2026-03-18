programa
{
	// aperte ctrl+espaco quando escrever 'inclua' para sugestões
	inclua biblioteca Calendario --> c
	funcao inicio ()
	{
		escreva("Horário do computador:\n")
		
		escreva(c.hora_atual(falso)+":"+c.minuto_atual()+", ")
		
		escreva(c.dia_semana_completo(c.dia_semana_atual(),falso,falso)+" "+c.dia_mes_atual()+"/"+c.mes_atual()+"/"+c.ano_atual())
	}
}