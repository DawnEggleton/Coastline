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
    } else if (document.querySelector('#quick-login-clip')) {
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
            });
        })
    })
}
function initTabs(isHash = false, wrapClass, menuClass, tabWrapClass, activeClass = 'is-active', categoryClass = null) {
    if(isHash) {
        window.addEventListener('hashchange', function(e){
            initHashTabs(wrapClass, menuClass, tabWrapClass, activeClass, categoryClass);
        });

        //hash linking
        if (window.location.hash){
            initHashTabs(wrapClass, menuClass, tabWrapClass, activeClass, categoryClass);
        } else {
            initFirstHashTab(menuClass, activeClass);
        }
    } else {
        initRegularTabs(menuClass);
    }
}
function initRegularTabs(menuClass) {
    let labels = document.querySelectorAll(`${menuClass} > tag-label`);
    labels.forEach(label => {
        label.addEventListener('click', e => {
            let selected = e.currentTarget;
            let tab = document.querySelector(`tag-tab[data-key="${selected.dataset.key}"]`);
            let tabSiblings = Array.from(tab.parentNode.children);
            let tabIndex = tabSiblings.indexOf.call(tabSiblings, tab);
            
            labels.forEach(label => label.classList.remove('is-active'));
            tabSiblings.forEach(tab => tab.classList.remove('is-active'));
            
            selected.classList.add('is-active');
            tab.classList.add('is-active');
            tabSiblings.forEach(sibling => sibling.style.left = `${-100 * tabIndex}%`);
        });
    });
}
function initHashTabs(wrapClass, menuClass, tabWrapClass, activeClass, categoryClass = null) {
    //set variables for categories
    let selectedCategory, hashMain, hashCategory, hashCategoryArray, categorySiblings, categoryIndex, hashTab, submenuSiblings, submenuIndex;

    //get hash and set basic variables
    let hash = $.trim( window.location.hash );
    let selected = document.querySelector(`${menuClass} a[href="${hash}"]`);
    let hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`);
    let unsetDefault = Array.from(selected.parentNode.children);
    let tabSiblings = Array.from(hashContent.parentNode.children);
    let tabIndex = tabSiblings.indexOf.call(tabSiblings, hashContent);

    //set category variables document.querySelector(`.webpage--menu a[href="#tab2-2"]`).closest('.tab-category').getAttribute('data-category')
    if(categoryClass) {
        selectedCategory = selected.closest(categoryClass).getAttribute('data-category');

        hashMain = document.querySelector(`${menuClass} tag-label[data-category="${selectedCategory}"]`);

        hashCategory = document.querySelector(`${menuClass} tag-tab[data-category="${selectedCategory}"]`);
        if(!hashCategory) {
            hashCategoryArray = document.querySelectorAll(`${menuClass} [data-category="${selectedCategory}"]`);
        }

        hashTab = document.querySelector(`${tabWrapClass} tag-tab[data-category="${selectedCategory}"]`);

        if(hashCategory) {
            categorySiblings = Array.from(hashCategory.parentNode.children);
            categoryIndex = categorySiblings.indexOf.call(categorySiblings, hashCategory);
        }
        submenuSiblings = Array.from(hashTab.parentNode.children);
        submenuIndex = submenuSiblings.indexOf.call(submenuSiblings, hashTab);
    }

    //find the sub menu/inner menu link with the matching hash
    if (hash) {
        $(selected).trigger('click');
    }

    //Tabs
    //Remove active from everything
    document.querySelectorAll(`${menuClass} tag-label`).forEach(label => label.classList.remove(activeClass));
    document.querySelectorAll(`${menuClass} a`).forEach(label => label.classList.remove(activeClass));
    unsetDefault.forEach(label => label.classList.remove(activeClass));
    document.querySelectorAll(`${wrapClass} tag-tab`).forEach(label => label.classList.remove(activeClass));
    document.querySelectorAll(categoryClass).forEach(item => item.classList.remove(activeClass));

    //Add active
    selected.classList.add(activeClass);
    hashContent.classList.add(activeClass);
    tabSiblings.forEach(sibling => sibling.style.left = `${-100 * tabIndex}%`);
    hashCategoryArray.forEach(item => item.classList.add(activeClass));

    //add active for category
    if(categoryClass) {
        hashMain.classList.add(activeClass);
        hashTab.classList.add(activeClass);
        if(categorySiblings) {
            categorySiblings.forEach(sibling => sibling.style.left = `${-100 * categoryIndex}%`);
        }
        submenuSiblings.forEach(sibling => sibling.style.left = `${-100 * submenuIndex}%`);
    }
}
function initFirstHashTab(menuClass, activeClass) {
    //Auto-select tab without hashtag present
    document.querySelector(`${menuClass} a`).classList.add(activeClass);
}
function initWebpages() {
    //remove loading screen
    document.querySelector('body').classList.remove('loading');
    document.querySelector('#loading').remove();
    initTabs(true, '.webpage', '.webpage--menu', '.webpage--content', 'is-open', '.tab-category')
}
function initTableSort(table) {
    let headers = table.querySelectorAll('th'),
        rows,
        switching = true,
        i,
        a,
        b,
        shouldSwitch,
        switchcount = 0;

    headers.forEach((header, index) => {
        header.addEventListener('click', () => {
            let column = index;
            let dir = header.dataset.sort ? header.dataset.sort : 'asc';
            for(let j = 0; j < headers.length; j++) {
                if (j !== index) {
                    headers[j].removeAttribute('data-sort');
                }
            }

            while (switching) {
                switching = false;
                rows = table.rows;
                for (i = 1; i < (rows.length - 1); i++) {
                  shouldSwitch = false;

                  //set sorting value in a way that works for date, numerical, or alphabetical sorting
                  switch(header.dataset.sortBy) {
                    case 'date':
                        a = Date.parse(rows[i].getElementsByTagName("TD")[column].innerHTML.toLowerCase().trim());
                        b = Date.parse(rows[i + 1].getElementsByTagName("TD")[column].innerHTML.toLowerCase().trim());
                        break;
                    case 'number':
                        a = parseInt(rows[i].getElementsByTagName("TD")[column].innerHTML.toLowerCase().trim());
                        b = parseInt(rows[i + 1].getElementsByTagName("TD")[column].innerHTML.toLowerCase().trim());
                        break;
                    default:
                        a = rows[i].getElementsByTagName("TD")[column].innerHTML.toLowerCase().trim();
                        b = rows[i + 1].getElementsByTagName("TD")[column].innerHTML.toLowerCase().trim();
                  }
                  
                  if (dir == "asc") {
                    if (a > b) {
                      shouldSwitch = true;
                      break;
                    }
                  } else if (dir == "desc") {
                    if (a < b) {
                      shouldSwitch = true;
                      break;
                    }
                  }
                }
                if (shouldSwitch) {
                  rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                  switching = true;
                  switchcount ++;
                }
            }
            switching = true;
            switchCount = 0;
            header.dataset.sort = dir === 'asc' ? 'desc' : 'asc';
        });
    });
}

/****** Member List Only ******/
function formatMemberRow(accountType, data) {
    let html = `<div class="ml--member ${accountType} grid-item g-${data.groupID} floor-${data.floor} ${data.aliasClass}">
        <div class="mem">
            <div class="mem--image">
                <img src="${data.image}" />
                <div class="mem--links">
                    <a href="?act=Search&CODE=getalluser&mid=${data.id}&type=topics" title="View Topics"><i class="ph ph-folder"></i></a>
                    <a href="?act=Msg&CODE=04&MID=${data.id}" title="Send Message"><i class="ph ph-envelope"></i></a>
                </div>
            </div>
            <div class="mem--main">
                <a href="?showuser=${data.id}" class="mem--name">${data.name}</a>
                <div class="mem--item">
                    <strong>Played By</strong>
                    <span class="mem--alias">${data.alias}</span>
                </div>
                <div class="mem--item">
                    <strong>Age</strong>
                    <span>${data.age}</span>
                </div>
                <div class="mem--item">
                    <strong>Pronouns</strong>
                    <span>${data.pronouns}</span>
                </div>
                <div class="mem--item">
                    <strong>Occupation</strong>
                    <span>${data.occupation}</span>
                </div>
                <div class="mem--item">
                    <strong>Power</strong>
                    <span class="mem--power">${data.power}</span>
                </div>
                <div class="mem--item">
                    <strong>Posts</strong>
                    <a href="?act=Search&CODE=getalluser&mid=${data.id}"><span class="mem--posts">${data.postCount}</span> Posts</a>
                </div>
                <div class="mem--item">
                    <strong>Last Post</strong>
                    <span>${data.lastPost}</span>
                </div>
                <span class="mem--join hidden">${data.joined}</span>
            </div>
        </div>
    </div>`;
    return html;
}
function populatePage(array) {
    let html = ``;
    let members = [], membersClean = [];
    let floors = [], floorsClean = [];

    for (let i = 0; i < array.length; i++) {
        //Make Member Array
        let member = {raw: array[i].alias, clean: array[i].aliasClass};
        if(jQuery.inArray(member.clean, membersClean) == -1 && member.clean != '') {
            membersClean.push(member.clean);
            members.push(member);
        }
        //Make Floor Array
        let floor = {raw: array[i].floor, clean: `floor-${array[i].floor}`};
        if(jQuery.inArray(floor.clean, floorsClean) == -1 && floor.raw != '') {
            floorsClean.push(floor.clean);
            floors.push(floor);
        }

        switch(array[i].groupID) {
            //member only
            case 4:
                html += formatMemberRow('member', array[i]);
                break;
            //character only
            default: 
                html += formatMemberRow('character', array[i]);
                break;
        }
    }
    document.querySelector('#ml--rows').insertAdjacentHTML('beforeend', html);


    //sort member array
    members.sort((a, b) => {
        if(a.clean < b.clean) {
            return -1;
        } else if (a.clean > b.clean) {
            return 1;
        } else {
            return 0;
        }
    });
    //sort floors array
    floors.sort((a, b) => {
        if(parseInt(a.raw) < parseInt(b.raw)) {
            return -1;
        } else if (parseInt(a.raw) > parseInt(b.raw)) {
            return 1;
        } else {
            return 0;
        }
    });

    //Append Arrays
    members.forEach(member => {
        document.querySelector('.ml--member-list').insertAdjacentHTML('beforeend', `<label><input type="checkbox" value=".${member.clean}"/>${member.raw}</label>`);
    });
    floors.forEach(floor => {
        document.querySelector('.ml--floor-list').insertAdjacentHTML('beforeend', `<label><input type="checkbox" value=".${floor.clean}"/>${floor.raw}</label>`);
    });
}
function setCustomFilter() {
    //get search value
    qsRegex = document.querySelector(typeSearch).value;
    
    //add show class to all items to reset
    elements.forEach(el => el.classList.add(visible));
    
    //filter by nothing
    let searchFilter = '';
    
    //check each item
    elements.forEach(el => {
        let name = el.querySelector(memName).textContent;
        if(!name.toLowerCase().includes(qsRegex)) {
            el.classList.remove(visible);
            searchFilter = `.${visible}`;
        }
    });

    let filterGroups = document.querySelectorAll(filterGroup);
    let groups = [];
    let checkFilters;
    filterGroups.forEach(group => {
        let filters = [];
        group.querySelectorAll('label.is-checked input').forEach(filter => {
            if(filter.value) {
                filters.push(filter.value);
            }
        });
        groups.push({group: group.dataset.filterGroup, selected: filters});
    });

    groups.forEach(group => {
        let tagString = group.selected.join('_');
        appendSearchQuery(group.group, tagString);
    });

    let filterCount = 0;
    let comboFilters = [];
    groups.forEach(group => {
        // skip to next filter group if it doesn't have any values
        if ( group.selected.length > 0 ) {
            if ( filterCount === 0 ) {
                // copy groups to comboFilters
                comboFilters = group.selected;
            } else {
                var filterSelectors = [];
                var groupCombo = comboFilters;
                // merge filter Groups
                for (var k = 0; k < group.selected.length; k++) {
                    for (var j = 0; j < groupCombo.length; j++) {
                        //accommodate weirdness with object vs not
                        if(groupCombo[j].selected) {
                            if(groupCombo[j].selected != group.selected[k]) {
                                filterSelectors.push( groupCombo[j].selected + group.selected[k] );
                            }
                        } else if (!groupCombo[j].selected && group.selected[k]) {
                            if(groupCombo[j] != group.selected[k]) {
                                filterSelectors.push( groupCombo[j] + group.selected[k] );
                            }
                        }
                    }
                }
                // apply filter selectors to combo filters for next group
                comboFilters = filterSelectors;
            }
            filterCount++;
        }
    });
    
    //set filter to blank
    let filter = [];
    //check if it's only search
    if(qsRegex.length > 0 && comboFilters.length === 0) {
        filter = [`.${visible}`];
    }
    //check if it's only checkboxes
    else if(qsRegex.length === 0 && comboFilters.length > 0) {
        let combos = comboFilters.join(',').split(',');
        filter = [...combos];
    }
    //check if it's both
    else if (qsRegex.length > 0 && comboFilters.length > 0) {
        let dualFilters = comboFilters.map(filter => filter + `.${visible}`);
        filter = [...dualFilters];
    }

    //join array into string
    filter = filter.join(', ');

    // bind sort button click
    let currentSort = document.querySelector('.ml--sort.is-checked');
        
    //render isotope
    $container.isotope({
        filter: filter,
        sortBy: currentSort.dataset.sort,
    });
    $container.isotope('layout');
}
function debounce(fn, threshold) {
    var timeout;
    return function debounced() {
        if (timeout) {
        clearTimeout(timeout);
        }

        function delayed() {
        fn();
        timeout = null;
        }
        setTimeout(delayed, threshold || 100);
    };
}
function appendSearchQuery(param, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(param, value);
    window.history.replaceState(null, null, url);
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