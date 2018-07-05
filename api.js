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
$(document).on("click", ".nav button", function (e) {
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
	$('#detailColumnPopupSearch').popup('hide');
	$('#detailColumnPopupRoute').popup('hide');
	try {
		table.settings()[0].jqXHR.abort()
		ajaxDetail.settings()[0].jqXHR.abort()
	}
	catch(e){}
	$('.content').load(pageRef);
}

function buildDynamicDataTable(table, list) {
	var ths = ""
	var dict = list
	for (var key in dict){
		if (typeof list[key][1] == 'undefined') {
			if(list[key][0] > 0) { ths += "<th class='detail'>"+key+"</th>" }
			else { ths += "<th>"+key+"</th>" }
			continue
		}
		if(list[key][0] > 0) { ths += "<th class='detail'>"+list[key][1]+"</th>" }
		else { ths += "<th>"+list[key][1]+"</th>" }
	}
	table.append("<thead></thead>").append("<tr></tr>").append(ths)
	/*
	<thead>
    <tr>
    	<th id="detailCol">Details</th>
    	<th>Active</th>
    	<th>Destination</th>
    	<th>Source</th>
    	<th>Result<br>Type</th>
        <th>Patient<br>Class</th>
        <th>Result<br>Status</th>
        <th>Provider<br>Role</th>
        <th>EMR</th>
        <th>Delivery<br>Operation</th>

    	<th class="detail">MSH3</th>
        <th class="detail">MSH4</th>
        <th class="detail">MSH5</th>
        <th class="detail">MSH6</th>
        <th class="detail">Aggregate</th>
        <th class="detail">CreateTS</th>
        <th class="detail">Delay</th>
        <th class="detail">PV13Location</th>
        <th class="detail">PreserveProviders</th>
        <th class="detail">Source<br>Organization</th>
        <th class="detail">Transformations</th>
        <th class="detail">Username</th>
    </tr>
</thead>
*/
	
	// Programatic generation of datatable columns
	var columns = '[{"column":['
	for(var key in list) {
	    columns += '{data:"'+key+'"},'
	}
	columns = columns.slice(0, -1)
	columns += ']}]'
	columns = eval(columns)
	
	var customColumn = {
        "className":      'details-control',
        "orderable":      false,
        "data":           null,
        "defaultContent": '<div class="trigger"><button class="hamburger hamburger--collapse" type="button">' +
        	  					'<span class="hamburger-box">' +
        							'<span class="hamburger-inner"></span>' +
      							'</span>' +
    						'</button></div>'
    }
	var dynamicColumns = []
	dynamicColumns.push(customColumn)
	columns[0].column.forEach(function(i) {
		dynamicColumns.push(i)
	})
	return dynamicColumns
}