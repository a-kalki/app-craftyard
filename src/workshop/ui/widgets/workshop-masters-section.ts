import { BaseElement } from "#app/ui/base/base-element";
import type { CommissionStrategy, IndividualCommission } from "#workshop/domain/struct/attrs";
import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('workshop-masters-section')
export class WorkshopMastersSection extends BaseElement {
  static styles = css`
    .intro-block, .commission-info-block {
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      margin-bottom: 2rem; /* Отступ между блоками */
      color: var(--sl-color-neutral-800);
      line-height: 1.6;
      font-size: 1.05rem;
      box-shadow: var(--sl-shadow-extra-small);
      word-break: break-word;   /* Добавлено для переноса слов */
      overflow-wrap: break-word; /* Добавлено для переноса слов */
    }

    .intro-block a, .commission-info-block a {
        color: var(--sl-color-primary-700);
        text-decoration: none;
    }

    .intro-block a:hover, .commission-info-block a:hover {
        text-decoration: underline;
    }

    .intro-block strong, .commission-info-block strong {
        font-weight: 600;
        color: var(--sl-color-neutral-900);
    }

    .commission-card {
      padding: 1.5rem;
    }

    .commission-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--sl-color-primary-700);
      margin-bottom: 0.75rem;
    }

    .commission-values {
      display: flex;
      gap: 2rem;
      margin-bottom: 1rem;
      flex-wrap: wrap; /* Allow wrapping for small screens */
    }

    .commission-value {
      display: flex;
      flex-direction: column;
    }

    .commission-label {
      font-size: 0.9rem;
      color: var(--sl-color-neutral-600);
    }

    .commission-percent {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--sl-color-primary-800);
    }

    .individual-commissions-list {
      display: flex;
      flex-wrap: wrap; /* Allow cards to wrap */
      gap: 1.5rem; /* Space between individual commission cards */
      margin-top: 2rem; /* Отступ между блоком скидок и индивидуальными комиссиями */
      justify-content: center; /* Центрируем карточки, если их мало */
    }

    /* Ограничение ширины для отдельной карточки индивидуальной скидки */
    .individual-commissions-list:has(> *:only-child) .individual-commission-card-wrapper {
        max-width: 450px; /* Максимальная ширина для одной карточки */
        width: 100%; /* Занимает всю доступную ширину до max-width */
    }
    .individual-commissions-list .individual-commission-card-wrapper {
        flex: 1 1 300px; /* Позволяет карточкам расти/сжиматься и иметь базовую ширину */
    }


    .individual-commissions-list h3 {
        width: 100%; /* Заголовок занимает всю ширину */
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--sl-color-primary-800);
        margin-bottom: 1rem;
        text-align: center;
    }
  `;

  @property({ type: Object })
  commissionStrategy?: CommissionStrategy;

  @property({ type: Array })
  individualCommissions?: IndividualCommission[];


  render() {
    if (!this.commissionStrategy) return html``;

    return html`
      <div class="intro-block">
        В нашей мастерской ты можешь делать "Изделия" на продажу и/или проводить "Мастер-классы".
        Мы предлагаем тебе развивать свое мастерство творчества, делиться им и получать за это денежное вознаграждение!<br><br>

        Заранее нам платить за это не надо. Оплата за использование ресурсов мастерской происходит только
        <strong>после продажи</strong> Изделия или Мастер-класса, а мы в свою очередь поможем тебе в этом,
        в том числе с материалами.<br><br>

        Изучите страницу Курсы и мастер-классы. Там мы подготовили программы,
        которые любой мастер может проводить в нашей мастерской.<br><br>
        Мы имеем успех, когда ты имеешь успех!
      </div>

      <div class="commission-card">
        <div class="commission-title">Стандартные комиссии мастерской</div>
        <div class="commission-values">
          <div class="commission-value">
            <span class="commission-label">Изделия</span>
            <span class="commission-percent">${this.commissionStrategy.productCommissionPercent}%</span>
          </div>
          <div class="commission-value">
            <span class="commission-label">Мастер-классы</span>
            <span class="commission-percent">${this.commissionStrategy.programCommissionPercent}%</span>
          </div>
        </div>
      </div>

      <div class="commission-info-block">
        Эту стоимость комиссии можно уменьшать.<br>
        Для этого мы выпускаем индивидуальные временные комиссии.
        Чтобы узнать подробности, читайте наш <a href="https://dedok.life" target="_blank" rel="noopener noreferrer">сайт</a>
        или пишите <a href="https://t.me/anzUralsk" target="_blank" rel="noopener noreferrer">нам</a>.
      </div>

      ${this.individualCommissions && this.individualCommissions.length > 0 ? html`
        <div class="commission-card">
          <div class="commission-title">Индивидуальные комиссии</div>
          ${this.individualCommissions
            .filter(c => c.validUntil > Date.now())
            .map(commission => html`
            <div class="individual-commission-card-wrapper">
                <workshop-individual-commission-card .commission=${commission}></workshop-individual-commission-card>
            </div>
          `)}
        </div>
      ` : ''}
    `;
  }
}
