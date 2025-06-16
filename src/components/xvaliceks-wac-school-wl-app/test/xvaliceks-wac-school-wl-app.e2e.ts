import { newE2EPage } from '@stencil/core/testing';

describe('xvaliceks-wac-school-wl-app (e2e)', () => {
  it('displays the list inside the app', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <xvaliceks-wac-school-wl-app
        base-path="/"
        api-base="http://localhost:5001/api"
        ambulance-id="bobulova">
      </xvaliceks-wac-school-wl-app>
    `);

    // Wait for Stencil to hydrate and render
    await page.waitForChanges();

    // Query inside the shadow DOM for the list component
    const list = await page.find(
      'xvaliceks-wac-school-wl-app >>> xvaliceks-wac-school-wl-list'
    );
    expect(list).not.toBeNull();
  });
});
