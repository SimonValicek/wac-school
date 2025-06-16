import { newSpecPage } from '@stencil/core/testing';
import fetchMock from 'jest-fetch-mock';
import { XvaliceksWacSchoolWlList } from '../xvaliceks-wac-school-wl-list';
import { WaitingListEntry } from '../../../api/waiting-list';

describe('xvaliceks-wac-school-wl-list', () => {
  beforeAll(() => fetchMock.enableMocks());
  afterEach(() => fetchMock.resetMocks());

  const sampleEntries: WaitingListEntry[] = [
    {
      id: 'entry-1',
      patientId: 'p-1',
      name: 'Juraj Prvý',
      waitingSince: new Date('2024-02-03T12:00:00Z'),
      estimatedStart: new Date('2024-02-03T12:20:00Z'),
      estimatedDurationMinutes: 20,
      condition: {
        value: 'Test condition',
        code: 'test',
        reference: 'https://example.com',
        typicalDurationMinutes: 10
      }
    },
    {
      id: 'entry-2',
      patientId: 'p-2',
      name: 'James Druhý',
      waitingSince: new Date('2024-02-03T12:00:00Z'),
      estimatedStart: new Date('2024-02-03T12:05:00Z'),
      estimatedDurationMinutes: 5,
      condition: {
        value: 'Another condition',
        code: 'another',
        reference: 'https://example.com',
        typicalDurationMinutes: 5
      }
    }
  ];

  it('renders sample entries', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(sampleEntries));

    const page = await newSpecPage({
      components: [XvaliceksWacSchoolWlList],
      html: `<xvaliceks-wac-school-wl-list
               api-base="http://test/api"
               ambulance-id="test-ambulance">
             </xvaliceks-wac-school-wl-list>`,
    });
    await page.waitForChanges();

    const items = page.root.shadowRoot.querySelectorAll('md-list-item');
    expect(items.length).toEqual(sampleEntries.length);
  });

  it('renders error message on network failure', async () => {
    fetchMock.mockRejectOnce(new Error('Network Offline'));

    const page = await newSpecPage({
      components: [XvaliceksWacSchoolWlList],
      html: `<xvaliceks-wac-school-wl-list
               api-base="http://test/api"
               ambulance-id="test-ambulance">
             </xvaliceks-wac-school-wl-list>`,
    });
    await page.waitForChanges();

    const error = page.root.shadowRoot.querySelector('.error');
    const items = page.root.shadowRoot.querySelectorAll('md-list-item');

    expect(error).not.toBeNull();
    expect(items.length).toBe(0);
  });
});
