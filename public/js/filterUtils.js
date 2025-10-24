// Sarah White
// Used in the cat-display and adoptionRequests page to filter results

function getFilterValues(form, fields) {
    const params = new URLSearchParams();
    
    fields.forEach(field => {
        if (field.type === 'radio') {
            const selected = form.querySelector(`input[name="${field.name}"]:checked`);
            params.append(field.name, selected ? selected.value : '');
        } else {
            const input = form.querySelector(`[name="${field.name}"]`);
            const value = input?.value || '';
            params.append(field.name, value);
        }
    });
    return params;
}

async function updateFilterList({ form, list, endpoint, fields, listSelector }) {
    const params = getFilterValues(form, fields);
    const res = await fetch(`${endpoint}?${params.toString()}`);
    const html = await res.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newList = doc.querySelector(listSelector);
    list.innerHTML = newList?.innerHTML || '';
}

function setupFilter({ formSelector, listSelector, endpoint, fields }) {
    const form = document.querySelector(formSelector);
    const list = document.querySelector(listSelector);
    const updateList = () => updateFilterList({ form, list, endpoint, fields, listSelector });

    // live update for each field
    fields.forEach(field => {
        if (field.type === 'radio') {
            document.querySelectorAll(`input[name="${field.name}"]`).forEach(el => {
                el.addEventListener('change', updateList);
            });
        } else {
            const el = form[field.name];
            if (field.live === 'input') {
                el?.addEventListener('input', updateList);
            } else {
                el?.addEventListener('change', updateList);
            }
        }
    });

    // clear filter
    const clearButton = document.getElementById('clearFilter');
    console.log('Clear button:', clearButton);
    clearButton?.addEventListener('click', () => {
        console.log('Clear clicked');
        form.reset();
        updateList();
    });

    updateList();
}

// for tests
// module.exports = {
//     getFilterValues,
//     updateFilterList,
//     setupFilter
// };

// for live filtering
export { getFilterValues, updateFilterList, setupFilter };