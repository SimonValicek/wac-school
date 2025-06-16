import { newE2EPage } from '@stencil/core/testing';

describe('xvaliceks-wac-school-wl-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xvaliceks-wac-school-wl-list></xvaliceks-wac-school-wl-list>');

    const element = await page.find('xvaliceks-wac-school-wl-list');
    expect(element).toHaveClass('hydrated');
  });
});
