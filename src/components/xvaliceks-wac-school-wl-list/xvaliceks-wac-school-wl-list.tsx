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
  WaitingListEntry,
  Configuration
} from '../../api/waiting-list';

@Component({
  tag: 'xvaliceks-wac-school-wl-list',
  styleUrl: 'xvaliceks-wac-school-wl-list.css',
  shadow: true,
})
export class XvaliceksWacSchoolWlList {
  @Prop() apiBase!: string;
  @Prop() ambulanceId!: string;

  @State() errorMessage: string;
  @State() waitingPatients: WaitingListEntry[] = [];

  @Event({ eventName: 'entry-clicked' })
  entryClicked!: EventEmitter<string>;

  private async getWaitingPatientsAsync(): Promise<WaitingListEntry[]> {
    try {
      const config = new Configuration({ basePath: this.apiBase });
      const api = new AmbulanceWaitingListApi(config);
      const resp = await api.getWaitingListEntriesRaw({
        ambulanceId: this.ambulanceId
      });
      if (resp.raw.status < 300) {
        return await resp.value();
      }
      this.errorMessage = `Cannot retrieve list: ${resp.raw.statusText}`;
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list: ${err.message || 'unknown'}`;
    }
    return [];
  }

  async componentWillLoad() {
    this.waitingPatients = await this.getWaitingPatientsAsync();
  }

  render() {
  return (
    <Host>
      {this.errorMessage ? (
        <div class="error">{this.errorMessage}</div>
      ) : (
        <md-list>
          {this.waitingPatients.map(p => (
            <md-list-item onClick={() => this.entryClicked.emit(p.id!)}>
              <div slot="headline">{p.name}</div>
              <div slot="supporting-text">
                Predpokladaný vstup: {new Date(p.estimatedStart!).toLocaleString()}
              </div>
              <md-icon slot="start">person</md-icon>
            </md-list-item>
          ))}
        </md-list>
      )}

      {/* Floating “+” button to create a new entry */}
      <md-filled-icon-button
        class="add-button"
        onClick={() => this.entryClicked.emit('@new')}
      >
        <md-icon>pridať</md-icon>
      </md-filled-icon-button>
    </Host>
  );
}

}
