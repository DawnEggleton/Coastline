function sendDiscordMessage(webhook, message, embedTitle, notification = null, color = null) {
    const request = new XMLHttpRequest();
    request.open("POST", webhook);

    request.setRequestHeader('Content-type', 'application/json');

    const params = {
        "content": notification,
        "embeds": [
            {
            "title": embedTitle,
            "description": message,
            "color": parseInt(color, 16)
            }
        ],
        "attachments": []
	};

    request.send(JSON.stringify(params));
}

function formatClaimsRow(columns, classes = ``) {
    let html = `<tr class="${classes}">
        ${columns.map(column => `<td>${column}</td>`).join('')}
    </tr>`;

    return html;
}
function formatClaimsBlockOpen(columns, title, accordion = false, classes = ``) {
    let html = ``;
    if (accordion) {
        html += `<div class="accordion member-directory">
        <div class="accordion--trigger">${title}</div>
        <div class="accordion--content">`;
    }
    if(!accordion && title) {
        html += `<h2>${title}</h2>`;
    }
    html += `<table class="${classes}">
                <thead>
                    <tr>
                        ${columns.map(column => `<th ${column.sort && `data-sort-by="${column.sort}"`}>${column.title}<i class="ph-bold ph-arrow-up"></i><i class="ph-bold ph-arrow-down"></i></th>`).join('')}
                    </tr>
                </thead>
                <tbody>`;
    return html;
}
function formatClaimsBlockClose(accordion = false) {
    let html = `</tbody>
            </table>`;
    if (accordion) {
        html += `</div>
        </div>`;
    }
    return html;
}

function formatReserves(data) {
    //filter out inactive reserves
    let current = new Date();
    let active = data.filter(item => {
        let time = new Date(item.Timestamp);
        let difference = Math.floor(((current - time) / (1000*60*60*24)));
        return difference < 22;
    });
    active.sort((a, b) => {
        if (a.Face < b.Face) {
            return -1;
        } else if (a.Face > b.Face) {
            return 1;
        } else {
            return 0;
        }
    });
    //format html
    let html = ``;
    active.forEach(reserve => {
        let reserveDate = new Date(reserve.Timestamp);
        reserveDate.setDate(reserveDate.getDate() + 14);
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october',	'november', 'december'];
        let columns = [
            reserve.Face,
            reserve.Member,
            `${months[reserveDate.getMonth()]} ${reserveDate.getDate()}, ${reserveDate.getFullYear()}`
        ];
        html += formatClaimsRow(columns);
    });
    if (html === ``) {
        html = `<tr class="claim--notice"><td>No active reservations.</td></tr>`;
    }
    document.querySelector(`.clip--reserves`).insertAdjacentHTML('beforeend', html);
}
function formatMembers(data) {
    data.sort((a, b) => {
        if (a.Member < b.Member) {
            return -1;
        } else if (a.Member > b.Member) {
            return 1;
        } if (a.Character < b.Character) {
            return -1;
        } else if (a.Character > b.Character) {
            return 1;
        } else {
            return 0;
        }
    });
    let html = ``;

    for(let i = 0; i < data.length; i++) {
        //first instance: new member block open, character block
        if(i === 0) {
            html += formatClaimsBlockOpen([
                {title: `Character`},
                {title: `Age`, sort: 'number'},
                {title: `Apartment`, sort: 'number'},
                {title: `Power`},
                {title: `Occupation`}
            ],
            data[i].Member,
            true,
            'claims');
            html += formatClaimsRow([
                `<a href="?showuser=${data[i].AccountID}">${data[i].Character}</a>`,
                data[i].Age,
                data[i].Apartment,
                data[i].Ability,
                data[i].Occupation,
            ],
            `g-${data[i].GroupID}`);
        }
        //if new member: close previous member block, open new member block, character block
        else if (i !== 0 && data[i].Member !== data[i - 1].Member) {
            html += formatClaimsBlockClose(true);
            html += formatClaimsBlockOpen([
                {title: `Character`},
                {title: `Age`, sort: 'number'},
                {title: `Apartment`, sort: 'number'},
                {title: `Power`},
                {title: `Occupation`}
            ],
            data[i].Member,
            true,
            'claims');
            html += formatClaimsRow([
                `<a href="?showuser="${data[i].AccountID}">${data[i].Character}</a>`,
                data[i].Age,
                data[i].Apartment,
                data[i].Ability,
                data[i].Occupation,
            ],
            `g-${data[i].GroupID}`);
        }
        //if new character: character block
        else if (i !== 0 && data[i].Member === data[i - 1].Member) {
            html += formatClaimsRow([
                `<a href="?showuser="${data[i].AccountID}">${data[i].Character}</a>`,
                data[i].Age,
                data[i].Apartment,
                data[i].Ability,
                data[i].Occupation,
            ],
            `g-${data[i].GroupID}`);
        }
        //if last instance: close member block
        if(i === data.length -1) {
            html += formatClaimsBlockClose(true);
        }
    }

    document.querySelector(`.clip--members`).insertAdjacentHTML('beforeend', html);
}
function formatCharacters(data) {
    data.sort((a, b) => {
        if (a.Character < b.Character) {
            return -1;
        } else if (a.Character > b.Character) {
            return 1;
        } else {
            return 0;
        }
    });
    let html = ``;

    for(let i = 0; i < data.length; i++) {
        html += formatClaimsRow([
            `<a href="?showuser="${data[i].AccountID}">${data[i].Character}</a>`,
            data[i].Face,
            data[i].Ability,
            data[i].Apartment,
            data[i].Member,
        ],
        `g-${data[i].GroupID}`);
    }

    document.querySelector(`.clip--characters`).insertAdjacentHTML('beforeend', html);
}

