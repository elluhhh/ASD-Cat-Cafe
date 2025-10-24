/** @jest-environment jsdom */
// Sarah White

const { getFilterValues } = require('../public/js/filterUtils.js');
const { validateAdoptionRequestUpdate } = require('../public/js/requestValidator.js');

describe('getCatFilterValues', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="catFilter">
        <input type="text" name="name" />
        <input type="radio" name="gender" value="female" />
        <input type="radio" name="gender" value="male" />
      </form>
    `;

    document.querySelector('input[name="name"]').value = 'Whiskers';
    document.querySelector('input[value="male"]').checked = true;
  });

  test('if cat filter returns correct values for name and gender', () => {
    const form = document.getElementById('catFilter');
    const fields = [
      { name: 'name', type: 'text' },
      { name: 'gender', type: 'radio' }
    ];

    const params = getFilterValues(form, fields);

    expect(params.get('name')).toBe('Whiskers');
    expect(params.get('gender')).toBe('male');
  });
});

describe('getAdoptionRequestFilterValues', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="requestFilter">
        <select name="status">
          <option value="">All</option>
          <option value="RECEIVED">Received</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="REJECTED">Rejected</option>
          <option value="APPROVED">Approved</option>
        </select>
      </form>
    `;

    document.querySelector('select[name="status"]').value = 'RECEIVED';
  });

  test('if filter returns correct values for selected status', () => {
    const form = document.getElementById('requestFilter');
    const fields = [{ name: 'status', type: 'select' }];

    const params = getFilterValues(form, fields);
    expect(params.get('status')).toBe('RECEIVED');
  });
});

describe('validateAdoptionRequestUpdate', () => {
  test('if valid input returns no errors', () => {
    const result = validateAdoptionRequestUpdate({
      name: 'Susy May',
      email: 'susy@email.com',
      address: '78 Greenway Blvd, Sydney NSW',
      whyAdopt: 'I really, really want a cat'
    });
    expect(result).toEqual([]);
  });

  it('should catch invalid name', () => {
    const result = validateAdoptionRequestUpdate({
      name: 'Susy May7!',
      email: 'susymay7@email.com',
      address: '78 Greenway Blvd, Sydney NSW',
      whyAdopt: 'I love cats so bad'
    });
    expect(result).toContain('Name contains invalid characters');
  });
});
