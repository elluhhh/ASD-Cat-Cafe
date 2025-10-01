const form = document.getElementById('adoption-form');
const confirmation = document.getElementById('confirmation');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Gather form data
  const data = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    reason: document.getElementById('reason').value.trim(),
    submittedAt: new Date().toISOString()
  };

  // Save to localStorage (for demo)
  const requests = JSON.parse(localStorage.getItem('adoptionRequests') || "[]");
  requests.push(data);
  localStorage.setItem('adoptionRequests', JSON.stringify(requests));

  // Hide form, show confirmation
  form.classList.add('hidden');
  confirmation.classList.remove('hidden');

  console.log("Adoption request submitted:", data);
});