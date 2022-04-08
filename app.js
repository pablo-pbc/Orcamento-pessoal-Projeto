//Criando uma classe "Despesa" para, a partir dela, criar os "objetos 'Despesas adicionadas'"
class Despesa {
  constructor(dia, mes, ano, tipo, descricao, valor){
    this.dia = dia
    this.mes = mes
    this.ano = ano
    this.tipo = tipo    
    this.descricao = descricao
    this.valor = valor
  }

  //Função para validar se as informações foram todas preenchidas
  validarDados() {
    // o For vai percorrer todos os atributos do objeto e o operador this, nesse caso, é o informa que ele deve percorrer os atributos do escopo da classe onde ele está sendo aplicado.
    for (let i in this) {
      // a notação this[i] informar que ele deve comparar o valor dentro do atributo, ou seja, o numero do i (quando encrementado) se torna o indice de posição do atributo e retorna o seu valor.
      if (this[i] == undefined || this[i] == '' || this[i] == null ) {
        return false
      }
    } 
    return true
  }
}

// classe para garantir que não haverá sobreposição da lista de despesa.
class Bd {

  //Obtendo o Id do localStorage e atribuindo esse valor a variavel ID.
  constructor() {
    let id = localStorage.getItem('id')

    // Se o Id do localStorage for null será atribuido o valor zero no lugar. Isso é para não haver problemas na insersão da primeira despesa.
    if (id === null) {
      localStorage.setItem('id', 0)
    }
  }

  //Função que incrementa o valor 1 no Id do localStorage, criando assim uma sequencia numérica.
  getProximoId () {
    let proximoId = localStorage.getItem('id')
    return parseInt(proximoId) + 1
  }

  //Função para armezar as despesas no Local Storage do navegador.
  gravar(d) {
    let id = this.getProximoId() // Pega o valor da variavel proximoId e atribui a variavel Id. Operador this é usado porq a varivavel proximoId faz parte do escopo da classe.
    localStorage.setItem(id, JSON.stringify(d)) //Convertendo o objeto literal em JSON.
    localStorage.setItem('id', id) //Atribuindo ao Id do localStorage o valor do Id sequencial.
  }

   // Função para recuperar todas as despesas registradas no Local Storage 
  recuperarTodosRegistros() {
    // array de despesa - necessário para trabalharmos os registros recuperados do localStorage
    let despesas = Array()
    // Pegando os registros feitos do getItem do localStorage e atribuindo a varivel id
    let id = localStorage.getItem('id') 
    //Estrutura de repetição para percorrer todos os registros feitos no LocalStorage
    for (let i = 1; i <= id; i++) {
      // Recuperando as despesas (Lembrando a lista recuperada vem no formato JSON e usando o método JSON.parse estamos convertendo para objeto literal).
      let despesa = JSON.parse(localStorage.getItem(i))
      //despesas.push(despesa) = Pegando um registro da posição (i) e acrescentando a variavel despesas (array)
      //O condicional criado é para que não seja feito o push de um registro que tenha sido excluido.
      if (despesa === null) {
        continue
      }
      despesa.id = i //incluindo o id da key do localStorage para dentro do registro de forma que possamos identificar e trabalhar com o registro específico.
      despesas.push(despesa)      
    }
    return (despesas)
  }
  //Metodo de pesquisa, para aplicar os filtros dos registros de despesas feito
  pesquisar(despesa) {
    //Atribuido a variavel despesasFiltradas um Array
    let despesasFiltradas = Array()
    //Utilizando o metodo de recuperação dos registros armezenados no localStorage através da função recuperarTodosRegistros e atribuindo essa recuperação a variavel Array() despesasFiltradas.
    despesasFiltradas = this.recuperarTodosRegistros()

    //Aplicando filtros: Exemplo utilizando mais de um filtro num mesmo momento: despesasFiltradas.filter(function(f){return f.dia == despesa.dia}).filter (funciton(f) {return f.valor > 1200})
    //dia
    if(despesa.dia != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia) //notação arrowFunction | Sem ser arrowFunction -> despesas.Filtradas.filter(funciton(f) {return f.dia == despesa.dia})
    }    
    //mes
    if(despesa.mes != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
    } 
    //ano
    if(despesa.ano != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
    }
    //tipo
    if(despesa.tipo != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
    }
    //descricao
    if(despesa.descricao != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
    }
    //valor
    if(despesa.valor != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
    }
    return despesasFiltradas
  }

  remover(id) {
    localStorage.removeItem(id)
  }
}

