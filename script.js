let totalGastos = 0;
let totalLucros = 0;
let gastos = [];
let lucros = [];

// Salvar dados no Local Storage
function salvarParametros() {
  const parametros = {
    totalGastos,
    totalLucros,
    gastos,
    lucros,
  };
  localStorage.setItem('parametrosFinanceiros', JSON.stringify(parametros));
}

// Recuperar dados do Local Storage
function recuperarParametros() {
  const dados = localStorage.getItem('parametrosFinanceiros');
  if (dados) {
    const { totalGastos: tg, totalLucros: tl, gastos: g, lucros: l } = JSON.parse(dados);
    totalGastos = tg;
    totalLucros = tl;
    gastos = g;
    lucros = l;
    atualizarDashboard();
    atualizarRelatorios();
  }
}

// Atualizar dashboard
function atualizarDashboard() {
  document.getElementById('gastosTotais').textContent = totalGastos.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
  });
  document.getElementById('lucrosTotais').textContent = totalLucros.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
  });

  const saldoTotal = totalLucros - totalGastos;
  const saldoSpan = document.getElementById('saldosTotais');
  saldoSpan.textContent = saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  saldoSpan.className = saldoTotal >= 0 ? 'saldo-positivo' : 'saldo-negativo';
}

// Atualizar relatórios com checkboxes
function atualizarRelatorios() {
  const gastosList = document.getElementById('gastosList');
  const lucrosList = document.getElementById('lucrosList');
  gastosList.innerHTML = '';
  lucrosList.innerHTML = '';

  gastos.forEach((gasto, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" class="checkboxGasto" data-index="${index}" />
      ${gasto.descricao} - R$ ${gasto.valor.toLocaleString('pt-BR')} - ${gasto.data} - ${gasto.banco}
    `;
    gastosList.appendChild(li);
  });

  lucros.forEach((lucro, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" class="checkboxLucro" data-index="${index}" />
      ${lucro.descricao} - R$ ${lucro.valor.toLocaleString('pt-BR')} - ${lucro.data} - ${lucro.banco}
    `;
    lucrosList.appendChild(li);
  });
}

// Eventos de submissão
document.getElementById('formGastos').addEventListener('submit', function (e) {
  e.preventDefault();
  const descricao = document.getElementById('descricaoGasto').value;
  let valorString = document.getElementById('valorGasto').value.trim();
  const data = document.getElementById('dataGasto').value;
  const banco = document.getElementById('bancoGasto').value;

  valorString = valorString.replace('.', '').replace(',', '.');
  const valor = parseFloat(valorString);

  if (!valor || valor <= 0 || !data || !banco) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  totalGastos += valor;
  gastos.push({ descricao, valor, data, banco });

  atualizarDashboard();
  atualizarRelatorios();
  salvarParametros();
  this.reset();
});

document.getElementById('formLucros').addEventListener('submit', function (e) {
  e.preventDefault();
  const descricao = document.getElementById('descricaoLucro').value;
  let valorString = document.getElementById('valorLucro').value.trim();
  const data = document.getElementById('dataLucro').value;
  const banco = document.getElementById('bancoLucro').value;

  valorString = valorString.replace('.', '').replace(',', '.');
  const valor = parseFloat(valorString);

  if (!valor || valor <= 0 || !data || !banco) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  totalLucros += valor;
  lucros.push({ descricao, valor, data, banco });

  atualizarDashboard();
  atualizarRelatorios();
  salvarParametros();
  this.reset();
});

// Limpar gastos selecionados
document.getElementById('limparGastosSelecionados').addEventListener('click', function () {
  const checkboxes = document.querySelectorAll('.checkboxGasto:checked');
  checkboxes.forEach((checkbox) => {
    const index = parseInt(checkbox.dataset.index, 10);
    totalGastos -= gastos[index].valor;
    gastos.splice(index, 1);
  });

  salvarParametros();
  atualizarDashboard();
  atualizarRelatorios();
});

// Limpar lucros selecionados
document.getElementById('limparLucrosSelecionados').addEventListener('click', function () {
  const checkboxes = document.querySelectorAll('.checkboxLucro:checked');
  checkboxes.forEach((checkbox) => {
    const index = parseInt(checkbox.dataset.index, 10);
    totalLucros -= lucros[index].valor;
    lucros.splice(index, 1);
  });

  salvarParametros();
  atualizarDashboard();
  atualizarRelatorios();
});

// Inicializar aplicação
recuperarParametros();
