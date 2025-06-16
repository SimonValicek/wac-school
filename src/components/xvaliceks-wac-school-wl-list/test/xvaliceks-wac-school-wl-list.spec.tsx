import { newSpecPage } from '@stencil/core/testing';
import fetchMock from 'jest-fetch-mock';
import { XvaliceksWacSchoolWlList } from '../xvaliceks-wac-school-wl-list';
import { WaitingListEntry } from '../../../api/waiting-list';

describe('xvaliceks-wac-school-wl-list', () => {
  beforeAll(() => fetchMock.enableMocks());
  afterEach(() => fetchMock.resetMocks());

  const sampleEntries: WaitingListEntry[] = [
    { id: 'e1', patientId: 'p1', name: 'Alice', waitingSince: new Date(), estimatedStart: new Date(), estimatedDurationMinutes: 10, condition: { value: 'c1', code: 'c1', typicalDurationMinutes: 10 } },
    { id: 'e2', patientId: 'p2', name: 'Bob',   waitingSince: new Date(), estimatedStart: new Date(), estimatedDurationMinutes: 20, condition: { value: 'c2', code: 'c2', typicalDurationMinutes: 20 } },
  ];

  it('renders list items from API', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(sampleEntries));

    const page = await newSpecPage({
      components: [XvaliceksWacSchoolWlList],
      html: `<xvaliceks-wac-school-wl-list api-base="http://test" ambulance-id="amb1"></xvaliceks-wac-school-wl-list>`,
    });
    await page.waitForChanges();

    const items = page.root.shadowRoot!.querySelectorAll('md-list-item');
    expect(items.length).toBe(sampleEntries.length);
  });

  it('shows error on network failure', async () => {
    fetchMock.mockRejectOnce(new Error('Network'));

    const page = await newSpecPage({
      components: [XvaliceksWacSchoolWlList],
      html: `<xvaliceks-wac-school-wl-list api-base="http://test" ambulance-id="amb1"></xvaliceks-wac-school-wl-list>`,
    });
    await page.waitForChanges();

    expect(page.root.shadowRoot!.querySelector('.error')).not.toBeNull();
    expect(page.root.shadowRoot!.querySelectorAll('md-list-item').length).toBe(0);
  });

});
