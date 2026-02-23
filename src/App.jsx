import "./App.css";

const juices = [
  {
    id: "verde-detox",
    name: "Suco Verde Detox",
    portion: "300 ml",
    ingredients: ["Couve", "Maçã verde", "Limão", "Gengibre", "Água de coco"],
    nutrition: {
      calories: 92,
      carbs: "20 g",
      proteins: "2 g",
      fats: "0,6 g",
      fibers: "4,5 g",
      sodium: "22 mg",
    },
    allergens: "Pode conter traços de aipo e castanhas (ambiente compartilhado).",
    benefits: [
      "Apoio ao funcionamento intestinal por ser rico em fibras.",
      "Alta densidade de vitamina C e compostos antioxidantes.",
      "Sensação de leveza para iniciar o dia.",
    ],
  },
  {
    id: "laranja-acerola",
    name: "Laranja com Acerola",
    portion: "300 ml",
    ingredients: ["Laranja", "Acerola", "Cenoura", "Água filtrada"],
    nutrition: {
      calories: 108,
      carbs: "24 g",
      proteins: "1,8 g",
      fats: "0,4 g",
      fibers: "3,1 g",
      sodium: "14 mg",
    },
    allergens: "Não contém alergênicos adicionados. Naturalmente sem lactose e sem glúten.",
    benefits: [
      "Reforço de vitamina C para a imunidade.",
      "Carotenoides da cenoura que contribuem para saúde da pele.",
      "Boa opção para hidratação com sabor cítrico.",
    ],
  },
  {
    id: "vermelho-energetico",
    name: "Vermelho Energético",
    portion: "300 ml",
    ingredients: ["Beterraba", "Morango", "Maçã", "Chia", "Água de coco"],
    nutrition: {
      calories: 124,
      carbs: "25 g",
      proteins: "2,7 g",
      fats: "2,1 g",
      fibers: "5,2 g",
      sodium: "28 mg",
    },
    allergens: "Pode conter traços de castanhas e amendoim (linha de produção compartilhada).",
    benefits: [
      "Fonte natural de nitratos da beterraba para performance.",
      "Combinação antioxidante de morango e maçã.",
      "Maior saciedade pelo teor de fibras e chia.",
    ],
  },
];

function App() {
  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Casa dos Sucos · Transparência Nutricional</p>
        <h1>Informações nutricionais completas de cada suco</h1>
        <p>
          Veja ingredientes, tabela nutricional, alergênicos e benefícios para escolher com
          confiança o suco ideal para sua rotina.
        </p>
      </header>

      <main className="juice-grid" aria-label="Informações nutricionais dos sucos">
        {juices.map((juice) => (
          <article key={juice.id} className="juice-card">
            <h2>{juice.name}</h2>
            <p className="portion">Porção: {juice.portion}</p>

            <section>
              <h3>Ingredientes</h3>
              <ul>
                {juice.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3>Tabela nutricional (por porção)</h3>
              <table>
                <tbody>
                  <tr>
                    <th>Valor energético</th>
                    <td>{juice.nutrition.calories} kcal</td>
                  </tr>
                  <tr>
                    <th>Carboidratos</th>
                    <td>{juice.nutrition.carbs}</td>
                  </tr>
                  <tr>
                    <th>Proteínas</th>
                    <td>{juice.nutrition.proteins}</td>
                  </tr>
                  <tr>
                    <th>Gorduras totais</th>
                    <td>{juice.nutrition.fats}</td>
                  </tr>
                  <tr>
                    <th>Fibras alimentares</th>
                    <td>{juice.nutrition.fibers}</td>
                  </tr>
                  <tr>
                    <th>Sódio</th>
                    <td>{juice.nutrition.sodium}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h3>Alergênicos</h3>
              <p>{juice.allergens}</p>
            </section>

            <section>
              <h3>Benefícios</h3>
              <ul>
                {juice.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </section>
          </article>
        ))}
      </main>
    </div>
  );
}

export default App;
