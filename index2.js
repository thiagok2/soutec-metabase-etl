import moment from "moment";
import { MongoClient } from "mongodb";
import { DAYS, getUfFromNomeEstado, INTERESSES_RESPOSTA_LABEL, isEstadoBrasileiro, isNumeric, VALORES_RESPOSTA_LABEL} from "./helpers.js";

import {database as databasePg, UserApp, RecomandacaoCurso, InstituicaoCurso} from './db.js';

import {instituicoes} from './instituicoes-final-v5.js';
import {cursosAll} from './cursos-cnct-v3.js';

const uri = "mongodb+srv://thiago:rr5DeNK81hFLcuo9@cluster0.v8dqb.mongodb.net/test";
//const uri = "mongodb+srv://thiago:MpC97ZANJodhNvoa@cluster0.yxoek.mongodb.net/test";

const client = new MongoClient(uri);

async function testes() {
  try{
    
    const conn = await databasePg.sync();

    const databaseMongoDb = client.db("test");
    const cursosCollection = databaseMongoDb.collection("cursos");

    const result = await cursosCollection.findOne({});
    const cursosAll = result.cursos.map(c => ({
      cod: c.cod,
      eixo: c.eixoTecnologico.nome,
      nome: c.nome
    }));


    const usersCollection = databaseMongoDb.collection("users");

    const currentCursor = usersCollection.find({});
    
    const users = [];
    let i = 0;
    await currentCursor.forEach(async u => {
      if(u?.questionarios){
        const newUser  = {};
        newUser.uuid = u.uuid;
        const dataCadastro =  new Date(u?.questionarios?.updatedAt);   
        
        newUser.data_cadastro = dataCadastro.toISOString();
        newUser.data_cadastro_ptbr = moment(dataCadastro).format('DD-MM-YYYY');
        newUser.data_cadastro_string = moment(dataCadastro).format('YYYY-MM-DD');
        newUser.data_cadastro_mes = moment(dataCadastro).format('MMM');
        newUser.data_cadastro_ano_mes_label = moment(dataCadastro).format('YYYY/MMM');
        newUser.data_cadastro_ano_mes = moment(dataCadastro).format('YYYY/MM');
        newUser.data_cadastro_dia_semana = DAYS[moment(dataCadastro)?.isoWeekday()];
        newUser.data_cadastro_hora = moment(dataCadastro).format('HH')+'h';
  
        let enderecoPrincipal = u.preferencias?.enderecos.find(e => e.principal);
        if(!enderecoPrincipal)
          enderecoPrincipal = u.preferencias?.enderecos[0];
        
        newUser.endereco_estado = getUfFromNomeEstado(enderecoPrincipal?.region);

        if(isEstadoBrasileiro(newUser.endereco_estado)){
          newUser.endereco_pais = 'Brasil'
          newUser.endereco_pais_code = 'BR';
        }else{
          newUser.endereco_pais_code = enderecoPrincipal?.isoCountryCode ?? 'NA';
          newUser.endereco_pais = enderecoPrincipal?.country?.replace('Brazil', 'Brasil') ?? 'NA'
        }
        
        newUser.endereco_cidade = (enderecoPrincipal?.city || enderecoPrincipal?.subregion) ?? 'NA';
        newUser.endereco_codigo_postal = enderecoPrincipal?.postalCode ?? 'NA'; 
  
        newUser.endereco_latitude = enderecoPrincipal?.coords.latitude;
        newUser.endereco_longitude = enderecoPrincipal?.coords.longitude;
  
        newUser.perfil_genero = u.testes?.interesses?.dadosPessoais?.genero ?? 'NA';
        newUser.perfil_idade = +u.testes?.interesses?.dadosPessoais?.idade || null;
        
        if(isNumeric(newUser.perfil_idade)){
          const idadeValue = parseInt(newUser.perfil_idade);
          if(idadeValue < 15)
            newUser.perfil_faixa_etaria = '0 aos 15 anos';
          else if(idadeValue <=19)
            newUser.perfil_faixa_etaria = '15 aos 19 anos';
          else if(idadeValue <=25)
            newUser.perfil_faixa_etaria = '20 aos 25 anos';
          else
           newUser.perfil_faixa_etaria = 'maior que 25 anos';
        }else{
          newUser.perfil_faixa_etaria = 'NA';
          newUser.perfil_idade = null;
        }
  

        newUser.perfil_escolaridade = u.testes?.interesses?.dadosPessoais?.escolaridade ?? 'NA';
        
        if(u.testes?.interesses?.resultado){
          newUser.teste_interesses_resultado = u.testes?.interesses?.resultado;
          if(u.testes?.interesses?.resultado.length == 2){
            newUser.teste_interesses_resultado1 = INTERESSES_RESPOSTA_LABEL[ u.testes?.interesses?.resultado[0] ];
            newUser.teste_interesses_resultado2 = INTERESSES_RESPOSTA_LABEL[ u.testes?.interesses?.resultado[1] ];
          }
         
        }else
          newUser.teste_interesses_resultado = 'NA';
        newUser.teste_interesses_num_respostas = u.testes?.interesses?.numRespostas;
  
        newUser.teste_valores_resultado = u.testes?.valores?.resultado && u.testes?.valores?.resultado.length > 0 ? u.testes?.valores?.resultado[0] : 'NA';
        newUser.teste_valores_resultado_label = u.testes?.valores?.resultado && u.testes?.valores?.resultado.length > 0 ? VALORES_RESPOSTA_LABEL[u.testes?.valores?.resultado[0]] : 'NA';
        newUser.teste_valores_num_respostas = u.testes?.valores?.numRespostas;
  
        users.push(newUser);

        setTimeout(async () => await UserApp.create(newUser), 200);

        console.log(++i);
       
        if(u.testes?.cursosRecomendados){
          u.testes?.cursosRecomendados.grupo01.forEach(async codCursoRecomendacao => {
            const recomandacaoCurso = {...newUser};
          
            const curso =  cursosAll.find(c => c.cod == codCursoRecomendacao);
            recomandacaoCurso.curso = curso.nome;
            recomandacaoCurso.eixo_curso = curso.eixo;
  
            recomandacaoCurso.peso = 1;

            setTimeout(async () => await RecomandacaoCurso.create(recomandacaoCurso), 500);
          })
        }
      }//end check validdade
      
    });//end foreach


    console.log(`total insert: ${users.length}`);

  }finally{
    await client.close();
  }
}

async function instituicoesCursos(){
  try{
    const conn = await databasePg.sync({alter: true});

    let instituicaoOfertaList = [];
    instituicoes.forEach(i => {
      let instituicaoOferta = {...i};
    
      instituicaoOferta.latitude = i.coords.lat;
      instituicaoOferta.longitude = i.coords.lng;
    
      instituicaoOferta = {...instituicaoOferta, ...instituicaoOferta.endereco};
    
      delete instituicaoOferta.coords;
      delete instituicaoOferta.endereco;
      delete instituicaoOferta.cursos;
    
      i?.cursos.forEach(async c => {
        instituicaoOferta.curso = c.nome;
        instituicaoOferta.modalidade = c.modalidade;
        instituicaoOferta.tipo_oferta = c.tipo_oferta;
    
        instituicaoOferta.eixo_curso = cursosAll.find(c => c.nome == instituicaoOferta.curso)?.eixoTecnologico?.nome ?? 'NA';
    
        instituicaoOfertaList.push(instituicaoOferta);
        setTimeout(async () => await InstituicaoCurso.create(instituicaoOferta), 100);
        
      });
    
    });
  }catch(e){
    console.log(e.message)
  }
  

}


testes().catch(console.dir);
//instituicoesCursos().catch(console.dir);