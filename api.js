// For local
//var serverURL = "http://localhost:57772/csp/gridserver/";
// For cert/prod
var serverURL = "https://glhc-c-hc1.core.domain/csp/gridserver/";
var authURL = "https://glhc-c-hc1.core.domain/csp/authentication/";
var failOverServerURL = "https://glhc-c-hc2.core.domain/csp/gridserver/";
//The first thing we do is check if we have a token from a previous session. If so we try it, if it fails or is missing
// then we just load the login page
$( document ).ready(function() {
	if(getCookie("page")) {
		navigate(getCookie("page"));
	}
	else navigate("search.html");
});

// Pass the name of a cookie to get its value
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Pass a value, name, and expiration time for a new cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Any nav links just navigate viewer to their href via ajax
$(document).on("click", "#nav button", function (e) {
	e.preventDefault();
	//($(this).attr('href') != "home.html") {
		var pageRef = $(this).attr('href');
		navigate(pageRef);
		//if(pageRef != "login.html") 
		setCookie("page", pageRef, 1)
	//}
});

// Event handling specific to the logout button
$(document).on("click", "#logout", function (e) {
	window.location.href = '?CacheLogout=1';
	setCookie("page", "", 0);
});

// Function that uses AJAX shorthand for dumping html contents into element
function navigate(pageRef) {
	$('#detailColumn').popup('hide');
	$('#orgDetails').popup('hide');
	try {
		table.settings()[0].jqXHR.abort()
		ajaxDetail.settings()[0].jqXHR.abort()
	}
	catch(e){}
	$('#content').load(pageRef);
}