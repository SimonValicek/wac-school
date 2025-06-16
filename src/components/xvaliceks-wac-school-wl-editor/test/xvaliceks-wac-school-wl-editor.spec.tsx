import { newSpecPage } from '@stencil/core/testing';
import { XvaliceksWacSchoolWlEditor } from '../xvaliceks-wac-school-wl-editor';

describe('xvaliceks-wac-school-wl-editor', () => {
  it('renders input fields and buttons', async () => {
    const page = await newSpecPage({
      components: [XvaliceksWacSchoolWlEditor],
      html: `<xvaliceks-wac-school-wl-editor></xvaliceks-wac-school-wl-editor>`,
    });

    const shadow = page.root.shadowRoot;

    expect(shadow.querySelectorAll('md-filled-text-field').length).toBe(3);
    expect(shadow.querySelector('md-slider')).not.toBeNull();
    expect(shadow.querySelector('md-filled-select')).not.toBeNull();
    expect(shadow.querySelector('md-divider')).not.toBeNull();
    expect(shadow.querySelector('md-filled-button')).not.toBeNull();
    expect(shadow.querySelector('md-filled-tonal-button')).not.toBeNull();
    expect(shadow.querySelector('md-outlined-button')).not.toBeNull();
  });
});
