import Sequelize, { DataTypes } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config();

export const database = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DATABASE_HOST,
  logging: false
});

export const UserApp = database.define('user_app', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  uuid: DataTypes.STRING,

  data_cadastro: DataTypes.DATE,
  data_cadastro_ptbr: DataTypes.STRING,
  data_cadastro_mes: DataTypes.STRING,
  data_cadastro_ano_mes: DataTypes.STRING,
  data_cadastro_ano_mes_label: DataTypes.STRING,
  data_cadastro_dia_semana: DataTypes.STRING,
  data_cadastro_hora: DataTypes.STRING,

  endereco_pais_code: DataTypes.STRING,
  endereco_pais: DataTypes.STRING,
  endereco_estado: DataTypes.STRING,
  endereco_cidade: DataTypes.STRING,
  endereco_codigo_postal: DataTypes.STRING,
  endereco_latitude: DataTypes.DECIMAL(20, 10),
  endereco_longitude:DataTypes.DECIMAL(20, 10),

  perfil_genero: DataTypes.STRING,
  perfil_idade: DataTypes.INTEGER,
  perfil_faixa_etaria: DataTypes.STRING,
  perfil_escolaridade: DataTypes.STRING,

  teste_interesses_resultado1: DataTypes.STRING,
  teste_interesses_resultado2: DataTypes.STRING,
  teste_interesses_resultado: DataTypes.STRING,
  teste_interesses_num_respostas: DataTypes.INTEGER,

  teste_valores_resultado_label: DataTypes.STRING,
  teste_valores_resultado: DataTypes.STRING,
  teste_valores_num_respostas: DataTypes.INTEGER

},{
  timestamps: false,
  freezeTableName: true
});

export const RecomandacaoCurso = database.define('recomendacao_curso', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  uuid: DataTypes.STRING,

  data_cadastro: DataTypes.DATE,
  data_cadastro_ptbr: DataTypes.STRING,
  endereco_pais: DataTypes.STRING,
  endereco_estado: DataTypes.STRING,
  endereco_cidade: DataTypes.STRING,
  endereco_codigo_postal: DataTypes.STRING,
  endereco_latitude: DataTypes.DECIMAL(20, 10),
  endereco_longitude:DataTypes.DECIMAL(20, 10),

  perfil_genero: DataTypes.STRING,
  perfil_idade: DataTypes.INTEGER,
  perfil_faixa_etaria: DataTypes.STRING,
  perfil_escolaridade: DataTypes.STRING,

  curso:  DataTypes.STRING,
  eixo_curso: DataTypes.STRING,
  peso: DataTypes.INTEGER

},{
  timestamps: false,
  freezeTableName: true
});

export const InstituicaoCurso = database.define('instituicao_curso', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  cnpj: DataTypes.STRING,
  nome: DataTypes.STRING,

  curso: DataTypes.STRING,
  modalidade: DataTypes.STRING,
  tipo_oferta: DataTypes.STRING,
  eixo_curso: DataTypes.STRING,

  codEscola: DataTypes.STRING,
  email: DataTypes.STRING,
  site: DataTypes.STRING,
  sistema_ensino: DataTypes.STRING,
  tipo_escola: DataTypes.STRING,
  latitude:  DataTypes.DECIMAL(20,10),
  longitude:  DataTypes.DECIMAL(20,10),
  municipio: DataTypes.STRING,
  uf: DataTypes.STRING,
  dependencia: DataTypes.STRING
  
},{
  timestamps: false,
  freezeTableName: true
});