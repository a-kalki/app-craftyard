import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { UserDod } from '../../../app/app-domain/dod';

@customElement('users-list')
export class UsersWidget extends BaseElement {
  static routingAttrs = {
    pattern: '/users',
    tag: 'users-list',
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    @media (max-width: 600px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  @state()
  private users: UserDod[] = [];

  async connectedCallback() {
    super.connectedCallback();
    this.users = await this.loadUsers();
  }

  private async loadUsers(): Promise<UserDod[]> {
    const nurJSON = `{
  "id": "773084180",
  "name": "Nurbolat",
  "roles": ["HOBBYIST", "MASTER", "MENTOR"],
  "profile": {
    "skills": {
      "Топограф": "Профессиональная специализация. Опыт работы 3 года в проектном институте. Дальше опыт развития своего профильного бизнеса.",
      "GIS специлаист": "Профессиональная специализация параллельная основной специализации топографа. Представляет собой смешение картографа и it специалиста. Есть опыт реализации реализации gis проекта магистрального газопровода АО Интергаз Центральная Азия.",
      "Бизнесмен": "Опыт развития бизнеса по инженерным изысканиями для капитального строительства (2005-2018 года). После 2018 года переход в сферу IT и четыре неудачных стартапа в сфере цифровизации страны. Сейчас больше самоидентифицирую себя как стартапер.",
      "Программист": "Самоучка. 22 года опыта как хоббист. 8 лет опыта как профессионал. Имею опыт разработки системных архитектур. Больше специализируюсь в бэкенде. Преподавал. Как минимум пять учеников устроились на работу, в том числе двое в американский стартап.",
      "Столяр": "Любитель, но на данном этапе (2025 год) активно развиваю этот навык в связи с развитием нового стартапа: коворкинг-мастерская Дедок.",
      "3d моделист": "Умею на полулюбительском, полупрофессиональном уровне разрабатывать 3d модели. Только твердотельное моделирование. Начинал с fusion360, продолжил на OnShape, сейчас остановился на FreeCad так как оно бесплатное и есть CAM модуль.",
      "Оператор ЧПУ": "Опыт не сказать что большой, но все таки есть опыт разработки g-коде программ как для трехосевого, так и четырехосевого (с поворотным механзмиом, аля токарный станок). Правда станок небольшой любительский со столом 60x40 см. На данный момент осваиваю бесплатное ПО linuxCNC.",
      "Электротехник": "Нравится и разрабатывать электронику. Но опыт пожалуй на самом любительском уровне, в связи со сложной дисциплиной. Но все же устройства чуть сложнее простых мне думаю по силам спроектировать и сделать.",
      "Робототехника": "Имею опыт разработки программ для микроконтроллеров. Опыт не большой, но хорошей поддержкой является профильная специализация программиста web приложении. Самый крутой мой проект (и пожалуй единственный доведенный до конца вместе с электротехникой): реализация проводной двухколесной машинки работающей на ШИМ сигналах реализованного на МК AVR ATmegaXXX на языке Assembler."
    },
    "avatarUrl": "https://t.me/i/userpic/320/bOrpGbX5Jq3fbysH_VoGshRjzc7AAw_J6UARzLI-qUQ.svg"
  },
  "joinedAt": 1735862400000
}`
    const nur = JSON.parse(nurJSON);
    // 🔧 Заглушка, заменить реальным источником данных
    return Array.from({ length: 6 }, (_, i) => ({
      ...nur,
      id: String(Number(nur.id) + 1)
    }));
  }


  render() {
    return html`
      <div class="grid">
        ${this.users.map(
          (user) => html`
            <user-card
              .user=${user}
              @click=${(e: MouseEvent) => this.handleSelectCard(e, user.id)}
            ></user-card>
          `
        )}
      </div>
    `;
  }

  private handleSelectCard(e: MouseEvent, id: string): void {
    e.preventDefault();
    this.app.router.navigate(`/users/${id}`);
  }
}
