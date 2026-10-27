'use strict';

// A long-lived port dies with the event page. Reconnect lazily and turn a failed
// in-flight request into an error response instead of leaving the page stuck.
let funcPort = function(strName) {
    let objPort = null;
    let objPending = null;
    let objListeners = [];

    let funcConnect = function() {
        objPort = chrome.runtime.connect({
            'name': strName,
        });

        for (let funcListener of objListeners) {
            objPort.onMessage.addListener(funcListener);
        }

        objPort.onMessage.addListener(function(objData) {
            if (objData.strMessage === objPending) {
                objPending = null;
            }
        });

        objPort.onDisconnect.addListener(function() {
            objPort = null;

            if (objPending !== null) {
                let strMessage = objPending;
                objPending = null;

                for (let funcListener of objListeners) {
                    funcListener({
                        'strMessage': strMessage,
                        'objResponse': null,
                    });
                }
            }
        });

        return objPort;
    };

    return {
        'onMessage': {
            'addListener': function(funcListener) {
                objListeners.push(funcListener);
            },
        },
        'postMessage': function(objMessage) {
            objPending = objMessage.strMessage;

            let funcSend = function() {
                (objPort === null ? funcConnect() : objPort).postMessage(objMessage);
            };

            try {
                funcSend();
            } catch (objError) {
                objPort = null;
                funcSend();
            }
        },
    };
};

let objDatabase = funcPort('database');
let objHistory = funcPort('history');
let objYoutube = funcPort('youtube');
let objSearch = funcPort('search');

let funcStorageget = async function(strKey) {
    let objValue = await chrome.storage.local.get(strKey);

    if (objValue[strKey] === undefined) {
        return null;
    }

    return String(objValue[strKey]);
};

let funcStorageset = async function(strKey, objValue) {
     await chrome.storage.local.set({ [strKey]: String(objValue) });
};

let funcTimestamp = function(strValue) {
    let intValue = parseInt(strValue, 10);

    if (Number.isFinite(intValue) === false || intValue <= 0) {
        return 'Never';
    }

    return moment(intValue).format('MMM D, YYYY · HH:mm');
};

let funcRefreshsummary = async function() {
    let intSize = parseInt(await funcStorageget('extensions.Youwatch.Database.intSize'), 10);

    jQuery('#idDatabase_Size').text(Number.isFinite(intSize) ? intSize.toLocaleString() : '0');
    jQuery('#idHistory_Timestamp').text(funcTimestamp(await funcStorageget('extensions.Youwatch.History.intTimestamp')));
    jQuery('#idYoutube_Timestamp').text(funcTimestamp(await funcStorageget('extensions.Youwatch.Youtube.intTimestamp')));
};

let funcLoading = function(strMessage, strProgress) {
    jQuery('#idLoading_Container').addClass('is-open');
    jQuery('#idLoading_Message').text(strMessage);
    jQuery('#idLoading_Progress').text(strProgress === undefined ? '...' : strProgress);
    jQuery('#idLoading_Close').addClass('disabled');
};

