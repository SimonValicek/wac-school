import { newSpecPage } from '@stencil/core/testing';
import { XvaliceksWacSchoolWlApp } from '../xvaliceks-wac-school-wl-app';

describe('xvaliceks-wac-school-wl-app', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XvaliceksWacSchoolWlApp],
      html: `<xvaliceks-wac-school-wl-app></xvaliceks-wac-school-wl-app>`,
    });
    expect(page.root).toEqualHtml(`
      <xvaliceks-wac-school-wl-app>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </xvaliceks-wac-school-wl-app>
    `);
  });
});