function submitReserves(data, discord, successMessage) {
	let form = document.querySelector(`#form-reserve`);
	storedHTML = form.innerHTML;
    form.querySelector('[type="submit"]').innerText = 'Submitting...';
    if(form.querySelector('.warning')) {
        form.querySelector('.warning').remove();
    }

    fetch(`https://opensheet.elk.sh/${sheetID}/Claims`)
    .then((response) => response.json())
    .then((claimData) => {
        let created = claimData.filter(item => item.Face === data.face);
        if(created.length > 0) {
            if(form.querySelector('.warning')) {
                form.querySelector('.warning').remove();
            }
            form.insertAdjacentHTML('afterbegin', `<blockquote class="fullWidth warning">Uh-oh! This face is already in play!</blockquote>`);
        } else {

            fetch(`https://opensheet.elk.sh/${sheetID}/Reserves`)
            .then((response) => response.json())
            .then((reserveData) => {
                let existing = reserveData.filter(item => item.Face === data.face);
                let oldReserves = [];
        
                if(existing.length > 0) {
                    existing.forEach((reserve, i) => {
                        let current = new Date();
                        let time = new Date(reserve.Timestamp);
                        let difference = Math.floor(((current - time) / (1000*60*60*24)));
                        if(difference < 22) {
                            if(form.querySelector('.warning')) {
                                form.querySelector('.warning').remove();
                            }
                            form.insertAdjacentHTML('afterbegin', `<blockquote class="fullWidth warning">Uh-oh! Someone else has an active reservation on that face already.</blockquote>`);
                        
                            form.querySelector('[type="submit"]').innerText = 'Submit';
                        } else {
                            oldReserves.push(reserve);
                            existing.splice(i, 1);
                        }
                    });
                    if(existing.length > 0) {
                        if(form.querySelector('.warning')) {
                            form.querySelector('.warning').remove();
                        }
                        form.insertAdjacentHTML('afterbegin', `<blockquote class="fullWidth warning">Uh-oh! Someone else has an active reservation on that face already.</blockquote>`);
                    
                        form.querySelector('[type="submit"]').innerText = 'Submit';
                    } else {
                        let hasReserved = false;
                        oldReserves.forEach(reserve => {
                            if(reserve.Member === data.member) {
                                if(form.querySelector('.warning')) {
                                    form.querySelector('.warning').remove();
                                }
                                form.insertAdjacentHTML('afterbegin', `<blockquote class="fullWidth warning">Uh-oh! You've reserved that face before! Reserves at Coastline are non-renewable. If you don't remember doing this, please reach out to staff via Discord and we can review our records and discuss options with you!</blockquote>`);
                            } else {
                                sendAjax(form, data, discord, successMessage);
                            }
                        });
                    }
                } else {
                    sendAjax(form, data, discord, successMessage);
                }
            });
        }
    });
    
    return false;
}
function submitClaims(data, discord, successMessage) {
	let form = document.querySelector(`#form-sort`);
	storedHTML = form.innerHTML;
    form.querySelector('[type="submit"]').innerText = 'Submitting...';
    if(form.querySelector('.warning')) {
        form.querySelector('.warning').remove();
    }

    fetch(`https://opensheet.elk.sh/1mrdIG_MZ-f0jBHb-8_5aRGCczs5f3sl5WglDF0D1XwU/Claims`)
    .then((response) => response.json())
    .then((claimsData) => {
        let existing = claimsData.filter(item => item.AccountID === data.AccountID);

        if(existing.length === 0) {
            $(form).trigger('reset');
            sendAjax(form, data, discord, successMessage);
        } else {
            form.insertAdjacentHTML('afterbegin', `<blockquote class="fullWidth warning">Uh-oh! Someone else already exists on the sheet with that ID. Please double check it's entered correctly and reach out to staff if you need help!</blockquote>`);
        
            form.querySelector('button[type="submit"]').innerText = 'Submit';
        }
        
        window.scrollTo(0, 0);
    });
}

