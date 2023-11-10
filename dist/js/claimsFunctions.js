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

function formatClaimsRow(columns, group = null) {
    let classes = `claims--item`;
    if(group) {
        classes += ` g-${group}`;
    }
    let html = `<tr class="${classes}">
        ${columns.map(column => `<td>${column}</td>`).join('')}
    </tr>`;

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
    console.log(data);
}
function formatCharacters(data) {
    console.log(data);
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
        }
    });
}
function reloadForm(e) {
	e.parentNode.innerHTML = storedHTML;
    if(e.parentNode && e.parentNode.querySelector('.warning')) {
        e.parentNode.querySelector('.warning').remove();
    }
}