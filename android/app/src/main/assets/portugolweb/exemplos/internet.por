programa
{
	inclua biblioteca Internet
	inclua biblioteca Texto --> t
	inclua biblioteca Tipos --> tp
	inclua biblioteca Util
	
	cadeia ASCII =     " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
	cadeia ASCII_URI =  "!.!!!!!!...!!..!..........!!!!!!!..........................!!!!.!..........................!!!."

	cadeia TAGS_BLOCO[] = {"address","article","aside","blockquote","canvas",
	"dd","div","dl","dt","fieldset","figcaption","figure","footer",
	"form","h1","h2","h3","h4","h5","h6","header","hr","li","main",
	"nav","noscript","ol","p","pre","section","table","tfoot","ul","video",
	
	"br","hr"
	}

	funcao inteiro converterParaASCII(caracter c)
	{
		retorne t.posicao_texto(""+c,ASCII,0) + 32
	}
	
	funcao cadeia encodeURI(cadeia txt)
	{
		cadeia ret = ""
		para(inteiro i=0;i<t.numero_caracteres(txt);i++)
		{
			caracter c = t.obter_caracter(txt,i)
			inteiro code = converterParaASCII(c)
			se(code >= 32)
			{
				caracter substitute = t.obter_caracter(ASCII_URI,code-32)
				cadeia cfinal
				se(c == ' ')
				{
					cfinal = "+"
				}
				senao se(substitute == '!')
				{
					cfinal = "%"+t.caixa_alta(tp.inteiro_para_cadeia(code,16))
				}
				senao
				{
					cfinal = ""+c
				}
				
				ret += cfinal
			}
		}
		retorne ret
	}

	
	// Manipulação do HTML
	cadeia html=""
	inteiro htmlsz=0
	inteiro index=0
	
	// Procura o próximo que der com a pesquisa
	funcao proximo(cadeia pesquisa)
	{
		inteiro i = t.posicao_texto(pesquisa,html,index)
		se(i>0)
		{
			index=i
		
			index+= t.numero_caracteres(pesquisa)
        }
	}
	
	// pegar o nome da tag
	funcao logico proximoNome(cadeia teste)
	{
		inteiro i = t.posicao_texto(teste,html,index)
		retorne i == index
	}
	
	funcao logico proximoNomeArr(cadeia teste[])
	{
		para(inteiro i =0;i<Util.numero_elementos(teste);i++)
		{
			se(proximoNome(teste[i])) retorne verdadeiro
		}
		retorne falso
	}
	
	funcao cadeia removerTags(cadeia txthtml)
	{
		html = txthtml
		htmlsz = t.numero_caracteres(txthtml)
		
		//Acha o body, assim pula todo o css e js do <head>
		proximo("<body")
		//pula a tag
		proximo(">")
		
		cadeia textoFinal = ""
		logico quebrouLinha = falso
		para(;index<t.numero_caracteres(html);index++)
		{
			caracter c = t.obter_caracter(html,index)
			se(c == '<')
			{
				index++
				// Nao escrever o javascript nem css na tela
				se(proximoNome("script") ou proximoNome("style"))
				{
					proximo("</")
					index+=5
				}
				senao
				{
				//	se(proximoNome("br"))
				//	{
					se(proximoNomeArr(TAGS_BLOCO))
					{
						textoFinal+="\n"
						quebrouLinha = verdadeiro
					}
				//	}
					proximo(">")
					index--
				}
			}
			senao
			{
				inteiro code = converterParaASCII(c)
				se(code >=32) // Assim não escreve quebras de linha nem nenhum outro caracter especial que poderia dar problema
							  // mas ae acaba perdendo os acentos
				{
					textoFinal += c
					quebrouLinha = falso
				}
			}
		}
		retorne textoFinal
	}
	
	funcao inicio ()
	{
		escreva("_____________________________________\n")
		escreva("|                                   |\n")
		escreva("|                                   |\n")
		escreva("|                                   |\n")
		escreva("|                                   |\n")
		escreva("|              GOOGLE               |\n")
		escreva("|                                   |\n")
		escreva("|                                   |\n")
		escreva("|                                   |\n")
		escreva("|___________________________________|\n")
		escreva("\n\nInsira sua pesquisa:")
		cadeia pesquisa 
		leia(pesquisa)
		
		// Por enquanto, para funcionar o site TEM que ser HTTPS
		cadeia site = "https://www.google.com/search?q="+encodeURI(pesquisa)
		
		cadeia pesquisaHTML = Internet.obter_texto(site)
		//cadeia pesquisaHTML = "<html><head><script>aaaaaaa aaaaa aaaa</script><body>Oi tudo <b>bem</b>?<br>Ok então Tchau</body></html>"
		
		escreva(removerTags(pesquisaHTML))
	}
}
