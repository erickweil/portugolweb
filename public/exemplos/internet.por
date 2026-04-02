programa
{
	// Obs: Este exemplo só funciona no aplicativo Android.
	// pois o navegador não deixa baixar arquivos de qualquer site

	inclua biblioteca Internet
	inclua biblioteca Texto
	
	// Pesquise um livro em https://www.gutenberg.org/ebooks/
	// E copie o link para o formato txt UTF-8
	// Ou utilize um dos exemplos abaixo

	// Os Lusíadas
	cadeia url = "https://www.gutenberg.org/cache/epub/3333/pg3333.txt"

	// Bíblia João Ferreira d'Almeida
	// cadeia url = "https://www.gutenberg.org/cache/epub/62383/pg62383.txt"

	// A Concise Dictionary of Middle English from A.D. 1150 to 1580
	// cadeia url = "https://www.gutenberg.org/cache/epub/10625/pg10625.txt"

	cadeia livroTXT
	funcao inicio ()
	{
		escreva("Baixando livro... \n")
		escreva("URL --> '", url, "' \n")
		
		livroTXT = Internet.obter_texto(url)
		
		escreva("Baixou o livro!\n")
		reiniciar_linhas()
		cadeia titulo = proxima_linha()
		escreva(titulo, "\n")
		
		enquanto(verdadeiro)
		{
			escreva("Pesquisar no livro:\n")
			cadeia pesquisa
			leia(pesquisa)
			pesquisa = Texto.caixa_alta(pesquisa)
			
            reiniciar_linhas()
            cadeia linha
            inteiro quantas = 0
            faca
            {
            	linha = proxima_linha()
            	cadeia LINHA = Texto.caixa_alta(linha)
				// Faz a pesquisa convertido para caixa alta para ignorar
				// diferenças entra maiúsculas e minúsculas	
            	se(Texto.posicao_texto(pesquisa, LINHA, 0) != -1)
            	{
            		escreva(linha, "\n")
            		quantas++
            	}
            }
            enquanto(nao fim)
            
            escreva("\nOcorrências:", quantas, "\n")
		}
	}
	
	// Essas funções permitem atravessar
	// linha por linha um texto grande de forma simples
	inteiro linha_i
	inteiro linha_ui
	logico fim
	funcao reiniciar_linhas()
	{
		linha_i = -1
		linha_ui = -1
		fim = falso
	}
	funcao cadeia proxima_linha()
	{
		se(linha_i >= Texto.numero_caracteres(livroTXT)) {
			fim = verdadeiro
			retorne ""
		}
		
		linha_i++
		linha_ui = linha_i 
		enquanto (linha_i < Texto.numero_caracteres(livroTXT) e Texto.obter_caracter(livroTXT, linha_i) != '\n')
		{
			linha_i++
		}
		fim = falso
		retorne Texto.extrair_subtexto(livroTXT, linha_ui, linha_i)
	}
}