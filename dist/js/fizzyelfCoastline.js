/** auto-tracker code by FizzyElf - https://fizzyelf.jcink.net **/
async function FillTracker(username, params = {}) {

    /***  CONFIGURATION AREA ***/
    const config = {
      includedforums: (params.includeCategoryIds || []).map(x => "c_" + x).concat(params.includeForumIds || []),
      historyforums: params.historyForumNames || [],
      historyforumids: params.historyForumIds || [],
      commforums: params.commForumNames || [],
      commforumids: params.commForumIds || [],
      icforums: params.icForumNames || [],
      icforumids: params.icForumIds || [],
      ignoreforums: params.ignoreForumNames || [],
      ignoreforumids: params.ignoreForumIds || [],
      lockedclass: params.lockedMacroIdentifier || "[title=Closed]",
      lockedforums: params.archiveForumNames || [],
      lockedforumids: params.archiveForumIds || [],
      indicators: params.indicators || ['<span style="font-family: roboto, verdana, arial, sans">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ</span>', '<span style="font-family: roboto, verdana, arial, sans">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤</span>'],
      separator: params.separator || "|",
      username: username.replace(/&#([0-9]+);/g, (m, p1) => String.fromCharCode(p1)),
      otherwrap: params.thisTracker || $('tag-tab[data-key="other"] .profile--tracking-grid'),
      historywrap: params.thisHistory || $('tag-tab[data-key="archived"] .profile--tracking-grid'),
      commwrap: params.thisCommTracker || $('tag-tab[data-key="comms"] .profile--tracking-grid'),
      icwrap: params.thisICTracker || $('tag-tab[data-key="active"] .profile--tracking-grid'),
      pagelimit: params.pageLimit || 5,
      previousposters: params.previousPosters || {},
      lockedregex: (params.archiveForumRegex)?  RegExp(params.archiveForumRegex) : /archive/i ,
      closedthreads: (params.completedThreads) || []
    }
    if (!config.includedforums.length) config.includedforums.push("all");
    /*** END CONFIGURATION ***/

    if (/^[-\w _\d]+$/.test(params.indicators[0])) {
    params.indicators[0] = `<i class="${params.indicators[0]}"></i>`
    }
    if (/^[-\w _\d]+$/.test(params.indicators[1])) {
      params.indicators[1] = `<i class="${params.indicators[1]}"></i>`
    }
  
    /***  RUN THE SEARCH ***/
  
    let href = `/index.php?act=Search&CODE=01&nomobile=1`;
    let data = '';
    try {
      console.log(`fetching ${href}`);
      data = await $.post(href, {
        keywords: "",
        namesearch: config.username,
        forums: config.includedforums,
        searchsubs: "1",
        prune: "0",
        prune_type: "newer",
        sort_key: "last_post",
        sort_order: "desc",
        search_in: "posts",
        result_type: "topics",
      });
      console.log('success.');
    } catch (err) {
      console.log(`Ajax error loading page: ${href} - ${err.status} ${err.statusText}`);
      config.icwrap.append('<div class="profile--nothreads">Search Failed</div>');
      return;
    }
    doc = new DOMParser().parseFromString(data, 'text/html');
  
    let meta = $('meta[http-equiv="refresh"]', doc);
    if (meta.length) {
      href = meta.attr('content').substr(meta.attr('content').indexOf('=') + 1) + '&st=0';
      //.log('sessionid = ' + href.match(/&searchid=([a-zA-Z0-9]+)&/)[1]);
      //console.log('search = ' + href);
    } else {
      let boardmessage = $('#board-message .tablefill .postcolor', doc).text();
      config.otherwrap.append(`<div class="profile--nothreads">${boardmessage}</div>`);
      config.historywrap.append(`<div class="profile--nothreads">${boardmessage}</div>`);
      config.commwrap.append(`<div class="profile--nothreads">${boardmessage}</div>`);
      config.icwrap.append(`<div class="profile--nothreads">${boardmessage}</div>`);
      return;
    }
  
    await parseResults(href, config, 0);
    
  }
  
  
  
  parseResults = async (searchlink, config, page) => {
    let doc;
    searchlink = searchlink.replace(/&st=\d+/, `&st=${page * 25}`);
    let data = '';
    try {
      console.log(`fetching ${searchlink}`);
      data = await $.get(searchlink);
      //console.log('success.');
    } catch (err) {
      console.log(`Ajax error loading page: ${searchlink} - ${err.status} ${err.statusText}`);
      console.log(err)
      config.icwrap.append('<div class="profile--nothreads">Search Failed</div>');
      return;
    }
    doc = new DOMParser().parseFromString(data, 'text/html');
  
    $('#search-topics .tablebasic > tbody > tr', doc).each(function (i, e) {
      if (i > 0) {
        const cells = $(e).children('td');
        const location = $(cells[3]).text();
        const location_id = $(cells[3]).find('a').attr('href').match(/showforum=([^&]+)&?/)[1]
        const threadLink = $(cells[7]).children('a').attr('href');
        const thread_id = threadLink.match(/showtopic=([^&]+)&?/)[1];
        if (!config.ignoreforums.includes(location) && !config.ignoreforumids.includes(location_id)) {
          const locked = $(cells[0]).find(`${config.lockedclass}`).length 
                        || config.lockedforums.includes(location) 
                        || config.lockedforumids.includes(location_id) 
                        || config.lockedregex.test(location)
                        || config.closedthreads.includes(thread_id);
          const title = $(cells[2]).find('td:nth-child(2) > a').first().text();
          const threadDesc = $(cells[2]).find('.desc').text().replaceAll('[', '<tag-highlight>').replaceAll(']', '</tag-highlight>');
          const history = config.historyforums.includes(location) || config.historyforumids.includes(location_id);
          const comm = config.commforums.includes(location) || config.commforumids.includes(location_id);
          const ic = config.icforums.includes(location) || config.icforumids.includes(location_id);
          const lastPoster = $(cells[7]).find('a[href*=showuser]').text().trim().replace(/&#([0-9]+);/g, (m, p1) => String.fromCharCode(p1));
          const lastPosterId = $(cells[7]).find('a[href*=showuser]').attr('href');
          let myturn = (config.username == lastPoster) ? 'Caught Up' : 'Owing';
          if (config.previousposters[thread_id]) {
            myturn = (lastPoster == config.previousposters[thread_id].replace(/&#([0-9]+);/g, (m, p1) => String.fromCharCode(p1))) ? 'Owing' : 'Caught Up';
          }
          const symbol = (myturn == 'Caught Up') ? config.indicators[0] : config.indicators[1];
  
          let postDate = $(cells[7]).html();
          postDate = postDate.substr(0, postDate.indexOf('<br>'));
          const sep = (threadDesc) ? config.separator : '';

          function formatItem (turn, url, title, desc, forumURL, forum, posterURL, poster, date) {
            return `<div class="profile--item" data-owing="${turn}">
                <div class="profile--tracking-topic">
                    <a href="${url}"><strong>${title}</strong></a>
                    <span>${desc}</span>
                    <span>Posted in <a href="?showforum=${forumURL}">${forum}</a></span>
                    <span>Last post by <a href="${posterURL}">${poster}</a></span>
                    <span>${date}</span>
                </div>
            </div>`;
          }

          //${myturn.replace(/ /g, '').toLowerCase()}
          console.log(config.historywrap);
          if (history) {
            config.historywrap.append(formatItem('archived', threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else if (comm) {
            config.commwrap.append(formatItem(myturn.replace(/ /g, '').toLowerCase(), threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else if (ic) {
            config.icwrap.append(formatItem(myturn.replace(/ /g, '').toLowerCase(), threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else {
            config.otherwrap.append(formatItem('other', threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          }
        }
      }
  
    });
  
    if ($('#search-topics .tablebasic > tbody > tr', doc).length == 26 && page < config.pagelimit) {
      page = page + 1;
      await parseResults(searchlink, config, page)
    } else {
      if (!config.otherwrap.children().length) {
        config.otherwrap.append($('<div class="profile--nothreads">No results found.</div>'));
      }
      if (!config.historywrap.children().length) {
        config.historywrap.append($('<div class="profile--nothreads">No results found.</div>'));
      }
      if (!config.commwrap.children().length) {
        config.commwrap.append($('<div class="profile--nothreads">No results found.</div>'));
      }
      if (!config.icwrap.children().length) {
        config.icwrap.append($('<div class="profile--nothreads">No results found.</div>'));
      }
    }
  }