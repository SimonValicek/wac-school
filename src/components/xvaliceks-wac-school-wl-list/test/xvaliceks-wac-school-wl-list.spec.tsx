import { newSpecPage } from '@stencil/core/testing';
import { XvaliceksWacSchoolWlList } from '../xvaliceks-wac-school-wl-list';

describe('xvaliceks-wac-school-wl-list', () => {
  it('renders correct number of list items', async () => {
    const page = await newSpecPage({
      components: [XvaliceksWacSchoolWlList],
      html: `<xvaliceks-wac-school-wl-list></xvaliceks-wac-school-wl-list>`,
    });

    const wlList = page.rootInstance as XvaliceksWacSchoolWlList;
    const expectedPatients = wlList?.waitingPatients?.length ?? 0;

    const items = page.root.shadowRoot.querySelectorAll('md-list-item');
    expect(items.length).toEqual(expectedPatients);
  });
});
