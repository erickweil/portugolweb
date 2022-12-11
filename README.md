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
	
Testes Apenas:
	- Avaliador Automático ( acesse https://erickweil.github.io/portugolweb/avaliar.html )
	
### O que falta
	
- Mensagens de erros que definem melhor o que aconteceu e como corrigir
- Adicionar suporte às bibliotecas Sons, Arquivos, Internet, ServiçosWeb.
	- só que essas bibliotecas só vão funcionar no celular, pois javascript puro não permite acessar arquivos nem a internet
- Sistema de Inspeção de Variáveis em tempo de execução
- Permitir executar o código passo-a-passo e inserir pontos de depuração
- Hierarquia do código na lateral
- Mais exemplos de código
- Sistema de Ajuda
- Permitir compartilhar o código usando um link compartilhável
- Adaptar para que possa incluir o editor em um iframe em sites externos ( Moodle )
- Realizar compilação para javascript e não utilizar máquia virtual, para deixar mais rápido
- Exportar código para Java ou C++

Aceito ajuda! 
  inicie uma discussão com uma nova Issue ou mande email para erickweil2@gmail.com caso queira conversar.

### Como funciona

Quando você clica em "Executar", todo o código que estiver no editor será compilado e executado, passando por etapas que lembram um pouco como Java funciona

1. Tokenizer: 
	Esta é a análise léxica, onde o código é dividido em 'tokens', isto é, partes elementares como palavras, números, símbolos, etc... 
2. Parser:
	Esta é a análise sintática, Os tokens são estruturados em uma árvore sintática. esta árvore contém todos os elementos do código organizados de forma que o compilador possa atravessar corretamente e gerar o código
3. Compiler:
	A árvore sintática é atravessada pelo compilador, e são gerados instruções chamadas de 'bytecode', semelhantes porém não iguais ao bytecode do Java.
4. Virtual Machine:
	Uma vez que o bytecode está gerado, a máquina virtual é iniciada e executa cada instrução uma após a outra.
	
Devido ao código ser executado em uma máquina virtual, o mesmo código executado aqui e no programa Portugol Studio, pode ser de 10 a 100 vezes mais lento ( se você usar para aprender a programar isso não será um problema )

  
## Bibliotecas e Frameworks

* [Ace editor](https://github.com/ajaxorg/ace) - O editor do código.

é isso! todo o código é escrito em html e javascript, não é utilizado nenhuma outra biblioteca.

## Instalação

É uma página web estática, não é preciso instalar:

> acesse: <a>https://erickweil.github.io/portugolweb/</a> para utilizar direto do navegador
> ou baixe o aplicativo Android:<a>https://play.google.com/store/apps/details?id=br.erickweil.portugolweb</a> que permite utilizar offline.

### Docker

É possível executar uma imagem Docker baseada no nginx para hospedar o site em um container Docker.
Com o docker instalado basta executar:
```
docker run -d -p 80:80 erickweil/portugolweb
```

### Manual

Pode também baixar o inteiro projeto e abrir o arquivo index.html para utilizar offline no Computador ( É necessário ter um navegador web ). Não funcionará clicar nos exemplos a não ser que hospede em um servidor web estático local, como por exemplo apache ou nginx (Uma forma fácil seria instalar o XAMPP).

## Licença 

GPL-3.0 - Veja o arquivo da licença: [Licença](LICENSE)

## Agradecimentos

* Este projeto foi inspirado pelo Projeto [Portugol Studio](https://github.com/UNIVALI-LITE/Portugol-Studio), e tem como objetivo trazer a programação nesta linguagem Portugol até os dispositivos móveis.