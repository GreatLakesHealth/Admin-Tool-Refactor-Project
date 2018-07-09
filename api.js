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

// Handles hiding columns
function hideColumns(table, dynamicColumns) {
    var firstFind = 1;
    for(var key in dynamicColumns) {
    	if(dynamicColumns[key][0] > 0) break
    	else firstFind++;
    }
    var leftOver = Object.keys(dynamicColumns).length + 1 - firstFind
    var range = [...Array(leftOver).keys()].map(i => i + firstFind)
    table.columns(range).visible( false );
}

function buildDynamicDataTable(table, list) {
	var hiddenClass = "detail"
	var ths = "<th>Details</th>"
	var dict = list
	// Build headers
	for (var key in dict){
		if (typeof list[key][1] == 'undefined') {
			if(list[key][0] > 0) { ths += '<th class="'+hiddenClass+'">'+key+'</th>' }
			else { ths += "<th>"+key+"</th>" }
			continue
		}
		if(list[key][0] > 0) { ths += '<th class="'+hiddenClass+'">'+list[key][1]+'</th>' }
		else { ths += "<th>"+list[key][1]+"</th>" }
	}
	// Build footers
	var foot = "<tfoot><tr><th class='detailInvisible'></th>"
	for (var key in dict){
		if (typeof list[key][1] == 'undefined') {
			if(list[key][0] > 0) { foot += '<th class="'+hiddenClass+'">'+key+'</th>' }
			else { foot += "<th>"+key+"</th>" }
			continue
		}
		if(list[key][0] > 0) { foot += '<th class="'+hiddenClass+'">'+list[key][1]+'</th>' }
		else { foot += "<th>"+list[key][1]+"</th>" }
	}
	foot += "</tr></tfoot>"
		
	table.append("<thead></thead>").append("<tr></tr>").append(ths)
	table.append(foot)
	
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