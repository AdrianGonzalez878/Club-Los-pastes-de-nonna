import { PasteIcon, StepChooseIcon, StepVisitIcon } from "@/components/LoyaltyIcons";

const STEPS = [
  {
    title: "Visítanos y sella",
    body: "En cualquier sucursal te sellamos la tarjeta. Una visita, un sello.",
    icon: <StepVisitIcon />,
  },
  {
    title: "Quinta visita: elige",
    body: "Te llevas una salsa, un café o un refresco.",
    icon: <StepChooseIcon />,
  },
  {
    title: "Décima: paste de regalo",
    body: "Te llevas un paste de regalo y el ciclo vuelve a empezar.",
    icon: <PasteIcon />,
  },
];

export function HowItWorks() {
  return (
    <section className="cn-steps" aria-labelledby="como-funciona-title">
      <div className="cn-sec-h">
        <span className="cn-label">Tres pasos</span>
        <h2 id="como-funciona-title">
          Cómo <span className="cn-script">funciona</span>
        </h2>
        <div className="cn-rule" aria-hidden="true">
          <i />
        </div>
      </div>
      <ol className="cn-sl">
        {STEPS.map((step, index) => (
          <li className="cn-step" key={step.title}>
            <span className="cn-step-num" aria-hidden="true">
              {index + 1}
            </span>
            <div className="cn-step-ico">{step.icon}</div>
            <div>
              <div className="cn-step-k">Paso {index + 1}</div>
              <h3>{step.title}</h3>
            </div>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
