(() => {
    'use strict'
    document.getElementById('images').addEventListener('change', function (e) {
        const label = document.querySelector(`label[for="${this.id}"]`);
        const files = Array.from(this.files).map(file => file.name).join(', ');
        label.textContent = "Selected Images : "+files || "Upload Campground Images";
    });

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

