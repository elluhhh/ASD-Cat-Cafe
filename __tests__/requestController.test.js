/** @jest-environment jsdom */
const { getFilterValues } = require('../public/js/filterUtils.js');

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
    })    
})
