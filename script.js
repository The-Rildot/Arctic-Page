document.getElementById('mode-switch').addEventListener('change', function() {
    const body = document.body;
    const modeLabel = document.getElementById('mode-label');
    const elementsToToggle = document.querySelectorAll('.sun, .left-mountain, .back-mountain, .ground');
    
    if (this.checked) {
        body.classList.add('dark-mode');
        elementsToToggle.forEach(element => element.classList.add('dark-mode'));
        modeLabel.textContent = 'Night Mode';
    } else {
        body.classList.remove('dark-mode');
        elementsToToggle.forEach(element => element.classList.remove('dark-mode'));
        modeLabel.textContent = 'Day Mode';
    }
});