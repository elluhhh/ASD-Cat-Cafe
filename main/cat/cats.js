// ---------- helpers ----------
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const uid = () => 'id-' + Math.random().toString(36).slice(2,10);
const load = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.className='show'; setTimeout(()=>t.className='',1200); };

// ---------- state ----------
let cats = load('cats', [
  { id: uid(), name:'Mochi', breed:'DSH', ageMonths:12, temperament:'Calm, cuddly',
    photo:'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1200&auto=format&fit=crop',
    status:'AVAILABLE' }
]);

// ---------- render table ----------
function renderTable(filter='') {
  const term = filter.trim().toLowerCase();
  const tbody = $('#cat-table tbody');
  tbody.innerHTML = '';

  cats
    .filter(c => !term || [c.name, c.breed].some(v => (v||'').toLowerCase().includes(term)))
    .forEach(cat => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${cat.photo || 'https://placehold.co/160x100?text=Cat'}" alt="${cat.name}" style="width:80px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #e6cfc3;background:#fff"></td>
        <td>${cat.name}</td>
        <td>${cat.breed || '-'}</td>
        <td>${cat.ageMonths ?? '-'}</td>
        <td><span class="badge ${cat.status}">${cat.status}</span></td>
        <td class="actions">
          <button data-edit="${cat.id}">Edit</button>
          <button class="secondary" data-del="${cat.id}">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });

  $$('button[data-edit]', tbody).forEach(b => b.onclick = () => loadIntoForm(b.dataset.edit));
  $$('button[data-del]', tbody).forEach(b => b.onclick = () => removeCat(b.dataset.del));
}

// ---------- load/edit ----------
function loadIntoForm(id){
  const c = cats.find(x => x.id === id);
  if(!c) return;
  $('#cat-id').value = c.id;
  $('#cat-name').value = c.name;
  $('#cat-breed').value = c.breed || '';
  $('#cat-age').value = c.ageMonths ?? '';
  $('#cat-temp').value = c.temperament || '';
  $('#cat-photo').value = c.photo || '';
  $('#cat-status').value = c.status;
  updatePreview();
  toast('Loaded for editing');
}

// ---------- delete ----------
function removeCat(id){
  const c = cats.find(x => x.id === id);
  if(!c) return;
  if(!confirm(`Delete ${c.name}? This cannot be undone.`)) return;
  cats = cats.filter(x => x.id !== id);
  save('cats', cats);
  renderTable($('#cat-search').value);
  toast('Deleted');
}

// ---------- preview ----------
function updatePreview(){
  const url = $('#cat-photo').value.trim();
  $('#photo-preview').src = url || 'https://placehold.co/360x240?text=Photo';
}
$('#cat-photo').addEventListener('input', updatePreview);

// ---------- submit/save ----------
$('#cat-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const id = $('#cat-id').value || uid();
  const payload = {
    id,
    name: $('#cat-name').value.trim(),
    breed: $('#cat-breed').value.trim(),
    ageMonths: $('#cat-age').value ? parseInt($('#cat-age').value, 10) : null,
    temperament: $('#cat-temp').value.trim(),
    photo: $('#cat-photo').value.trim(),
    status: $('#cat-status').value
  };

  if(!payload.name){ alert('Name is required'); return; }

  const existing = cats.find(c => c.id === id);
  if(existing) Object.assign(existing, payload);
  else cats.push(payload);

  save('cats', cats);
  renderTable($('#cat-search').value);
  $('#cat-form').reset();
  $('#cat-id').value = '';
  updatePreview();
  toast('Saved');
});

// ---------- reset ----------
$('#reset-btn').addEventListener('click', ()=>{
  $('#cat-id').value = '';
  updatePreview();
});

// ---------- search ----------
$('#cat-search').addEventListener('input', (e)=> renderTable(e.target.value));

// ---------- init ----------
updatePreview();
renderTable();