programa {
	inclua biblioteca Calendario --> c
	funcao inicio()
	{
		// Dar erro se não for igual
		logico ok
		ok = c.DIA_DOMINGO == 1
		ok = ok e c.DIA_SEGUNDA_FEIRA == 2
		ok = ok e c.DIA_TERCA_FEIRA == 3
		ok = ok e c.DIA_QUARTA_FEIRA == 4
		ok = ok e c.DIA_QUINTA_FEIRA == 5
		ok = ok e c.DIA_SEXTA_FEIRA == 6
		ok = ok e c.DIA_SABADO == 7
		
		ok = ok e c.MES_JANEIRO == 1
		ok = ok e c.MES_FEVEREIRO == 2
		ok = ok e c.MES_MARCO == 3
		ok = ok e c.MES_ABRIL == 4
		ok = ok e c.MES_MAIO == 5
		ok = ok e c.MES_JUNHO == 6
		ok = ok e c.MES_JULHO == 7
		ok = ok e c.MES_AGOSTO == 8
		ok = ok e c.MES_SETEMBRO == 9
		ok = ok e c.MES_OUTUBRO == 10
		ok = ok e c.MES_NOVEMBRO == 11
		ok = ok e c.MES_DEZEMBRO == 12
		
		escreva("Variaveis corretas:"+ok)
		
		inteiro ano = c.ano_atual()
		inteiro mes = c.mes_atual()
		inteiro diames = c.dia_mes_atual()
		inteiro diasem = c.dia_semana_atual()
		inteiro hora = c.hora_atual(falso)
		inteiro minuto = c.minuto_atual()
		inteiro segundo = c.segundo_atual()
		inteiro milissegundo = c.milisegundo_atual()
		
		escreva("\nSemana Abrev:",c.dia_semana_abreviado(1, verdadeiro, falso))
		escreva(", ",c.dia_semana_abreviado(2, verdadeiro, falso))
		escreva(", ",c.dia_semana_abreviado(3, verdadeiro, falso))
		escreva(", ",c.dia_semana_abreviado(4, verdadeiro, falso))
		escreva(", ",c.dia_semana_abreviado(5, verdadeiro, falso))
		escreva(", ",c.dia_semana_abreviado(6, verdadeiro, falso))
		escreva(", ",c.dia_semana_abreviado(7, verdadeiro, falso))
		
		escreva("\nSemana Curto:",c.dia_semana_curto(1, verdadeiro, falso))
		escreva(", ",c.dia_semana_curto(2, verdadeiro, falso))
		escreva(", ",c.dia_semana_curto(3, verdadeiro, falso))
		escreva(", ",c.dia_semana_curto(4, verdadeiro, falso))
		escreva(", ",c.dia_semana_curto(5, verdadeiro, falso))
		escreva(", ",c.dia_semana_curto(6, verdadeiro, falso))
		escreva(", ",c.dia_semana_curto(7, verdadeiro, falso))
				
		escreva("\nSemana Completo:",c.dia_semana_completo(1, verdadeiro, falso))
		escreva(", ",c.dia_semana_completo(2, verdadeiro, falso))
		escreva(", ",c.dia_semana_completo(3, verdadeiro, falso))
		escreva(", ",c.dia_semana_completo(4, verdadeiro, falso))
		escreva(", ",c.dia_semana_completo(5, verdadeiro, falso))
		escreva(", ",c.dia_semana_completo(6, verdadeiro, falso))
		escreva(", ",c.dia_semana_completo(7, verdadeiro, falso))
	}

}
/*---
Variaveis corretas:verdadeiro
Semana Abrev:DOM, SEG, TER, QUA, QUI, SEX, SAB
Semana Curto:DOMINGO, SEGUNDA, TERÇA, QUARTA, QUINTA, SEXTA, SABADO
Semana Completo:DOMINGO, SEGUNDA-FEIRA, TERÇA-FEIRA, QUARTA-FEIRA, QUINTA-FEIRA, SEXTA-FEIRA, SABADO
---*/