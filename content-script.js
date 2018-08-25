$(document).ready(function() {
    var licenseStatus, daysLeftOfYourTrial;
    chrome.runtime.sendMessage({
        checkLicenseInformation: "checkLicenseInformation"
    }, function(response) {

    });

    function showContent() {

        try {
            var url = location.href;
            var searchphrase = url.split("q=")[1].split("&")[0];

            var extendedContent = "";

            $.get("https://hiredeveloper.co.uk/removeSections/tickerbase/ceAPI.php?apiKey=0e23qv3g20hx596o&query=" + searchphrase.replace(/\+/g, "%20"), function(data, status) {

                    if (data != null && data != undefined && data.length != 0) {
                        var content = "<div class=\"moreXX\" style=\"box-shadow: 0 1px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);  width: 592px; margin-left: -16px; padding: 20px; margin-bottom: 20px;color: #676767; line-height: 20px;\"><span style=\"font-size: 18px; color: #000000;\">Related - Provided By TickerBase</span><div id=\"license-message\"></div><br><br>";
                        for (var i = 0; i < data.length; i++) {
                            if (i > 12) {
                                extendedContent += "<span>" + data[i].symbol + "&nbsp;-&nbsp;" + data[i].fundName + "</span><br>";
                            } else {
                                content += data[i].symbol + "&nbsp;-&nbsp;" + data[i].fundName + "<br>";
                            }

                        }
                        content += "<div class='hiddenBox'>" + extendedContent + "</div></div>";
                        $("#rso").prepend(content);
                        if (extendedContent != "") {
                            $(".moreXX").append("<span class='showMoreBTN'>Show all related</span>");
                        }
                    } else {


                    }

                    if (licenseStatus == "FREE_TRIAL") {
                        showLicenseMessage();
                    }
                })
                .fail(function() {
                    if ($("span.spell") != undefined) {



                        var correctedsearchphrase = $("span.spell:first").nextAll("a:first").text();

                        $.get("https://hiredeveloper.co.uk/removeSections/tickerbase/ceAPI.php?apiKey=0e23qv3g20hx596o&query=" + correctedsearchphrase.replace(/ /g, "%20"), function(data, status) {

                            if (data != null && data != undefined && data.length != 0) {
                                var content = "<div class=\"moreXX\" style=\"box-shadow: 0 1px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);  width: 592px; margin-left: -16px; padding: 20px; margin-bottom: 20px;color: #676767; line-height: 20px;\"><span style=\"font-size: 18px; color: #000000;\">Related - Provided By TickerBase</span><div id=\"license-message\"></div><br><br>";
                                for (var i = 0; i < data.length; i++) {
                                    if (i > 12) {
                                        extendedContent += "<span>" + data[i].symbol + "&nbsp;-&nbsp;" + data[i].fundName + "</span><br>";
                                    } else {
                                        content += data[i].symbol + "&nbsp;-&nbsp;" + data[i].fundName + "<br>";
                                    }
                                }
                                content += "<div class='hiddenBox'>" + extendedContent + "</div></div>";
                                $("#rso").prepend(content);

                            } else {


                            }

                            if (licenseStatus == "FREE_TRIAL") {
                                showLicenseMessage();
                            }

                        })
                    }
                });

        } catch (err) {

        }


        $("html").append("<style>.showMoreBTN{display: none; margin-top: 15px; text-decoration: underline;}.showMoreBTN:hover{cursor: pointer; opacity: 0.6;}</style>");

    }

    function showLicenseMessage() {
        var licenseMessage = "<p style='color: black;'>" + daysLeftOfYourTrial + " days left of your trial -- <a href='https://chrome.google.com/webstore/detail/tickerbase/gjabpcaaemleegbjlbancmcpnlfjhfeg' target='_blank' style='color: green; text-decoration: underline'>Buy now</a></p>";
        $("#license-message").html(licenseMessage);

    }


    chrome.storage.sync.get(["licenseStatus", "daysLeftOfYourTrial"], function(items) {
        if (!chrome.runtime.lastError) {
            licenseStatus = items["licenseStatus"];
            daysLeftOfYourTrial = items["daysLeftOfYourTrial"];

            switch (licenseStatus) {
                case "FULL":
                    showContent();
                    break;
                case "FREE_TRIAL":
                    showContent();



                    break;
                case "FREE_TRIAL_EXPIRED":
                    var content = "<div class=\"moreXX\" style=\"box-shadow: 0 1px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);  width: 592px; margin-left: -16px; padding: 20px; margin-bottom: 20px;color: #676767; line-height: 20px;\"><span style=\"font-size: 18px; color: #000000;\">Related - Provided By TickerBase</span><div id=\"license-message\"></div><br><br>";
                    $("#rso").prepend(content);
                    var licenseMessage = "<p style='color: red;'>Your 30-day trial has expired<br> <a href='https://chrome.google.com/webstore/detail/tickerbase/gjabpcaaemleegbjlbancmcpnlfjhfeg' target='_blank' style='color: green; text-decoration: underline'>Find related investment symbols right here, effortlessly -- Buy now</a></p>";
                    $("#license-message").html(licenseMessage);


                    break;
                case "NONE":

                    break;

            }


        }
    });




});
