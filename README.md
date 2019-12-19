# Portugol Mobile
Simples versão web, compatível com smartphones, para programar na linguagem do portugol studio.


![Site no celular](celular.jpeg)

## Utilização

acesse: <a>https://erickweil.github.io/portugolweb/</a> para utilizar direto do navegador
ou baixe o aplicativo Android:<a>https://play.google.com/store/apps/details?id=br.erickweil.portugolweb</a> que permite utilizar offline.

** obs: Ao utilizar no celular, haverá uma barra especial com caracteres para complementar o teclado **

## Recursos

Este projeto é uma implementação em javascript da linguagem Portugol, utilizada pelo programa Portugol Studio.
segue uma lista de funcionalidades que são suportadas

- Funções da linguagem
	- escreva
	- leia
	- limpa
	- sorteia
- Variáveis
	- todos os tipos ( inteiro, real, cadeia, caracter, logico )
- Vetores e Matrizes
	- permite vetores com quantas dimensões quiser ( unidimensionais, bidimensionais, tridimensionais e etc...)
- Estrutura Se-Senão
- Estrutura Enquanto
- Estrutura Faça-Enquanto
- Estrutura Escolha-caso

- Funções
	- funções com mesmo nome e assinaturas diferentes ( overloading )
	- Passagem de parâmetros por referência, por declarar o parâmetro com o símbolo &
	- vetores são sempre passados por referência

- Bibliotecas
	- Calendario
	- Graficos
		- Não funciona todos os métodos, principalmente os que trabalham com arquivos e/ou modificam imagens
		- imagens devem ser carregadas utilizando um url, e não um caminho de arquivo
	- Matematica
	- Mouse ( No celular, um toque é BOTAO_ESQUERDO, dois toques é BOTAO_DIREITO e três toques é BOTAO_MEIO )
	- Objetos
	- Teclado ( Não funciona no celular )
	- Texto
	- Tipos
	- Util
	
### O que falta
	
- Mensagens de erros que definem melhor o que aconteceu e como corrigir
- Adicionar suporte às bibliotecas Sons, Arquivos, Internet, ServiçosWeb.
	- só que essas bibliotecas só vão funcionar no celular, pois javascript puro não permite acessar arquivos nem a internet


Aceito ajuda! 
  inicie uma discussão com uma nova Issue ou mande email para erickweil2@gmail.com caso queira conversar.
  
  
## Bibliotecas e Frameworks

* [Ace editor](https://github.com/ajaxorg/ace) - O editor do código, onde que foi criado um tema para as cores do Portugol

é isso! todo o código é escrito em html e javascript, não é utilizado JQuery nem nenhuma outra biblioteca.

## Instalação

É uma página web estática, não é preciso instalar:

> acesse: <a>https://erickweil.github.io/portugolweb/</a> para utilizar direto do navegador
> ou baixe o aplicativo Android:<a>https://play.google.com/store/apps/details?id=br.erickweil.portugolweb</a> que permite utilizar offline.

Ou se desejar, baixe o inteiro projeto e abra o arquivo index.html para utilizar offline no Computador ( É necessário ter um navegador web ).

## Licença 

GPL-3.0 - Veja o arquivo da licença: [Licença](LICENSE)

## Agradecimentos

* Estes projeto foi inspirado pelo Projeto [Portugol Studio](https://github.com/UNIVALI-LITE/Portugol-Studio), e tem como objetivo trazer a programação nesta linguagem Portugol até os dispositivos móveis.