function updateClaims(data, discord, successMessage) {
	let form = document.querySelector(`#form-edit`);
	storedHTML = form.innerHTML;
    form.querySelector('[type="submit"]').innerText = 'Submitting...';
    if(form.querySelector('.warning')) {
        form.querySelector('.warning').remove();
    }

    fetch(`https://opensheet.elk.sh/${sheetID}/Claims`)
    .then((response) => response.json())
    .then((claimsData) => {
        let existing = claimsData.filter(item => item.AccountID === data.AccountID);

        if(existing.length === 1) {
            existing = existing[0];
            let original = {...existing};
            discord.message = ``;

            if(data.SelectedChanges.includes('alias')) {
                existing.Member = data.Member;
                if(discord.message !== '') {
                    discord.message += `\n`
                }
                discord.message += `**Alias Change:** From ${capitalize(original.Member)} to ${capitalize(existing.Member)}`;
            }

            if(data.SelectedChanges.includes('name')) {
                existing.Character = data.Character;
                if(discord.message !== '') {
                    discord.message += `\n`
                }
                discord.message += `**Name Change:** From ${capitalize(original.Character)} to ${capitalize(existing.Character)}`;
            }

            if(data.SelectedChanges.includes('age')) {
                existing.Age = data.Age;
                if(discord.message !== '') {
                    discord.message += `\n`
                }
                discord.message += `**Age Change:** From ${capitalize(original.Age)} to ${capitalize(existing.Age)}`;
            }

            if(data.SelectedChanges.includes('face')) {
                existing.Face = data.Face;
                if(discord.message !== '') {
                    discord.message += `\n`
                }
                discord.message += `**Face Change:** From ${capitalize(original.Face)} to ${capitalize(existing.Face)}`;
            }

            if(data.SelectedChanges.includes('apartment')) {
                existing.Apartment = data.Apartment;
                if(discord.message !== '') {
                    discord.message += `\n`
                }
                discord.message += `**Apartment Change:** From ${capitalize(original.Apartment)} to ${capitalize(existing.Apartment)}`;
            }

            if(data.SelectedChanges.includes('occupation')) {
                existing.Occupation = data.Occupation;
                if(discord.message !== '') {
                    discord.message += `\n`
                }
                discord.message += `**Job Change:** From ${capitalize(original.Occupation)} to ${capitalize(existing.Occupation)}`;
            }

            existing.SubmissionType = data.SubmissionType;
            
            $(form).trigger('reset');

            sendAjax(form, existing, discord, successMessage)
        } else {
            form.insertAdjacentHTML('afterbegin', `<blockquote class="fullWidth warning">Uh-oh! This character doesn't exist on the sheet. Have they been <a href="#sort">sorted</a> yet?</blockquote>`);
        
            $('#form-sort button[type="submit"]').text('Submit');
        }
        
        window.scrollTo(0, 0);
    });
    
    return false;
}
function sendAjax(form, data, discord, successMessage) {
    $(form).trigger('reset');
    
    $.ajax({
        url: `https://script.google.com/macros/s/${deployID}/exec`,   
        data: data,
        method: "POST",
        type: "POST",
        dataType: "json", 
        success: function () {
            switch(data.SubmissionType) {
                case 'reserve-submit':
                    sendDiscordMessage(`https://discord.com/api/webhooks/${discordServer}/${reservesHook}`, discord.staffMessage, discord.staffTitle);
                    break;
                case 'claims-submit':
                    sendDiscordMessage(`https://discord.com/api/webhooks/${discordServer}/${staffSubmitHook}`, discord.staffMessage, discord.staffTitle);
                    break;
                case 'claims-edit':
                    sendDiscordMessage(`https://discord.com/api/webhooks/${discordServer}/${staffSubmitHook}`, discord.message, discord.staffTitle);
                    break;
                default:
                    console.log('Success');
                    break;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
            document.querySelector('.form--sort-warning').innerHTML = `Whoops! The sheet connection didn't quite work. Please refresh the page and try again! If this persists, please open the console (ctrl + shift + J) and send Lux a screenshot of what's there.`;
        },
        complete: function () {
            $('#form-reserve button[type="submit"]').text('Submit');
            
            form.innerHTML = successMessage;

            window.scrollTo(0, 0);
            switch(data.SubmissionType) {
                case 'claims-submit':
                    sendDiscordMessage(`https://discord.com/api/webhooks/${discordServer}/${submitHook}`, discord.publicMessage, discord.publicTitle);
                    break;
                default:
                    console.log('Complete');
                    break;
            }
        }
    });
}
function reloadForm(e) {
	e.parentNode.innerHTML = storedHTML;
    if(e.parentNode && e.parentNode.querySelector('.warning')) {
        e.parentNode.querySelector('.warning').remove();
    }
}