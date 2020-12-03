from configuracoes import *
from modelos import Personagem, Aventura, Armamento

@app.route("/")
def index():
    return 'Sistema de cadastro de personagens. ' + '<a href="/listar/Personagem">Operação Listar</a>'

@app.route("/listar/<string:classe>")
def listar(classe):
    dados = None
    if classe == "Personagem":
        dados = db.session.query(Personagem).all()
    elif classe == "Aventura":
        dados = db.session.query(Aventura).all()
    elif classe == "Armamento":
        dados = db.session.query(Armamento).all()
    lista_em_json = [ x.json() for x in dados ]
    resposta = jsonify(lista_em_json)
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta

@app.route("/incluir_personagem", methods=['post'])
def incluir_personagem():
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    dados = request.get_json()
    try:
        p = Personagem(**dados)
        db.session.add(p)
        db.session.commit()
    except Exception as e:
        resposta = jsonify({"resultado": "erro", "detalhes":str(e)})
        resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta

@app.route("/excluir_personagem/<int:personagem_id>", methods=['DELETE']) 
def excluir_personagem(personagem_id): 
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"}) 
    try: 
        Personagem.query.filter(Personagem.id == personagem_id).delete()  
        db.session.commit() 
    except Exception as e:   
        resposta = jsonify({"resultado":"erro", "detalhes":str(e)})  
    resposta.headers.add("Access-Control-Allow-Origin", "*") 
    return resposta

app.run(debug=True, port=5000)