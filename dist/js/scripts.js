/********** Testing Only */
function toggleTesting(e) {
    e.nextElementSibling.classList.toggle('is-open');
}
//groups
let groupTest = document.querySelector('.git--test-group');
changeGroup(groupTest);
groupTest.addEventListener('change', e => {
    changeGroup(e);
});
function changeGroup(e) {
    let value = e.target ? e.target.options[e.target.selectedIndex].value : e.options[e.selectedIndex].value;
    document.querySelector('body').classList.remove('g-1', 'g-2', 'g-3', 'g-4', 'g-5', 'g-6', 'g-7', 'g-8', 'g-9', 'g-10', 'g-11');
    document.querySelector('body').classList.add(value);
}
//messages
let msgTest = document.querySelector('.git--test-msg');
changeMsg(msgTest);
msgTest.addEventListener('change', e => {
    changeMsg(e);
});
function changeMsg(e) {
    let value = e.target ? e.target.options[e.target.selectedIndex].value : e.options[e.selectedIndex].value;
    document.querySelector('.nav--msg').setAttribute('title', `Inbox (${value})`);
    document.querySelector('.nav--msg').dataset.new = value;
}
//alerts
let alertTest = document.querySelector('.git--test-alert');
changeAlert(alertTest);
alertTest.addEventListener('change', e => {
    changeAlert(e);
});
function changeAlert(e) {
    let value = e.target ? e.target.options[e.target.selectedIndex].value : e.options[e.selectedIndex].value;
    document.querySelector('.nav--alert').setAttribute('title', `Alerts (${value})`);
    document.querySelector('.nav--alert').dataset.new = value;
}
//login
initQuickLogin();

/********** Global **********/
let pageType = document.querySelector('body').id;
let pageClasses = document.querySelector('body').classList;

//click to change subaccounts
let switcher = document.querySelector('#account-switch #subaccounts_menu select');
if(switcher !== null) {
    document.querySelectorAll('select[name="sub_id"] option').forEach(account => {
        account.innerHTML = account.innerHTML.replace(/&nbsp;&nbsp;»/g,'');
    });
    initSwitcher(switcher);
}

//quick login
if(document.querySelector('body').classList.contains('g-2')) {
    initQuickLogin();
} else {
    if($('#quick-login').length) {
        $('#quick-login').remove();
    }
    $('#quick-login-clip').remove();
}

//clean up subaccounts dropdown for type to search
document.querySelectorAll('#post_as_menu option').forEach(account => {
    account.innerHTML = account.innerHTML.replace(/&nbsp;&nbsp;»/g,'');
});

/********** Initializations **********/
setTheme();
setSize();
setAnnouncement();
initModals();

/********** Window Click **********/
document.querySelector('.invisibleEl').addEventListener('click', e => {
	document.querySelector('.nav--popout').classList.remove('is-open');
	document.querySelector('.button--menu').classList.remove('is-open');
	e.target.classList.remove('menu-open');
});

/********** Index & Category **********/
if(pageType === 'idx' || pageType === 'SC') {
    initIndex();
}

/********** Topic List **********/
if(pageType === 'SF') {
    initTopicsWrap();
}

/********** Topic View **********/
if(pageType === 'ST') {
    let descript = $('.topic-desc').html();
    if (descript != undefined) {
        var newDescript = descript.replace(", ", "");
        $('.topic-desc').html(newDescript);
    }

    $('.activeuserstrip').nextUntil('.activeuserstrip').andSelf().wrapAll('<div class="activeuser--wrap"><div class="activeuser--info"></div></div>'); 
}

/********** If Accordion **********/
if(document.querySelectorAll('.accordion').length > 0) {
    initAccordion();
}