import {
  Component,
  Prop,
  State,
  Event,
  EventEmitter,
  h,
  Host
} from '@stencil/core';
import {
  AmbulanceWaitingListApi,
  AmbulanceConditionsApi,
  WaitingListEntry,
  Configuration,
  Condition
} from '../../api/waiting-list';

@Component({
  tag: 'xvaliceks-wac-school-wl-editor',
  styleUrl: 'xvaliceks-wac-school-wl-editor.css',
  shadow: true,
})
export class XvaliceksWacSchoolWlEditor {
  @Prop() entryId!: string;
  @Prop() ambulanceId!: string;
  @Prop() apiBase!: string;

  @Event({ eventName: 'editor-closed' })
  editorClosed!: EventEmitter<'store' | 'delete' | 'cancel'>;

  @State() entry?: WaitingListEntry;
  @State() conditions: Condition[] = [];
  @State() duration = 15;
  @State() errorMessage?: string;
  @State() isValid = false;

  private formElement!: HTMLFormElement;

  componentWillLoad() {
    this.getConditions();
    this.getWaitingEntryAsync();
  }

  private async getConditions() {
    try {
      const api = new AmbulanceConditionsApi(
        new Configuration({ basePath: this.apiBase })
      );
      const resp = await api.getConditionsRaw({ ambulanceId: this.ambulanceId });
      if (resp.raw.status < 300) {
        this.conditions = await resp.value();
      }
    } catch {
      // silent fallback
    }
    if (!this.conditions.length) {
      this.conditions = [
        { code: 'fallback', value: 'Neurčený dôvod návštevy', typicalDurationMinutes: 15 }
      ];
    }
  }

  private async getWaitingEntryAsync() {
    if (this.entryId === '@new') {
      this.isValid = false;
      this.entry = {
        id: '@new',
        name: '',
        patientId: '',
        waitingSince: new Date(),
        estimatedDurationMinutes: 15,
        condition: this.conditions[0]
      } as WaitingListEntry;
      return;
    }
    try {
      const api = new AmbulanceWaitingListApi(
        new Configuration({ basePath: this.apiBase })
      );
      const resp = await api.getWaitingListEntryRaw({ ambulanceId: this.ambulanceId, entryId: this.entryId });
      if (resp.raw.status < 300) {
        this.entry = await resp.value();
        this.isValid = true;
      } else {
        this.errorMessage = `Cannot retrieve entry: ${resp.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Error: ${err.message}`;
    }
  }

  private handleInputEvent(ev: InputEvent): string {
    const target = ev.target as HTMLInputElement;
    this.isValid = true;
    const elements = Array.from(this.formElement.elements as unknown as HTMLElement[]);
    for (const el of elements) {
      if ('reportValidity' in el) {
        this.isValid &&= (el as HTMLInputElement).reportValidity();
      }
    }
    return target.value;
  }

  private handleCondition(ev: InputEvent) {
    const code = this.handleInputEvent(ev);
    const cond = this.conditions.find((c) => c.code === code);
    if (cond && this.entry) {
      this.entry.condition = { ...cond };
      this.entry.estimatedDurationMinutes = cond.typicalDurationMinutes;
      this.duration = cond.typicalDurationMinutes;
    }
  }

  private handleSliderInput(ev: InputEvent) {
    this.duration = Number.parseInt(this.handleInputEvent(ev));
  }

  private async updateEntry() {
    if (!this.entry) return;
    try {
      const api = new AmbulanceWaitingListApi(new Configuration({ basePath: this.apiBase }));
      const resp = this.entryId === '@new'
        ? await api.createWaitingListEntryRaw({ ambulanceId: this.ambulanceId, waitingListEntry: this.entry })
        : await api.updateWaitingListEntryRaw({ ambulanceId: this.ambulanceId, entryId: this.entryId, waitingListEntry: this.entry });
      if (resp.raw.status < 300) {
        this.editorClosed.emit('store');
      } else {
        this.errorMessage = `Cannot store entry: ${resp.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Error: ${err.message}`;
    }
  }

  private async deleteEntry() {
    try {
      const api = new AmbulanceWaitingListApi(new Configuration({ basePath: this.apiBase }));
      const resp = await api.deleteWaitingListEntryRaw({ ambulanceId: this.ambulanceId, entryId: this.entryId });
      if (resp.raw.status < 300) {
        this.editorClosed.emit('delete');
      } else {
        this.errorMessage = `Cannot delete entry: ${resp.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Error: ${err.message}`;
    }
  }

  render() {
    if (this.errorMessage) {
      return (
        <Host>
          <div class="error">{this.errorMessage}</div>
        </Host>
      );
    }
    if (!this.entry) {
      return <Host />;
    }
    return (
      <Host>
        <form ref={(el) => (this.formElement = el as HTMLFormElement)}>
          <md-filled-text-field label="Meno a Priezvisko" required value={this.entry.name} oninput={(ev) => (this.entry!.name = this.handleInputEvent(ev))}>
            <md-icon slot="leading-icon">person</md-icon>
          </md-filled-text-field>
          <md-filled-text-field label="Registračné číslo pacienta" required value={this.entry.patientId} oninput={(ev) => (this.entry!.patientId = this.handleInputEvent(ev))}>
            <md-icon slot="leading-icon">fingerprint</md-icon>
          </md-filled-text-field>
          <md-filled-text-field label="Čakáte od" disabled value={this.entry.waitingSince.toLocaleString()}>
            <md-icon slot="leading-icon">watch_later</md-icon>
          </md-filled-text-field>
          <md-filled-select label="Dôvod návštevy" display-text={this.entry.condition.value} oninput={(ev) => this.handleCondition(ev)}>
            <md-icon slot="leading-icon">sick</md-icon>
            {this.entry.condition.reference && (
              <md-icon slot="trailing-icon" class="link" onClick={() => window.open(this.entry.condition.reference, '_blank')}>open_in_new</md-icon>
            )}
            {this.conditions.map((c) => (
              <md-select-option value={c.code} selected={c.code === this.entry!.condition.code}>
                <div slot="headline">{c.value}</div>
              </md-select-option>
            ))}
          </md-filled-select>
        </form>
        <div class="duration-slider">
          <span class="label">Predpokladaná doba trvania: </span>
          <span class="label">{this.duration}</span><span class="label">&nbsp;minút</span>
          <md-slider min="2" max="45" value={this.entry.estimatedDurationMinutes} ticks labeled oninput={(ev) => { this.entry!.estimatedDurationMinutes = Number.parseInt(this.handleInputEvent(ev)); this.handleSliderInput(ev); }}></md-slider>
        </div>
        <md-divider inset></md-divider>
        <div class="actions">
          <md-filled-tonal-button id="delete" disabled={this.entry.id === '@new'} onClick={() => this.deleteEntry()}>
            <md-icon slot="icon">delete</md-icon>Zmazať
          </md-filled-tonal-button>
          <span class="stretch-fill"></span>
          <md-outlined-button id="cancel" onClick={() => this.editorClosed.emit('cancel')}>Zrušiť</md-outlined-button>
          <md-filled-button id="confirm" disabled={!this.isValid} onClick={() => this.updateEntry()}>
            <md-icon slot="icon">save</md-icon>Uložiť
          </md-filled-button>
        </div>
      </Host>
    );
  }
}
