const answers = {};

document.querySelectorAll(".choices button").forEach(button => {
  button.addEventListener("click", () => {
    const group = button.dataset.group;
    answers[group] = button.dataset.value;

    document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
      b.classList.remove("selected");
    });

    button.classList.add("selected");
  });
});

function selectedText(value) {
  const map = {
    stable: "estável",
    loose: "solto",
    rotation: "com mais rotação",
    aggressive: "forte/agressivo",
    progressive: "progressivo",
    understeer: "sai de frente",
    oversteer: "sai de traseira",
    none: "equilibrado",
    early: "acelerar cedo",
    safe: "mais segurança",
    yes: "sim",
    no: "não"
  };
  return map[value] || value;
}

function makeSetup() {
  let brake = "Equilibrado";
  let antiRoll = "Médio";
  let differential = "Médio";
  let suspension = "Médio";
  let aero = "Médio";
  let tire = "Base do carro";
  let explanation = [];

  if (answers.problem === "understeer") {
    antiRoll = "Mais macia na dianteira";
    aero = "Um pouco mais de apoio dianteiro";
    explanation.push("Como você sente o carro saindo de frente, a recomendação busca aumentar a capacidade de rotação do eixo dianteiro.");
  }

  if (answers.problem === "oversteer") {
    antiRoll = "Mais estável na traseira";
    differential = "Mais progressivo";
    explanation.push("Como a traseira está escapando, a prioridade é deixar a transferência de carga mais previsível.");
  }

  if (answers.entry === "rotation") {
    suspension = "Mais responsiva";
    explanation.push("Você gosta de rotação na entrada, então o setup prioriza uma frente mais responsiva.");
  }

  if (answers.entry === "stable") {
    suspension = "Mais estável";
    explanation.push("A estabilidade na entrada foi priorizada para deixar a frenagem e o início da curva mais previsíveis.");
  }

  if (answers.brake === "aggressive") {
    brake = "Resposta forte";
    explanation.push("O freio foi direcionado para uma resposta mais agressiva.");
  } else if (answers.brake === "progressive") {
    brake = "Resposta progressiva";
    explanation.push("O freio foi pensado para facilitar a modulação e o controle.");
  }

  if (answers.exit === "early") {
    differential = "Focado em tração";
    explanation.push("Como você quer acelerar cedo, a saída de curva recebe prioridade.");
  }

  if (answers.curbs === "yes") {
    suspension = "Mais tolerante às zebras";
    explanation.push("Como você usa bastante as zebras, o setup busca tolerar melhor mudanças de piso.");
  }

  if (answers.stability === "stable") {
    aero = "Mais apoio / estabilidade";
    explanation.push("Seu perfil indica preferência por estabilidade.");
  }

  if (answers.stability === "loose") {
    aero = "Mais liberdade de rotação";
    explanation.push("Seu perfil aceita um carro mais solto, permitindo mais rotação.");
  }

  return { brake, antiRoll, differential, suspension, aero, tire, explanation };
}

document.getElementById("generate").addEventListener("click", () => {
  const car = document.getElementById("car");
  const track = document.getElementById("track");

  if (!car.value || !track.value) {
    alert("Escolha o carro e a pista antes de gerar o setup.");
    return;
  }

  const setup = makeSetup();

  document.getElementById("summary").innerHTML = `
    <p><strong>Carro:</strong> ${car.options[car.selectedIndex].text}</p>
    <p><strong>Pista:</strong> ${track.options[track.selectedIndex].text}</p>
    <p><strong>Perfil:</strong> ${selectedText(answers.stability) || "não informado"}</p>
  `;

  document.getElementById("setup").innerHTML = `
    <div class="setup-grid">
      <div class="setup-item"><strong>Freio</strong>${setup.brake}</div>
      <div class="setup-item"><strong>Barras / equilíbrio</strong>${setup.antiRoll}</div>
      <div class="setup-item"><strong>Diferencial</strong>${setup.differential}</div>
      <div class="setup-item"><strong>Suspensão</strong>${setup.suspension}</div>
      <div class="setup-item"><strong>Aerodinâmica</strong>${setup.aero}</div>
      <div class="setup-item"><strong>Pneus</strong>${setup.tire}</div>
    </div>
  `;

  document.getElementById("explanation").innerHTML = `
    <h3>📚 Por que esse setup?</h3>
    ${setup.explanation.map(x => `<p>• ${x}</p>`).join("")}
  `;

  const result = document.getElementById("result");
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth" });
});
