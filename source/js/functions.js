/****** Utilities ******/
function fixMc(str) {
    return (""+str).replace(/Mc(.)/g, function(m, m1) {
        return 'Mc' + m1.toUpperCase();
    });
}
function fixMac(str) {
    return (""+str).replace(/Mac(.)/g, function(m, m1) {
        return 'Mac' + m1.toUpperCase();
    });
}
function capitalize(str, separators = [` `, `'`, `-`]) {
    separators = separators || [ ' ' ];
    var regex = new RegExp('(^|[' + separators.join('') + '])(\\w)', 'g');
    let first = str.split(' ')[0].replace(regex, function(x) { return x.toUpperCase(); });
    let last = fixMac(fixMc(str.split(' ').slice(1).join(' ').replace(regex, function(x) { return x.toUpperCase(); })));
    return `${first} ${last}`;
}
function capitalizeMultiple(selector) {
    document.querySelectorAll(selector).forEach(character => {
        character.innerText = capitalize(character.innerText);
    });
}

/****** Settings ******/
function setTheme() {
    if(localStorage.getItem('theme') !== null) {
        switch(localStorage.getItem('theme')) {
            case 'light':
                document.querySelector('body').classList.remove('dark');
                document.querySelector('body').classList.add('light');
                break;
            case 'dark':
            default:
                document.querySelector('body').classList.add('dark');
                document.querySelector('body').classList.remove('light');
                break;
        }
    } else {
        document.querySelector('body').classList.add('light');
        document.querySelector('body').classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}
function setSize() {
    if(localStorage.getItem('size') !== null) {
        switch(localStorage.getItem('size')) {
            case 'large':
                document.querySelector('body').classList.remove('smFont');
                document.querySelector('body').classList.add('lgFont');
                break;
            case 'small':
            default:
                document.querySelector('body').classList.remove('lgFont');
                document.querySelector('body').classList.add('smFont');
                break;
        }
    } else {
        document.querySelector('body').classList.remove('lgFont');
        document.querySelector('body').classList.add('smFont');
        localStorage.setItem('size', 'small');
    }
}
function setAnnouncement() {
    if(sessionStorage.getItem('hideAnnouncement') === null || sessionStorage.getItem('hideAnnouncement') !== 'true') {
        document.querySelector('.announce').classList.add('is-visible');
    }
}

/****** Toggles ******/
function toggleTheme() {
    if(localStorage.getItem('theme') === 'dark') {
        localStorage.setItem('theme', 'light');
        setTheme();
    } else {
        localStorage.setItem('theme', 'dark');
        setTheme();
    }
}
function toggleSize() {
    if(localStorage.getItem('size') === 'small') {
        localStorage.setItem('size', 'large');
        setSize();
    } else {
        localStorage.setItem('size', 'small');
        setSize();
    }
}
function toggleMenu(e) {
    let menu = document.querySelector('.nav--popout');
    if (e.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        e.classList.remove('is-open');
	    document.querySelector('.invisibleEl').classList.remove('menu-open');
    } else {
        menu.classList.add('is-open');
        e.classList.add('is-open');
	    document.querySelector('.invisibleEl').classList.add('menu-open');
    }
}
function hideAnnouncement(e) {
    sessionStorage.setItem('hideAnnouncement', 'true');
    e.parentNode.classList.remove('is-visible');
}

/****** Initializations ******/
function initModals() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', () => {
            let modalTag = popup.dataset.modal,
                modals = document.querySelectorAll('.modal'),
                modal;
            for(let i = 0; i < modals.length; i++) {
                if(modals[i].dataset.modalBox === modalTag) {
                    modal = modals[i];
                    modal.classList.toggle('is-open');
                }
            }
        });
    });
    document.querySelectorAll('.modal').forEach(modal => {
        window.addEventListener('click', e => {
            if(e.target.classList.contains('modal') || e.target.classList.contains('modal--close') || (e.target.parentNode && e.target.parentNode.classList.contains('modal--close')) || (e.target.parentNode && e.target.parentNode.parentNode && e.target.parentNode.parentNode.classList.contains('modal--close'))) {
                modal.classList.remove('is-open');
            }
        });
    });
}
function initSwitcher() {
	let characters = switcher.querySelectorAll('option');
	let newSwitch = `<div class="switch" data-type="grid" data-columns="5" data-gap="sm">`;
	characters.forEach((character, i) => {
		if(i !== 0) {
			let characterName = character.innerText.trim();
			let characterId = character.value;
            let siteString = `uploads2/coves`;
			newSwitch += `<label class="switch-block">
				<input type="checkbox" value="${characterId}" onchange="this.form.submit()" name="sub_id" />
				<div style="background-image: url(https://files.jcink.net/${siteString}/av-${characterId}.png), url(https://files.jcink.net/${siteString}/av-${characterId}.gif), url(https://files.jcink.net/${siteString}/av-${characterId}.jpg), url(https://files.jcink.net/${siteString}/av-${characterId}.jpeg), url(https://picsum.photos/250);"></div>
				<b>${capitalize(characterName)}</b>
			</label>`;
		}
	});
	newSwitch += `</div>`;
	switcher.insertAdjacentHTML('afterend', newSwitch);
	switcher.remove();
}
function initQuickLogin() {
    if($('#quick-login').length) {
        $('#quick-login').appendTo('#quick-login-clip');
        document.querySelector('#quick-login-clip input[name="UserName"]').setAttribute('placeholder', 'Username');
        document.querySelector('#quick-login-clip input[name="PassWord"]').setAttribute('placeholder', 'Password');
    } else {
        var main_url = location.href.split('?')[0];
        $.get(main_url, function (data) {
            $('#quick-login', data).appendTo('#quick-login-clip');
            document.querySelector('#quick-login-clip input[name="UserName"]').setAttribute('placeholder', 'Username');
            document.querySelector('#quick-login-clip input[name="PassWord"]').setAttribute('placeholder', 'Password');
        });
    }
}
function initIndex() {
    let topics = document.querySelector('#recent-topics table').outerHTML;
    document.querySelector('#recent-topics').remove();
    document.querySelector('.stats--recent-topics-clip').innerHTML = topics;
}
function initTopicsWrap() {
    $(`.macro--header`).each(function (index) {
        $(this).nextUntil(`.macro--header`).wrapAll(`<div class="topiclist--section"></div>`);
    });
}
function initAccordion() {
    document.querySelectorAll('.accordion').forEach(accordion => {
        let triggers = accordion.querySelectorAll('.accordion--trigger');
        let contents = accordion.querySelectorAll('.accordion--content');
        if(window.innerWidth <= 480) {
            triggers.forEach(trigger => trigger.classList.remove('is-open'));
            contents.forEach(trigger => trigger.classList.remove('is-open'));
        }
        triggers.forEach(trigger => {
            trigger.addEventListener('click', e => {
                let alreadyOpen = false;
                if(e.currentTarget.classList.contains('is-open')) {
                    alreadyOpen = true;
                }
                console.log(alreadyOpen);
                triggers.forEach(trigger => trigger.classList.remove('is-open'));
                contents.forEach(trigger => trigger.classList.remove('is-open'));
                if(alreadyOpen) {
                    e.currentTarget.classList.remove('is-open');
                    e.currentTarget.nextElementSibling.classList.remove('is-open');
                    alreadyOpen = false;
                } else {
                    e.currentTarget.classList.add('is-open');
                    e.currentTarget.nextElementSibling.classList.add('is-open');
                }
                console.log(alreadyOpen);
            });
        })
    })
}
function initTabs(isHash = false, wrapClass, menuClass, tabWrapClass, categoryClass = null) {
    if(isHash) {
        console.log('run hash tabs');
        window.addEventListener('hashchange', function(e){
            initHashTabs(wrapClass, menuClass, tabWrapClass, categoryClass = null);
        });

        //hash linking
        if (window.location.hash){
            initHashTabs(wrapClass, menuClass, tabWrapClass, categoryClass = null);
        } else {
            initFirstHashTab(menuClass);
        }
    }
}
function initHashTabs(wrapClass, menuClass, tabWrapClass, categoryClass = null) {
    //set variables for categories
    let selectedCategory, hashMain, hashCategory, categorySiblings, categoryIndex, hashTab, submenuSiblings, submenuIndex;

    //get hash and set basic variables
    let hash = $.trim( window.location.hash );
    let selected = document.querySelector(`${menuClass} a[href="${hash}"]`);
    let hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`);
    let unsetDefault = Array.from(selected.parentNode.children);
    let tabSiblings = Array.from(hashContent.parentNode.children);
    let tabIndex = tabSiblings.indexOf.call(tabSiblings, hashContent);

    //set category variables
    if(categoryClass) {
        selectedCategory = selected.closest(categoryClass).getAttribute('data-category');
        hashMain = document.querySelector(`${menuClass} tag-label[data-category="${selectedCategory}"]`);
        hashCategory = document.querySelector(`${menuClass} tag-tab[data-category="${selectedCategory}"]`);
        hashTab = document.querySelector(`${tabWrapClass} tag-tab[data-category="${selectedCategory}"]`);
        categorySiblings = Array.from(hashCategory.parentNode.children);
        categoryIndex = categorySiblings.indexOf.call(categorySiblings, hashCategory);
        submenuSiblings = Array.from(hashTab.parentNode.children);
        submenuIndex = submenuSiblings.indexOf.call(submenuSiblings, hashTab);
    }

    //find the sub menu/inner menu link with the matching hash
    if (hash) {
        $(selected).trigger('click');
    }

    //Tabs
    //Remove active from everything
    document.querySelectorAll(`${menuClass} tag-label`).forEach(label => label.classList.remove('is-active'));
    unsetDefault.forEach(label => label.classList.remove('is-active'));
    document.querySelectorAll(`${wrapClass} tag-tab`).forEach(label => label.classList.remove('is-active'));

    //Add active
    selected.classList.add('is-active');
    hashContent.classList.add('is-active');
    tabSiblings.forEach(sibling => sibling.style.left = `${-100 * tabIndex}%`);

    //add active for category
    if(categoryClass) {
        hashMain.classList.add('is-active');
        hashTab.classList.add('is-active');
        categorySiblings.forEach(sibling => sibling.style.left = `${-100 * categoryIndex}%`);
        submenuSiblings.forEach(sibling => sibling.style.left = `${-100 * submenuIndex}%`);
    }
}
function initFirstHashTab(menuClass) {
    //Auto-select tab without hashtag present
    document.querySelector(`${menuClass} a`).classList.add('is-active');
}

/****** Alerts ******/
function read_alerts() {
    $('#recent-alerts').fadeOut();
    document.querySelectorAll('.alerts').forEach(alert => {
        alert.dataset.new = 0;
        alert.setAttribute('title', 'Alerts (0)');
    });
    $.get( "index.php?recent_alerts=1&read=1", function( data ) {
        $( "#recent_alerts_data" ).html( data );
    });
}
function close_alerts() {
    $('#recent-alerts').fadeOut();
}
function load_alerts() {
    if($('#recent-alerts').is(':visible')) {
        $('#recent-alerts').fadeOut();
    } else {
        $.get( "?recent_alerts=1", function( data ) {
            $( "#recent-alerts-data" ).html( data );
        });
        $("#recent-alerts").fadeIn();
    }
}