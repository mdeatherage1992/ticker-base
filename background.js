chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.checkLicenseInformation == "checkLicenseInformation") {
            chrome.identity.getAuthToken({
                'interactive': true
            }, function(token) {
                var CWS_LICENSE_API_URL = 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/';
                var req = new XMLHttpRequest();
                req.open('GET', CWS_LICENSE_API_URL + chrome.runtime.id);
                req.setRequestHeader('Authorization', 'Bearer ' + token);
                req.onreadystatechange = function() {
                    if (req.readyState == 4) {
                        var license = JSON.parse(req.responseText);


                        var licenseStatus;
                        var daysLeftOfYourTrial;
                        if (license.result && license.accessLevel == "FULL") {

                            licenseStatus = "FULL";
                        } else if (license.result && license.accessLevel == "FREE_TRIAL") {
                            var daysAgoLicenseIssued = Date.now() - parseInt(license.createdTime, 10);
                            var TRIAL_PERIOD_DAYS = 30;


                            daysAgoLicenseIssued = (daysAgoLicenseIssued / 1000 / 60 / 60 / 24).toFixed();
                            daysLeftOfYourTrial = TRIAL_PERIOD_DAYS - daysAgoLicenseIssued;
                            if (daysAgoLicenseIssued <= TRIAL_PERIOD_DAYS) {

                                licenseStatus = "FREE_TRIAL";
                            } else {

                                licenseStatus = "FREE_TRIAL_EXPIRED";
                            }
                        } else {

                            licenseStatus = "NONE";
                        }

                        chrome.storage.sync.set({
                            "licenseStatus": licenseStatus,
                            "daysLeftOfYourTrial": daysLeftOfYourTrial
                        }, function() {
                            if (chrome.runtime.lastError) {
                                console.log("Error.");
                            }
                        });
                    }
                }
                req.send();
            });
        }
    });
