import { newE2EPage } from '@stencil/core/testing';

describe('xvaliceks-wac-school-wl-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xvaliceks-wac-school-wl-editor></xvaliceks-wac-school-wl-editor>');

    const element = await page.find('xvaliceks-wac-school-wl-editor');
    expect(element).toHaveClass('hydrated');
  });
});
