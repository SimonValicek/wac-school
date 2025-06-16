import { newSpecPage } from '@stencil/core/testing';
import { XvaliceksWacSchoolWlEditor } from '../xvaliceks-wac-school-wl-editor';

describe('xvaliceks-wac-school-wl-editor', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XvaliceksWacSchoolWlEditor],
      html: `<xvaliceks-wac-school-wl-editor></xvaliceks-wac-school-wl-editor>`,
    });
    expect(page.root).toEqualHtml(`
      <xvaliceks-wac-school-wl-editor>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </xvaliceks-wac-school-wl-editor>
    `);
  });
});