jQuery(window.document).ready(async function() {
    jQuery('#idExtension_Version').text('v' + chrome.runtime.getManifest().version);

    await funcRefreshsummary();

    jQuery('#idDatabase_Export')
        .on('click', function() {
            funcLoading('Exporting your data');

            objDatabase.postMessage({
                'strMessage': 'databaseExport',
                'objRequest': {},
            });
        })
        .each(function() {
            objDatabase.onMessage.addListener(function(objData) {
                if (objData.strMessage === 'databaseExport') {
                    if (objData.objResponse === null) {
                        jQuery('#idLoading_Message')
                            .text('Could not export your data')
                        ;

                    } else if (objData.objResponse !== null) {
                        jQuery('#idLoading_Message')
                            .text('Backup exported')
                        ;

                        download(btoa(unescape(encodeURIComponent(JSON.stringify(objData.objResponse.objVideos)))), new Date().getFullYear() + '.' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '.' + ('0' + new Date().getDate()).slice(-2) + '.database', 'application/octet-stream');
                    }

                    jQuery('#idLoading_Close')
                        .removeClass('disabled')
                    ;

                } else if (objData.strMessage === 'databaseExport-progress') {
                    jQuery('#idLoading_Progress')
                        .text(objData.objResponse.strProgress)
                    ;

                }
            });
        })
    ;

    jQuery('#idDatabase_Import')
        .on('click', function() {
            jQuery('#idDatabase_File').trigger('click');
        })
    ;

    jQuery('#idDatabase_File')
        .on('change', function() {
            let objFile = this.files[0];

            if (objFile === undefined) {
                return;
            }

            funcLoading('Importing your data');

            let objFilereader = new FileReader();

            objFilereader.onload = function(objEvent) {
                try {
                    let objVideos = JSON.parse(decodeURIComponent(escape(atob(objEvent.target.result))));

                    objDatabase.postMessage({
                        'strMessage': 'databaseImport',
                        'objRequest': {
                            'objVideos': objVideos,
                        },
                    });
                } catch (objError) {
                    jQuery('#idLoading_Message').text('Could not read that backup');
                    jQuery('#idLoading_Progress').text('Choose a .database file exported by Watchmarker.');
                    jQuery('#idLoading_Close').removeClass('disabled');
                }
            };

            objFilereader.onerror = function() {
                jQuery('#idLoading_Message').text('Could not read that file');
                jQuery('#idLoading_Progress').text('Try choosing the backup again.');
                jQuery('#idLoading_Close').removeClass('disabled');
            };

            objFilereader.readAsText(objFile, 'utf-8');

            this.value = '';
        })
        .each(function() {
            objDatabase.onMessage.addListener(function(objData) {
                if (objData.strMessage === 'databaseImport') {
                    if (objData.objResponse === null) {
                        jQuery('#idLoading_Message')
                            .text('Could not import that backup')
                        ;

                    } else if (objData.objResponse !== null) {
                        jQuery('#idLoading_Message')
                            .text('Backup imported')
                        ;

                    }

                    jQuery('#idLoading_Close')
                        .removeClass('disabled')
                    ;

                } else if (objData.strMessage === 'databaseImport-progress') {
                    jQuery('#idLoading_Progress')
                        .text(objData.objResponse.strProgress)
                    ;

                }
            });
        })
    ;

    jQuery('#idDatabase_Reset')
        .on('click', function() {
            jQuery('#idDatabase_Reset').attr('hidden', true);
            jQuery('#idDatabase_Confirm').removeAttr('hidden');
        })
    ;

    jQuery('#idDatabase_Resno')
        .on('click', function() {
            jQuery('#idDatabase_Confirm').attr('hidden', true);
            jQuery('#idDatabase_Reset').removeAttr('hidden');
        })
    ;

    jQuery('#idDatabase_Resyes')
        .on('click', function() {
            objDatabase.postMessage({
                'strMessage': 'databaseReset',
                'objRequest': {},
            });
        })
        .each(function() {
            objDatabase.onMessage.addListener(function(objData) {
                if (objData.strMessage === 'databaseReset') {
                    window.location.reload();
                }
            });
        })
    ;

    jQuery('#idHistory_Synchronize')
        .on('click', function() {
            funcLoading('Importing browser history');

            objHistory.postMessage({
                'strMessage': 'historySynchronize',
                'objRequest': {
                    'intTimestamp': 0,
                },
            });
        })
        .each(function() {
            objHistory.onMessage.addListener(function(objData) {
                if (objData.strMessage === 'historySynchronize') {
                    if (objData.objResponse === null) {
                        jQuery('#idLoading_Message')
                            .text('Could not import browser history')
                        ;

                    } else if (objData.objResponse !== null) {
                        jQuery('#idLoading_Message')
                            .text('Browser history imported')
                        ;

                    }

                    jQuery('#idLoading_Close')
                        .removeClass('disabled')
                    ;

                } else if (objData.strMessage === 'historySynchronize-progress') {
                    jQuery('#idLoading_Progress')
                        .text(objData.objResponse.strProgress)
                    ;

                }
            });
        })
    ;

    jQuery('#idYoutube_Synchronize')
        .on('click', function() {
            funcLoading('Importing YouTube history');

            objYoutube.postMessage({
                'strMessage': 'youtubeSynchronize',
                'objRequest': {
                    'intThreshold': 1000000,
                },
            });
        })
        .each(function() {
            objYoutube.onMessage.addListener(function(objData) {
                if (objData.strMessage === 'youtubeSynchronize') {
                    if (objData.objResponse === null) {
                        jQuery('#idLoading_Message')
                            .text('Could not import YouTube history')
                        ;

                    } else if (objData.objResponse !== null) {
                        jQuery('#idLoading_Message')
                            .text('YouTube history imported')
                        ;

                    }

                    jQuery('#idLoading_Close')
                        .removeClass('disabled')
                    ;

                } else if (objData.strMessage === 'youtubeSynchronize-progress') {
                    jQuery('#idLoading_Progress')
                        .text(objData.objResponse.strProgress)
                    ;

                }
            });
        })
    ;

    for (let objElement of jQuery('input[data-setting]')) {
        let objInput = jQuery(objElement);
        let strKey = objInput.data('setting');

        objInput.prop('checked', await funcStorageget(strKey) === String(true));

        objInput.on('change', async function() {
            await funcStorageset(strKey, this.checked);
        });
    }

    jQuery('#idSearch_Query')
        .on('keydown', function(objEvent) {
            if (objEvent.keyCode === 13) {
                jQuery('#idSearch_Lookup')
                    .data({
                        'intSkip' : 0,
                    })
                ;

                jQuery('#idSearch_Lookup').triggerHandler('click');
            }
        })
    ;

    let funcSearchidle = function() {
        jQuery('#idSearch_Lookup')
            .removeClass('disabled')
            .find('.icon')
                .eq(0)
                    .css({
                        'display': 'inline',
                    })
                .end()
                .eq(1)
                    .css({
                        'display': 'none',
                    })
                .end()
            .end()
        ;
    };

    let objPendingdelete = null;

    jQuery('#idSearch_Lookup')
        .data({
            'intSkip' : 0,
        })
        .on('click', function(objEvent) {
            if (objEvent.originalEvent !== undefined) {
                jQuery('#idSearch_Lookup')
                    .data({
                        'intSkip' : 0,
                    })
                ;
            }

            jQuery('#idSearch_Lookup')
                .addClass('disabled')
                .find('.icon')
                    .eq(0)
                        .css({
                            'display': 'none',
                        })
                    .end()
                    .eq(1)
                        .css({
                            'display': 'inline',
                        })
                    .end()
                .end()
            ;

            jQuery('#idSearch_Status').text('Searching...');

            objSearch.postMessage({
                'strMessage': 'searchLookup',
                'objRequest': {
                    'strQuery': jQuery('#idSearch_Query').val(),
                    'intSkip': jQuery('#idSearch_Lookup').data('intSkip'),
                    'intLength': 10,
                },
            });
        })
        .each(function() {
            objSearch.onMessage.addListener(function(objData) {
                if (objData.strMessage === 'searchLookup') {
                    if (objData.objResponse === null) {
                        funcSearchidle();
                        jQuery('#idSearch_Status').text('Could not search. Try again.');
                        return;
                    }

                    funcSearchidle();
                    jQuery('#idSearch_Status').text('');

                    if (jQuery('#idSearch_Lookup').data('intSkip') === 0) {
                        jQuery('#idSearch_Results').empty();
                    }

                    if ((jQuery('#idSearch_Lookup').data('intSkip') === 0) && (objData.objResponse.objVideos.length === 0)) {
                        jQuery('#idSearch_Status').text('No videos found.');
                    }

                    for (let objVideo of objData.objResponse.objVideos) {
                        let objResult = jQuery('<div></div>').addClass('result');
                        let strUrl = 'https://www.youtube.com/watch?v=' + objVideo.strIdent;

                        objResult.append(jQuery('<a></a>')
                            .attr({
                                'href': strUrl,
                                'target': '_blank',
                                'rel': 'noopener noreferrer',
                            })
                            .append(jQuery('<img></img>')
                                .addClass('result-thumb')
                                .attr({
                                    'src': 'https://img.youtube.com/vi/' + objVideo.strIdent + '/mqdefault.jpg',
                                    'alt': '',
                                    'loading': 'lazy',
                                })
                            )
                        );

                        let objBody = jQuery('<div></div>').addClass('result-body');

                        objBody.append(jQuery('<a></a>')
                            .addClass('result-title')
                            .attr({
                                'href': strUrl,
                                'target': '_blank',
                                'rel': 'noopener noreferrer',
                            })
                            .text(objVideo.strTitle)
                        );

                        objBody.append(jQuery('<div></div>')
                            .addClass('result-meta')
                            .text(moment(objVideo.intTimestamp).format('MMM D, YYYY · HH:mm') + ' · ' + objVideo.intCount + (objVideo.intCount == 1 ? ' view' : ' views'))
                        );

                        let objDelete = jQuery('<button></button>')
                            .addClass('icon-button')
                            .attr({
                                'type': 'button',
                                'aria-label': 'Delete from history',
                                'title': 'Delete from history',
                            })
                            .append(jQuery(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
                                .addClass('icon')
                                .attr({
                                    'aria-hidden': 'true',
                                    'focusable': 'false',
                                })
                                .append(jQuery(document.createElementNS('http://www.w3.org/2000/svg', 'use'))
                                    .attr('href', '#icon-trash-2')
                                )
                            )
                            .on('click', function() {
                                objPendingdelete = jQuery(this).closest('.result');

                                funcLoading('Deleting video');

                                objSearch.postMessage({
                                    'strMessage': 'searchDelete',
                                    'objRequest': {
                                        'strIdent': objVideo.strIdent,
                                    },
                                });
                            })
                        ;

                        objBody.append(objDelete);
                        objResult.append(objBody);
                        jQuery('#idSearch_Results').append(objResult);
                    }

                    if (objData.objResponse.objVideos.length === 10) {
                        jQuery('#idSearch_Results').children().eq(-1)
                            .each(function() {
                                new IntersectionObserver(function(objEntries, objObserver) {
                                    if (objEntries[0].isIntersecting === true) {
                                        objObserver.unobserve(objEntries[0].target);

                                        jQuery('#idSearch_Lookup')
                                            .data({
                                                'intSkip' : jQuery('#idSearch_Lookup').data('intSkip') + 10,
                                            })
                                        ;

                                        jQuery('#idSearch_Lookup').triggerHandler('click');
                                    }
                                }).observe(this)
                            })
                        ;
                    }

                } else if (objData.strMessage === 'searchDelete') {
                    if (objData.objResponse === null) {
                        jQuery('#idLoading_Message')
                            .text('Could not delete that video')
                        ;

                    } else if (objData.objResponse !== null) {
                        jQuery('#idLoading_Message')
                            .text('Video deleted')
                        ;

                        if (objPendingdelete !== null) {
                            objPendingdelete.remove();
                            objPendingdelete = null;
                        }
                    }

                    jQuery('#idLoading_Close')
                        .removeClass('disabled')
                    ;

                } else if (objData.strMessage === 'searchDelete-progress') {
                    jQuery('#idLoading_Progress')
                        .text(objData.objResponse.strProgress)
                    ;

                }
            });
        })
        .each(function() {
            jQuery(this).triggerHandler('click');
        })
    ;

    jQuery('#idLoading_Close')
        .on('click', function() {
            jQuery('#idLoading_Container').removeClass('is-open');
            funcRefreshsummary();
        })
    ;
});
