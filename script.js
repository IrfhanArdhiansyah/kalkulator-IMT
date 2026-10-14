const form = document.querySelector('#imt-form');
const weightInput = document.querySelector('#weight');
const heightInput = document.querySelector('#height');
const errorMessage = document.querySelector('#error-message');
const imtValue = document.querySelector('#imt-value');
const resultBadge = document.querySelector('#result-badge');
const resultDescription = document.querySelector('#result-description');
const scaleBar = document.querySelector('.scale-bar');
const scaleMarker = document.querySelector('#scale-marker');
const scaleSegments = document.querySelectorAll('[data-scale-category]');

const categories = [
	{
		key: 'underweight',
		max: 18.4,
		name: 'Berat kurang',
		description: 'Berat badan berada di bawah rentang ideal.',
		color: '#a36d15',
		background: '#fff2d5'
	},
	{
		key: 'ideal',
		max: 24.9,
		name: 'Ideal',
		description: 'Berat badan berada dalam rentang ideal.',
		color: '#176b47',
		background: '#dff4e8'
	},
	{
		key: 'overweight',
		max: 29.9,
		name: 'Berat berlebih',
		description: 'Berat badan berada di atas rentang ideal.',
		color: '#a15c18',
		background: '#fff0dc'
	},
	{
		key: 'obese',
		max: Infinity,
		name: 'Obesitas',
		description: 'IMT termasuk kategori obesitas.',
		color: '#ad4d42',
		background: '#ffe4df'
	}
];

function getCategory(imt) {
	return categories.find((category) => imt <= category.max);
}

function showError(message) {
	errorMessage.textContent = message;
	weightInput.setAttribute('aria-invalid', 'true');
	heightInput.setAttribute('aria-invalid', 'true');
}

function clearError() {
	errorMessage.textContent = '';
	weightInput.removeAttribute('aria-invalid');
	heightInput.removeAttribute('aria-invalid');
}

function showResult(imt, category) {
	imtValue.textContent = imt.toFixed(1);
	resultBadge.textContent = category.name;
	resultBadge.style.color = category.color;
	resultBadge.style.backgroundColor = category.background;
	resultDescription.textContent = category.description;
	updateScale(imt, category);
}

function updateScale(imt, category) {
	const categoryIndex = categories.indexOf(category);
	const ranges = [18.5, 24.9, 29.9, 40];
	const rangeStart = categoryIndex === 0 ? 0 : ranges[categoryIndex - 1];
	const rangeEnd = ranges[categoryIndex];
	const categoryProgress = Math.min(
		Math.max((imt - rangeStart) / (rangeEnd - rangeStart), 0),
		1
	);
	const position = (categoryIndex * 25) + (categoryProgress * 25);

	scaleMarker.style.left = `${position}%`;
	scaleMarker.style.backgroundColor = category.color;
	scaleMarker.title = `IMT ${imt.toFixed(1)}: ${category.name}`;
	scaleBar.classList.add('has-result');

	scaleSegments.forEach((segment) => {
		segment.classList.toggle('is-active', segment.dataset.scaleCategory === category.key);
	});
}

form.addEventListener('submit', (event) => {
	event.preventDefault();
	clearError();

	const weight = Number(weightInput.value);
	const heightInMeters = Number(heightInput.value) / 100;

	if (!weight || !heightInMeters || weight <= 0 || heightInMeters <= 0) {
		showError('Masukkan berat dan tinggi badan terlebih dahulu.');
		return;
	}

	if (weight > 500 || heightInMeters > 3) {
		showError('Masukkan angka dalam rentang yang wajar.');
		return;
	}

	const imt = weight / (heightInMeters * heightInMeters);
	showResult(imt, getCategory(imt));
});
