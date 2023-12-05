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

//submit claims
document.querySelector('#form-sort').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;

    let member = form.querySelector('#member').value.toLowerCase().trim();
    let character = form.querySelector('#character').value.toLowerCase().trim();
    let account = form.querySelector('#accountid').value.split(`showuser=`)[1] ? form.querySelector('#accountid').value.split(`showuser=`)[1] : form.querySelector('#accountid').value.trim();
    let age = form.querySelector('#age').value.toLowerCase().trim();
    let face = form.querySelector('#face').value.toLowerCase().trim();
    let occupation = form.querySelector('#occupation').value.toLowerCase().trim();
    let apartment = form.querySelector('#apartment').value.toLowerCase().trim();
    let ability = form.querySelector('#ability').value.toLowerCase().trim();
    let wanted = e.currentTarget.querySelector('#request').options[e.currentTarget.querySelector('#request').selectedIndex].value === 'y' ? 'Yes' : 'No';
    let wantedURLs = e.currentTarget.querySelector('#request-data').value;

    let embedTitle = `${capitalize(member)} has requested sorting for ${capitalize(character)}`;
    let message = `${capitalize(character)} should be placed in the ${capitalize(group)} group.\n\n**Profile:** https://coves.jcink.net/?showuser=${account}\n**Requested?** ${wanted}`;
    if (wanted === 'Yes') {
        message += `\n${wantedURLs}`;
    }
    message += `\n\nPlease follow the sorting procedure, available in Processes > #sorting of this Discord server. React to this notification when you begin reviewing the application.`;

    let publicTitle = `${capitalize(member)} has finished ${capitalize(character)}!`;
    let publicMessage = `**Learn More:** <https://coves.jcink.net/?showuser=${account}>`;
    if (wanted === 'Yes') {
        publicMessage += `\n\n*This character fills one or more requests. Members managing those requests will be contacted prior to character approval and sorting.*`;
    }

    let data = {
        "SubmissionType": "claims-submit",
        Member: member,
        Character: character,
        AccountID: account,
        Face: face,
        Occupation: occupation,
        Age: age,
        Apartment: apartment,
        Ability: ability,
    }
    let discord = {
        staffTitle: embedTitle,
        staffMessage: message,
        publicTitle: publicTitle,
        publicMessage: publicMessage
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful! Please refresh the guidebook and double check your claims. They may take up to a minute to display. If you need to edit them, please do so on the <a href="#edit">Edit a Character</a> form. If the option is not available, contact staff using the <a href="#moderation">Request Staff Help</a> form.</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth">Back to form</button>`;

    submitClaims(data, discord, successMessage);
});

//is request toggle
let sortForm = document.querySelector('#form-sort');
let requestField = sortForm.querySelector('#request');
toggleFieldVisibility(sortForm, requestField, '.ifRequest');
requestField.addEventListener('change', e => {
    toggleFieldVisibility(sortForm, e.currentTarget, '.ifRequest');
});

//edit claims
document.querySelector('#form-edit').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;

    let member = form.querySelector('#member').value.toLowerCase().trim();
    let character = form.querySelector('#character').value.toLowerCase().trim();
    let account = form.querySelector('#accountid').value.split(`showuser=`)[1] ? form.querySelector('#accountid').value.split(`showuser=`)[1] : form.querySelector('#accountid').value.trim();
    let age = form.querySelector('#age').value.toLowerCase().trim();
    let face = form.querySelector('#face').value.toLowerCase().trim();
    let occupation = form.querySelector('#occupation').value.toLowerCase().trim();
    let apartment = form.querySelector('#apartment').value.toLowerCase().trim();
    let selectedChanges = Array.prototype.slice.call(form.querySelectorAll('[name="update"]')).filter(item => item.checked).map(item => item.value);

    let embedTitle = `${capitalize(member)} has made edits to ${capitalize(character)} (#${account})`;

    let data = {
        "SubmissionType": "claims-edit",
        Member: member,
        Character: character,
        AccountID: account,
        Face: face,
        Occupation: occupation,
        Age: age,
        Apartment: apartment,
        SelectedChanges: selectedChanges,
    }
    let discord = {
        staffTitle: embedTitle
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful! Please refresh the guidebook and double check your claims. They may take up to a minute to display.</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth">Back to form</button>`;

    updateClaims(data, discord, successMessage);
});

//update toggles
let editForm = document.querySelector('#form-edit');
let updateBoxes = editForm.querySelectorAll('[name="update"]');
updateBoxes.forEach(box => {
    if(box.dataset.updateClass) {
        toggleCheckVisibility(editForm, box, box.dataset.updateClass);
        box.addEventListener('change', e => {
            toggleCheckVisibility(editForm, e.currentTarget, e.currentTarget.dataset.updateClass);
        });
    }
})

//character announcements
document.querySelector('#form-announce').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;

    let member = form.querySelector('#member').value.toLowerCase().trim();
    let character = form.querySelector('#character').value.toLowerCase().trim();
    let account = form.querySelector('#accountid').value.split(`showuser=`)[1] ? form.querySelector('#accountid').value.split(`showuser=`)[1] : form.querySelector('#accountid').value.trim();
    let groupField = form.querySelector('#group');
    let group = groupField.options[groupField.selectedIndex].innerText.toLowerCase().trim();
    let groupID = groupField.options[groupField.selectedIndex].value;
    let ability = form.querySelector('#ability').value.toLowerCase().trim();
    let note = form.querySelector('#note').value.trim();

    let publicTitle = `Welcome to ${capitalize(character)}!`;
    let publicMessage = `${note}\n\n**Learn More:** <https://coves.jcink.net/?showuser=${account}>`;

    let data = {
        "SubmissionType": "claims-edit",
        Member: member,
        Character: character,
        AccountID: account,
        Ability: ability,
        Group: group,
        GroupID: groupID,
    }
    let discord = {
        publicTitle: publicTitle,
        publicMessage: publicMessage
    }

    let successMessage = `<blockquote class="fullWidth">Character announcement complete!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth">Back to form</button>`;

    announceCharacter(data, discord, successMessage);
});

//mod form
document.querySelector('#form-mod').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;

    let member = form.querySelector('#member').value.toLowerCase();
    let account = form.querySelector('#account').value.toLowerCase();
    let ip = form.querySelector('#ip').value.toLowerCase();
    let typeField = form.querySelector('#type');
    let type = typeField.options[typeField.selectedIndex].innerText;
    let request = form.querySelector('#request').value.trim();

    let staffTitle = `${capitalize(member)} (#${account}, ${ip}) would like some help!`;
    let staffMessage = `**Type:** ${type}\n**Request:**\n${request}`;

    sendDiscordMessage(`https://discord.com/api/webhooks/${discordServer}/${staffSubmitHook}`, staffMessage, staffTitle);
    
    form.innerHTML = `<blockquote class="fullWidth">Help request sent!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth">Back to form</button>`;

    window.scrollTo(0, 0);
});