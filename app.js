// Bay Beach Intake & Triage State Management
let currentStep = 1;
let intakeData = {
  urgency: 'routine',
  petName: '',
  species: 'cat',
  breed: '',
  age: '',
  symptoms: '',
  fearFree: true,
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  preferredTime: ''
};

// Urgency Radio Listeners
document.querySelectorAll('input[name="urgency"]').forEach(elem => {
  elem.addEventListener('change', (e) => {
    intakeData.urgency = e.target.value;
    const banner = document.getElementById('emergencyBanner');
    if (e.target.value === 'emergency') {
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  });
});

function goToStep(step) {
  currentStep = step;
  
  // Hide all steps
  document.querySelectorAll('.step-view').forEach(view => {
    view.classList.remove('active');
  });

  // Activate target step
  const target = document.getElementById(`step${step}`);
  if (target) {
    target.classList.add('active');
  }

  // Update Indicator Nodes
  document.querySelectorAll('.step-node').forEach(node => {
    const nodeStep = parseInt(node.getAttribute('data-step'));
    node.classList.remove('active', 'completed');
    if (nodeStep === step) {
      node.classList.add('active');
    } else if (nodeStep < step) {
      node.classList.add('completed');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateAndGoToStep3() {
  const petName = document.getElementById('petName').value.trim();
  if (!petName) {
    alert('Please enter your pet's name.');
    document.getElementById('petName').focus();
    return;
  }

  intakeData.petName = petName;
  intakeData.species = document.getElementById('species').value;
  intakeData.breed = document.getElementById('breed').value.trim();
  intakeData.age = document.getElementById('age').value.trim();
  intakeData.symptoms = document.getElementById('symptoms').value.trim();
  intakeData.fearFree = document.getElementById('fearFreePref').checked;

  goToStep(3);
}

function submitIntake() {
  const ownerName = document.getElementById('ownerName').value.trim();
  const ownerPhone = document.getElementById('ownerPhone').value.trim();
  const ownerEmail = document.getElementById('ownerEmail').value.trim();

  if (!ownerName || !ownerPhone || !ownerEmail) {
    alert('Please provide your name, phone number, and email.');
    return;
  }

  intakeData.ownerName = ownerName;
  intakeData.ownerPhone = ownerPhone;
  intakeData.ownerEmail = ownerEmail;
  intakeData.preferredTime = document.getElementById('preferredTime').value.trim();

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.innerText = 'Staging Check-In... ⏳';
  submitBtn.disabled = true;

  // Simulate instant API transmission
  setTimeout(() => {
    renderSuccessScreen();
  }, 600);
}

function renderSuccessScreen() {
  // Hide progress bar
  document.querySelector('.progress-container').style.display = 'none';

  // Hide step 3
  document.getElementById('step3').classList.remove('active');

  // Build Summary Card HTML
  const urgencyLabel = intakeData.urgency === 'emergency' ? '🚨 Acute Emergency' : 
                       (intakeData.urgency === 'sick' ? '💧 Same-Day Sick Triage' : '🩺 Routine Checkup');

  const summaryHtml = `
    <div class="summary-row">
      <span class="summary-label">Patient:</span>
      <span class="summary-val">${intakeData.petName} (${intakeData.species.toUpperCase()})</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Triage Urgency:</span>
      <span class="summary-val">${urgencyLabel}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Owner / Contact:</span>
      <span class="summary-val">${intakeData.ownerName} (${intakeData.ownerPhone})</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Discharge Email:</span>
      <span class="summary-val">${intakeData.ownerEmail}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Fear-Free Protocol:</span>
      <span class="summary-val">${intakeData.fearFree ? '✅ Enabled (Low-stress handling)' : 'Standard'}</span>
    </div>
    ${intakeData.symptoms ? `
    <div class="summary-row">
      <span class="summary-label">Notes for Dr. Key:</span>
      <span class="summary-val">${intakeData.symptoms}</span>
    </div>` : ''}
  `;

  document.getElementById('summaryCard').innerHTML = summaryHtml;
  document.getElementById('successScreen').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  document.querySelector('.progress-container').style.display = 'block';
  document.getElementById('petForm').reset();
  document.getElementById('ownerForm').reset();
  document.getElementById('submitBtn').innerText = 'Complete Smart Check-In 🐾';
  document.getElementById('submitBtn').disabled = false;
  goToStep(1);
}
