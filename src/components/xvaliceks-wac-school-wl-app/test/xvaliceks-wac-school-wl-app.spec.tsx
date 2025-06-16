import { newSpecPage } from '@stencil/core/testing';
import { XvaliceksWacSchoolWlApp } from '../xvaliceks-wac-school-wl-app';
import { XvaliceksWacSchoolWlList } from "../../xvaliceks-wac-school-wl-list/xvaliceks-wac-school-wl-list";

describe('xvaliceks-wac-school-wl-app', () => {
  it('renders the list component by default', async () => {
    const page = await newSpecPage({
      components: [
        XvaliceksWacSchoolWlApp,
        XvaliceksWacSchoolWlList
      ],
      html: `<xvaliceks-wac-school-wl-app
               api-base="http://test/api"
               ambulance-id="test-ambulance">
             </xvaliceks-wac-school-wl-app>`
    });

    await page.waitForChanges();

    // The app should contain the list inside its shadow DOM
    const listEl = page.root.shadowRoot.querySelector('xvaliceks-wac-school-wl-list');
    expect(listEl).not.toBeNull();
  });
});
