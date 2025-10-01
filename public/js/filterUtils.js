// Used in the cat-display and adoptionRequests page to filter results
export function setupFilter({ formSelector, listSelector, endpoint, fields }) {
    const form = document.querySelector(formSelector);
    const list = document.querySelector(listSelector);

    async function updateList() {
        const params = new URLSearchParams();

        // get whichever fields specific filter form has
        fields.forEach(field => {
            if (field.type === 'radio') {
                const selected = document.querySelector(`input[name="${field.name}"]:checked`);
                params.append(field.name, selected ? selected.value : '');
            } else {
                const value = form[field.name]?.value || '';
                params.append(field.name, value);
            }
        });

        const res = await fetch(`${endpoint}?${params.toString()}`);
        const html = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newList = doc.querySelector(listSelector);
        list.innerHTML = newList.innerHTML;
    }

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
    clearButton?.addEventListener('click', () => {
        form.reset();
        updateList();
    });

    updateList();
}