let bd = new Bd()

//Função para pegar (get) os valores que serão preenchidos pelo usuário ao adicionar uma despesa.
function cadastrarDespesa() {  
  let dia = document.getElementById('dia')
  let mes = document.getElementById('mes')
  let ano = document.getElementById('ano')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  //Criando um novo objeto (despesa) a partir da classe "Despesa"
  let despesa = new Despesa (
    dia.value, // Notação compacta do ES6 | Antes seria assim -> dia = dia.value,
    mes.value,
    ano.value,
    tipo.value,
    descricao.value,
    valor.value    
  )
  
  if (despesa.validarDados()) {
    //chamando o objeto bd e executando a função gravar logo em seguida.
    bd.gravar(despesa)
    //Ajustando o conteudo do modal aplicado para mensagem de sucesso no registro da despesa
    document.getElementById('titulo-dialog').innerHTML = "Sucesso na execução"
    document.getElementById('titulo-dialog').className = "text-success modal-title"
    document.getElementById('descricao-dialog').innerHTML = "Despesa inserida com sucesso!"
    document.getElementById('texto-btn-modal').innerHTML = "Voltar"
    document.getElementById('texto-btn-modal').className ="btn-success btn"
    $('#mensagemErroSucesso').modal('show')
    
    //Após o registro ter sido feito com sucesso, os campos voltam aos seus estados originais "vazio"
    dia.value = ""
    mes.value = ""
    ano.value = ""
    tipo.value = ""
    descricao.value = ""
    valor.value = ""    
    
  } else {
    //Ajustando o conteudo do modal aplicado para mensagem de erro no registro da despesa
    document.getElementById('titulo-dialog').innerHTML = "Erro de execução"
    document.getElementById('titulo-dialog').className = "text-danger modal-title"
    document.getElementById('descricao-dialog').innerHTML = "Existe algum valor obrigatório a ser preenchido. Favor preencher todos os campos!"
    document.getElementById('texto-btn-modal').innerHTML = "Voltar e corrigir"
    document.getElementById('texto-btn-modal').className ="btn-danger btn"
    $('#mensagemErroSucesso').modal('show')
  }  
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

  if (despesas.length == 0 && filtro == false){
    //Atribuindo a variavel array despesas os registros recuperados através do método(função) recuperarTodosRegistros
  despesas = bd.recuperarTodosRegistros()
  } 

  //Selecionando o elementeo tbody da tabela
  let listaDespesas = document.getElementById("listaDespesas")
  listaDespesas.innerHTML = ""

  /*
	<tr>
		<td>15/03/2018</td>
		<td>Alimentação</td>
		<td>Compras do mês</td>
		<td>444.75</td>
	</tr>
	*/  

  //percorrendo o array despesas, listando cada despesa de forma dinâmica.
  despesas.forEach(function(d) {

		//Criando a linha (tr)
		let linha = listaDespesas.insertRow()

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//Ajustar o tipo
		switch(d.tipo){
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break			
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor
    //Botão de exclusão do item
    let btn = document.createElement("button")
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class="fas fa-times"></i>'
    btn.id = `id_despesa_${d.id}`
    btn.onclick = function (){
      //identificando o id da despesa para sua remoção -> vá até a classe BD.
      this.id

      let id = this.id.replace('id_despesa_', '')

      bd.remover(id)

      window.location.reload()
    }
    linha.insertCell(4).append(btn)
	})
}

//Função para aplicar os filtros na tela de consulta de resgistros.
function pesquisarDepesas() {

  //Recuperando o valor preenchido pelo usuário e armazenado no localStorage
  let dia = document.getElementById('dia').value
  let mes = document.getElementById('mes').value
  let ano = document.getElementById('ano').value
  let tipo = document.getElementById('tipo').value
  let descricao = document.getElementById('descricao').value
  let valor = document.getElementById('valor').value

  //Criando um novo objeto a partir da classe Despesa
  let despesa = new Despesa (dia, mes, ano, tipo, descricao, valor)

  //Chamando o método pesquisar instaciando no objeto classe BD.
  let despesas = bd.pesquisar(despesa)

  carregaListaDespesas(despesas, true)
  
}