$(function() {

    function exibir_persongens (){
        $.ajax ({
            url: 'http://localhost:5000/listar/Personagem',
            method: 'GET',
            dataType: 'json',
            success: listar,
            error: function() {
                alert("Erro ao ler dados, verifique o backend.")
            }
        });
        function listar (personagens) {
            $('#corpoTabelaPersonagens').empty();
            mostrar_conteudo("cadastroPersonagens");

            for (var i in personagens) {
                lin = '<tr id="linha_'+ personagens[i].id +'">' + 
                '<td>' + personagens[i].nome + '</td>' +
                '<td>' + personagens[i].vida + '</td>' +
                '<td>' + personagens[i].ataque + '</td>' +
                '<td>' + personagens[i].defesa + '</td>' +
                '<td>' + personagens[i].pacto + '</td>' + 
                '<td><a href=# id="excluir_' + personagens[i].id + '" ' + 
                'class="excluir_personagem"><img style="width:50px; height:50px; border-radius:50%;" src="img/excluir.png" ' +
                'alt="Excluir personagem" title="Excluir Personagem"></a>' + '</td> </tr>';//
                $('#corpoTabelaPersonagens').append(lin);
            }
        }
    }

    function mostrar_conteudo(identificador){
        $("#cadastroPersonagens").addClass('d-none');
        $("#conteudoDoInicio").addClass('d-none');
        $("#cadastroAventuras").addClass('d-none');
        $("#cadastroArmamentos").addClass('d-none');

        $("#" + identificador).removeClass('d-none');
    }

    $(document).on("click", "#linkListarPersonagem", function() {
        exibir_persongens();
    });

    $(document).on("click", "#linkListarAventura", function() {
        exibir_aventuras();
    });

    $(document).on("click", "#linkListarArmamento", function(){
        exibir_armamentos();
    });

    $(document).on("click", "#linkInicio", function() {
        mostrar_conteudo("conteudoDoInicio")
    });

    $(document).on("click", "#btIncluirPersonagem", function(){
        nome = $("#campoNome").val();
        vida = $("#campoVida").val();
        ataque = $("#campoAtaque").val();
        defesa = $("#campoDefesa").val();
        pacto = $("#campoPacto").val();
        var dados = JSON.stringify({ nome: nome, vida: vida, ataque: ataque, defesa: defesa, pacto: pacto });
        $.ajax({
            url: 'http://localhost:5000/incluir_personagem',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: dados,
            success: personagemIncluido,
            error: erroAoIncluir
        });
        
        function personagemIncluido (retorno) {
            if (retorno.resultado == "ok") {
                alert("Personagem incluído com sucesso!");
                $("#campoNome").val("");
                $("#campoVida").val("");
                $("#campoAtaque").val("");
                $("#campoDefesa").val("");
                $("#campoPacto").val("");
            } else {
                alert(retorno.resultado + ":" + retorno.detalhes);
            }
        }

        function erroAoIncluir (retorno) {
            alert("ERRO: " + retorno.resultado + ":" + retorno.detalhes);
        }
    });
    $('#modalIncluirPersonagem').on('hide.bs.modal', function (e) {
        if (! $("#cadastroPersonagens").hasClass('d-none')){
        exibir_persongens();
        }
    });

    $(document).on("click", ".excluir_personagem", function(){
        var componente_clicado = $(this).attr('id');
        var nome_icone = "excluir_";
        var id_personagem = componente_clicado.substring(nome_icone.length);
        $.ajax({
            url: 'http://localhost:5000/excluir_personagem/' + id_personagem,
            type: 'DELETE',
            dataType: 'json',
            success: personagemExcluido,
            error: erroAoExcluir,
        });

        function personagemExcluido (retorno){
            if (retorno.resultado == "ok"){
                $("#linha_" + id_personagem).fadeOut(1000, function(){
                    alert("Personagem removido com sucesso!");
                });
            } else {
                alert(retorno.resultado + ":" + retorno.detalhes);
            }
        }
        function erroAoExcluir (retorno){
            alert("Erro ao excluir dados, verifique o backend: ")
        }
    });

    function exibir_aventuras (){
        $.ajax ({
            url: 'http://localhost:5000/listar/Aventura',
            method: 'GET',
            dataType: 'json',
            success: listar,
            error: function() {
                alert("Erro ao ler dados, verifique o backend.")
            }
        });

        function listar (aventuras) {
            $('#corpoTabelaAventuras').empty();
            mostrar_conteudo("cadastroAventuras");

            for ( var i in aventuras ) {
                lin = '<tr id="linha_aventura_'+ aventuras[i].id + '">' + 
                '<td>' + aventuras[i].descricao + '</td>' +
                '<td>' + aventuras[i].recompensa + '</td>' +
                '<td>' + aventuras[i].progresso + '</td>' +
                '<td>' + aventuras[i].data_inicio + '</td>' +
                '<td>' + aventuras[i].contratado.nome + '</td>' +
                '<td>' + aventuras[i].contratado.vida + '</td>' +
                '<td>' + aventuras[i].contratado.ataque + '</td>' +
                '<td>' + aventuras[i].contratado.defesa + '</td>' +
                '<td>' + aventuras[i].contratado.pacto + '</td>' +
                '<td><a href=# id="excluir_aventura_ '+ aventuras[i].id + '"' +
                'class="excluir_aventuras"><img src="img/excluir.png" style="width:50px;border-radius:50%;height:50px;" ' +
                'alt="Excluir aventura" title="Excluir aventura"></a>' + '</td></tr>';
                $('#corpoTabelaAventuras').append(lin);
            }
        }
    }

    function exibir_armamentos (){
        $.ajax ({
            url: 'http://localhost:5000/listar/Armamento',
            method: 'GET',
            dataType: 'json',
            success: listar,
            error: function() {
                alert("Erro ao ler dados, verifique o backend.")
            }
        });
        function listar (armamentos) {
            $('#corpoTabelaArmamentos').empty();
            mostrar_conteudo("cadastroArmamentos");

            for (var i in armamentos) {
                if (armamentos[i].utilizado_por.id == undefined){
                    lin = '<tr id="linha_armamento_'+ armamentos[i].id +'">' + 
                    '<td>' + armamentos[i].nome + '</td>' +
                    '<td>' + armamentos[i].tipo_dano + '</td>' +
                    '<td> Ninguém </td>' +
                    '<td> N/D </td>' +
                    '<td> N/D </td>' +
                    '<td> N/D </td>' +
                    '<td> N/D </td>' +
                    '<td><a href=# id="excluir_armamento_' + armamentos[i].id + '" ' + 
                    'class="excluir_armamentos"><img style="width:50px; height:50px; border-radius:50%;" src="img/excluir.png" ' +
                    'alt="Excluir armamento" title="Excluir armamento"></a>' + '</td> </tr>';//
                    $('#corpoTabelaArmamentos').append(lin);
                }
                else {
                    lin = '<tr id="linha_armamento_'+ armamentos[i].id +'">' + 
                    '<td>' + armamentos[i].nome + '</td>' +
                    '<td>' + armamentos[i].tipo_dano + '</td>' +
                    '<td>' + armamentos[i].utilizado_por.nome + '</td>' +
                    '<td>' + armamentos[i].utilizado_por.vida + '</td>' +
                    '<td>' + armamentos[i].utilizado_por.ataque + '</td>' +
                    '<td>' + armamentos[i].utilizado_por.defesa + '</td>' +
                    '<td>' + armamentos[i].utilizado_por.pacto + '</td>' + 
                    '<td><a href=# id="excluir_armamento_' + armamentos[i].id + '" ' + 
                    'class="excluir_armamentos"><img style="width:50px; height:50px; border-radius:50%;" src="img/excluir.png" ' +
                    'alt="Excluir armamento" title="Excluir armamento"></a>' + '</td> </tr>';//
                    $('#corpoTabelaArmamentos').append(lin);
                }
            }
        }
    }

    mostrar_conteudo("conteudoDoInicio");

});