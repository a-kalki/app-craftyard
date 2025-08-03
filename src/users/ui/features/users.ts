import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { UserAttrs } from '#users/domain/user/struct/attrs';
import type { UserContributionKey } from '#users/domain/user-contributions/types';
import { USER_CONTRIBUTIONS_DETAILS } from '#users/domain/user-contributions/constants';

@customElement('users-list')
export class UsersWidget extends BaseElement {
  static styles = css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
        overflow-y: auto;
        padding: 16px;
        box-sizing: border-box;
      }

      .users-list-wrapper {
        max-width: 1200px;
        margin: 0 auto;
      }

      .controls {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      }

      .filter-control {
        min-width: 200px;
      }

      .grid {
        display: grid;
        gap: 16px;
        width: 100%;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      @media (max-width: 768px) {
        :host {
          padding-top: 32px;
        }
        
        .controls {
          flex-direction: column;
        }
      }

      user-card {
        width: 100%;
        min-width: 0;
      }
    `
  ;

  @state()
  private users: UserAttrs[] = [];

  @state()
  private filteredUsers: UserAttrs[] = [];

  @state()
  private selectedContributions: (UserContributionKey | 'all')[] = ['all'];

  @state()
  private contributions: {value: UserContributionKey | 'all', label: string}[] = [
    {value: 'all', label: 'Все пользователи'}
  ];

  async connectedCallback() {
    super.connectedCallback();
    await this.loadUsers();
  }

  private async loadUsers() {
    const result = await this.userApi.getUsers();
    if (result.isFailure()) {
      this.app.error('Не удалось загрузить пользователей', { details: result.value });
      return;
    }
    this.users = result.value;
    this.updateAvailableContributions();
    this.filterUsers();
  }

  private updateAvailableContributions() {
    const existingContributions = new Set<UserContributionKey>();
    
    this.users.forEach(user => {
      if (user.statistics?.contributions) {
        Object.keys(user.statistics.contributions).forEach(key => {
          const contributionKey = key as UserContributionKey;
          if (user.statistics.contributions[contributionKey]) {
            existingContributions.add(contributionKey);
          }
        });
      }
    });

    this.contributions = [
      {value: 'all', label: 'Все пользователи'},
      ...Array.from(existingContributions)
        .filter(key => USER_CONTRIBUTIONS_DETAILS[key])
        .sort((a, b) => {
          return (USER_CONTRIBUTIONS_DETAILS[a].orderNumber || 0) - 
                 (USER_CONTRIBUTIONS_DETAILS[b].orderNumber || 0);
        })
        .map(key => ({
          value: key,
          label: USER_CONTRIBUTIONS_DETAILS[key].title
        }))
    ];
  }

  private filterUsers() {
    if (this.selectedContributions.includes('all') || this.selectedContributions.length === 0) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user => 
      this.selectedContributions.some(contribution => 
        contribution !== 'all' && user.statistics?.contributions[contribution]
      )
    );
  }

private handleContributionChange(e: CustomEvent) {
  const select = e.target as HTMLSelectElement;
  const newValues = Array.from(select.selectedOptions).map(opt => opt.value as UserContributionKey | 'all');

  // Определяем, что изменилось
  const changedValue = 
    newValues.find(v => !this.selectedContributions.includes(v)) || 
    this.selectedContributions.find(v => !newValues.includes(v));

  if (!changedValue) return;

  // Если выбрали "Все"
  if (changedValue === 'all') {
    this.selectedContributions = ['all'];
  } 
  // Если выбрали что-то другое
  else {
    // Если был выбран "Все" - снимаем его
    let newSelection = this.selectedContributions.includes('all') 
      ? [] 
      : [...this.selectedContributions];
    
    // Toggle выбранного пункта
    if (newSelection.includes(changedValue)) {
      newSelection = newSelection.filter(v => v !== changedValue);
    } else {
      newSelection = [...newSelection, changedValue];
    }

    // Если ничего не выбрано - выбираем "Все"
    this.selectedContributions = newSelection.length > 0 ? newSelection : ['all'];
  }

  // Обновляем значение в select
  select.value = this.selectedContributions as any;
  this.filterUsers();
  this.requestUpdate();
}

  render() {
    return html`
      <div class="users-list-wrapper">
        <div class="controls">
          <sl-select 
            class="filter-control"
            .value=${this.selectedContributions}
            multiple
            @sl-change=${this.handleContributionChange}
          >
            ${this.contributions.map(contribution => html`
              <sl-option 
                value=${contribution.value}
                ?selected=${this.selectedContributions.includes(contribution.value)}
              >
                ${contribution.label}
              </sl-option>
            `)}
          </sl-select>
        </div>

        <div class="grid">
          ${this.filteredUsers.map(user => html`
            <user-card .user=${user}></user-card>
          `)}
        </div>
      </div>
    `;
  }
}
