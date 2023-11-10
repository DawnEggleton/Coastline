//sortable tables
document.querySelectorAll('table.claims').forEach(table => {
    initTableSort(table);
});

//reserve face
document.querySelector('#form-reserve').addEventListener('submit', e => {
    e.preventDefault();

    let member = e.currentTarget.querySelector('#member').value.toLowerCase().trim();
    let face = e.currentTarget.querySelector('#face').value.toLowerCase().trim();

    let embedTitle = `New Face Reservation`;
    let message = `${capitalize(member)} has reserved ${capitalize(face)}`;

    let data = {
        "SubmissionType": "reserve-submit",
        "Member": member,
        "Face": face,
    }
    let discord = {
        staffTitle: embedTitle,
        staffMessage: message,
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful! Reminder that face reserves will automatically expire in exactly 7 days from submission.</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth">Back to form</button>`;

    submitReserves(data, discord, successMessage);
});