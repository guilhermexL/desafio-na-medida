function doGet() {
  var htmlTemplate = HtmlService.createTemplateFromFile('Index');
  var htmlOutput = htmlTemplate.evaluate();
  
  htmlOutput.setTitle('Desafio Na Medida');
  htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
  htmlOutput.addMetaTag('apple-mobile-web-app-capable', 'yes');
  htmlOutput.addMetaTag('mobile-web-app-capable', 'yes');
  htmlOutput.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  
  return htmlOutput;
}

var ID_PLANILHA = "";

function salvarRegistro(dados) {
  try {
    var sheet = SpreadsheetApp.openById(ID_PLANILHA).getSheetByName("Registros");
    var dataDesejada = new Date(dados.data);
    dataDesejada.setHours(0,0,0,0);
    var dataTimestamp = dataDesejada.getTime();

    var values = sheet.getDataRange().getValues();
    var linhaExistente = -1;

    // Procura se já existe uma linha com este nome NESTA data específica
    for (var i = 1; i < values.length; i++) {
      if (values[i][1] === dados.nome) {
        var dataPlanilha = new Date(values[i][0]);
        dataPlanilha.setHours(0,0,0,0);
        if (dataPlanilha.getTime() === dataTimestamp) {
          linhaExistente = i + 1; // +1 porque a array começa em 0 e as linhas em 1
          break;
        }
      }
    }

    var linha = [dataDesejada, dados.nome, dados.atividadeDia, dados.ouro, dados.agua, dados.verdura, dados.fruta, dados.musculacao, dados.corrida, dados.extra];

    if (linhaExistente > -1) {
      // Atualiza os dados do dia (agora com 10 colunas no total)
      sheet.getRange(linhaExistente, 1, 1, 10).setValues([linha]);
    } else {
      // Se não achar o dia, cria uma linha nova
      sheet.appendRow(linha);
    }
    return "Sucesso";
  } catch(e) {
    return "Erro: " + e.toString();
  }
}

function buscarTudoUsuario(nomeBusca) {
  try {
    var sheet = SpreadsheetApp.openById(ID_PLANILHA).getSheetByName("Registros");
    var values = sheet.getDataRange().getValues();
    
    var historico = {};
    var resumoMes = { atividadeDia: 0, ouro: 0, agua: 0, verdura: 0, fruta: 0, musculacao: 0, corrida: 0, extra: 0 };

    for (var i = 1; i < values.length; i++) {
      if (values[i][1] === nomeBusca) {
        var d = new Date(values[i][0]);
        d.setHours(0,0,0,0);
        var ts = d.getTime();

        var hab = {
          atividadeDia: values[i][2] === "Sim", 
          ouro: values[i][3] === "Sim", 
          agua: values[i][4] === "Sim",
          verdura: values[i][5] === "Sim", 
          fruta: values[i][6] === "Sim",
          musculacao: values[i][7] === "Sim", 
          corrida: values[i][8] === "Sim",
          extra: values[i][9] === "Sim"
        };
        historico[ts] = hab; // Guarda os botões marcados daquele dia específico

        if (hab.atividadeDia) resumoMes.atividadeDia++;
        if (hab.ouro) resumoMes.ouro++; 
        if (hab.agua) resumoMes.agua++;
        if (hab.verdura) resumoMes.verdura++; 
        if (hab.fruta) resumoMes.fruta++;
        if (hab.musculacao) resumoMes.musculacao++; 
        if (hab.corrida) resumoMes.corrida++;
        if (hab.extra) resumoMes.extra++;
      }
    }
    return { resumo: resumoMes, historico: historico };
  } catch(e) { return null; }
}

function obterNomes() {
  try {
    var planilha = SpreadsheetApp.openById(ID_PLANILHA).getSheetByName("Resumo");
    var valores = planilha.getRange("A2:A").getValues(); 
    var nomes = [];
    for (var i = 0; i < valores.length; i++) {
      if (valores[i][0] && valores[i][0].toString().trim() !== "") {
        nomes.push(valores[i][0].toString().trim());
      }
    }
    return nomes.sort();
  } catch(e) { return []; }
}