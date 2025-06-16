import { Component, Host, Prop, State, h } from '@stencil/core';

declare global {
  interface Window {
    navigation: any;
  }
}

@Component({
  tag: 'xvaliceks-wac-school-wl-app',
  styleUrl: 'xvaliceks-wac-school-wl-app.css',
  shadow: true,
})
export class XvaliceksWacSchoolWlApp {
  @Prop() basePath: string = '';
  @Prop() apiBase!: string;
  @Prop() ambulanceId!: string;
  @State() private relativePath = '';

  componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || '/').pathname;

    const toRelative = (path: string) => {
      this.relativePath = path.startsWith(baseUri)
        ? path.slice(baseUri.length)
        : '';
    };

    window.navigation?.addEventListener('navigate', (ev: any) => {
      if (ev.canIntercept) ev.intercept();
      const path = new URL(ev.destination.url).pathname;
      toRelative(path);
    });

    toRelative(location.pathname);
  }

  private navigateTo(path: string) {
    const absolute = new URL(path, new URL(this.basePath, document.baseURI))
      .pathname;
    window.navigation.navigate(absolute);
  }

  render() {
    // ←—— here we restore view + entryId
    let view: 'list' | 'editor' = 'list';
    let entryId = '@new';

    if (this.relativePath.startsWith('entry/')) {
      view = 'editor';
      entryId = this.relativePath.split('/')[1];
    }

    return (
      <Host>
        {view === 'editor' ? (
          <xvaliceks-wac-school-wl-editor
            entry-id={entryId}
            oneditor-closed={() => this.navigateTo('./list')}
          />
        ) : (
          <xvaliceks-wac-school-wl-list
            apiBase={this.apiBase}
            ambulanceId={this.ambulanceId}
            onEntry-clicked={(ev: CustomEvent<string>) =>
              this.navigateTo(`./entry/${ev.detail}`)
            }
          />
        )}
      </Host>
    );
  }
}
