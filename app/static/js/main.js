const form = document.getElementById('file-form');
const message = document.getElementById('message');
form.addEventListener('submit', e => {
    e.preventDefault();
    const file = form.elements['file'].files[0];
    const formData = new FormData();
    formData.append('file', file);
    fetch('http://localhost:5000/file', {
    method: 'POST',
    body: formData
    })
    .then(response => response.json())
    .then(data => {
        message.innerText = data.message;
    })
    .catch(error => {
        message.innerText = 'An error occurred. Please try again.';
    });
});