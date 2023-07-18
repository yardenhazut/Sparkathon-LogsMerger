let nowStr = new Date().toLocaleDateString();
let g_lmnt;
var xhr;

const downFile = (response) => {
    var blob = new Blob([response], {type: "text/plain;charset=utf-8"});
    var filename = "";
    var disposition = xhr.getResponseHeader('Content-Disposition');
    if (disposition && disposition.indexOf('attachment') !== -1) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
    }

    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);

        if (filename) {
            var a = document.createElement("a");
            if (typeof a.download === 'undefined') {
                window.location.href = downloadUrl;
            } else {
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
            }
        } else {
            window.location.href = downloadUrl;
        }

        setTimeout(function () {
            URL.revokeObjectURL(downloadUrl);
        }, 100); // cleanup
    }
};

const show = (lmntId) => document.getElementById(lmntId).style.visibility = 'visible';

const hide = (lmntId) => document.getElementById(lmntId).style.visibility = 'hidden';

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function listOrUploadCall(serviceUrl, selectId, doHideAndClear = true) {
    if (doHideAndClear) {
        hideAndClear();
    }

    var form = document.getElementById('frm2');
    if (serviceUrl == 'flow-visualization/upload' && !form.elements['configFile'].value.toLowerCase().endsWith('.json')) {
        alert('Only JSON file extensions can be uploaded.');
        return;
    }
    var formdata = false;
    if (window.FormData) {
        formdata = new FormData(form);
    }

    //setup ajax
    $.ajaxSetup({
        beforeSend: function (jqXHR, settings) {
            if (settings.dataType === 'binary') {
                settings.xhr().responseType = 'arraybuffer';
                settings.processData = false;
            }
        }
    })

    $('html, body').css("cursor", "wait")
    var xhr = $.ajax({
        url: serviceUrl,
        data: formdata ? formdata : form.serialize(),
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (data, textStatus, jqXHR) {

            var sel = $(`#${selectId}`);
			if (!sel || !selectId){
		       if (serviceUrl == 'flow-visualization/upload' && form.elements['userFolder'].value == ''){
			 	  selectId = 'configFileName';
			   }
			   else{
		 		  selectId = 'tmltConfigFileName';
	 		   }
			  var sel = $(`#${selectId}`);
			}
            $('html, body').css("cursor", "pointer")
            if (data) {
                let contentType = xhr.getResponseHeader('Content-Type')
                sel.empty();
                if (data) {
                    data.forEach(e => sel.append('<option value="' + e + '">' + e + '</option>'));
                }
                if (this.url == 'flow-visualization/upload') {
                    outputDiv.innerHTML = 'File uploaded';
                }
                show('image1');
                show('outputDiv');
            }
	        document.getElementById('userFolder').value='';
        },//success function
        error: function (request, status, error) {
	        document.getElementById('userFolder').value='';
            $('html, body').css("cursor", "pointer")
            if (request.status === 409) {
                alert("A file for upload should be attached");
                return;
            } else {
                alert(request.responseText);
                return;
            }
        }
    });
}//listOrUploadCall()

function hideAndClear() {
    hide('image1');
    hide('outputDiv');
    let image1 = document.getElementById("image1");
    let outputDiv = document.getElementById("outputDiv");
    image1.src = '';
    outputDiv.innerHTML = '';
}

function confirmDeletion(formElement) {
    let fileToDelete;
    if (formElement.elements['userFolder'].value =='templates'){
        fileToDelete = formElement.elements['tmltConfigFileName'].value;
    }else {
        fileToDelete = formElement.elements['configFileName'].value;
    }
    if (confirm(`Confirm ${fileToDelete} deletion`) == true) {
        return true;
    } else {
        return false;
    }
}

function checkNull(formElement, fieldName, msg) {
    let val = formElement.elements[fieldName].value;
    if (!val) {
        alert(msg || `'${fieldName}' field should not be empty.`);
        return false;
    }
    return true;
}

function validateForm(formElement) {
    let meth = formElement.elements['searchRange'].value;
    switch (meth) {
        case 'PERIOD':
            let begin = formElement.elements['searchBeginPeriod'].value;
            let bDate = new Date(begin);
            let end = formElement.elements['searchEndPeriod'].value;
            let eDate = new Date(end);
            if (!begin || !end) {
                alert('Begin and End date fields should not be empty when search range is based on PERIOD.');
                return false;
            }
            if (eDate < bDate) {
                alert('End date should ocur after start date.');
                return false;
            }
        case 'LASTHOURS':
            let hours = formElement.elements['searchLastHours'].value;
            if (!hours) {
                alert('Last Hours field should not be empty when search range is based on Last hours.');
                return false;
            }
    }//switch
    if (!checkNull(formElement, 'resultLimit')) return false;
    if (!checkNull(formElement, 'parameters')) return false;
    return true;
}

function download(serviceUrl) {
    xhr = new XMLHttpRequest();
    xhr.open("POST", serviceUrl);
    xhr.responseType = "blob";
    xhr.onload = response;
    onerror = (event) => {
        console.log(event);
    };

    const formElement = document.getElementById("frm2");
    if (serviceUrl == "flow-visualization/delete") {
        if (!confirmDeletion(formElement)) {
            return;
        }
    }
    $('html, body').css("cursor", "wait")
    hideAndClear()
    if (serviceUrl == "flow-visualization/search" && !validateForm(formElement)) {
        $('html, body').css("cursor", "pointer")
        return;
    }

    xhr.send(new FormData(formElement));
	document.getElementById('userFolder').value='';
}

function response(e) {
    show('image1');
    show('outputDiv');

    $('html, body').css("cursor", "pointer")

    switch (this.response.type) {
        case "image/jpeg":
        case "image/png":
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(this.response);
            document.getElementById("image1").src = imageUrl;
            break;
        case "text/html":
        case "text/plain":
        case "application/json":
        case "application/octet-stream":
            let outputDiv = document.getElementById("outputDiv");
            this.response.text().then(text => {
                if (this.status === 404) {
                    let outputDiv = document.getElementById("outputDiv");
                    outputDiv.innerHTML = "<h2>No data found. Check your selected config file and search range!</h2><p style=\"color: darkgray\">Server message: " + text + "</p>";
                }else{
                    downFile(text)
                }
            });
            break;
        default:
		    loadSelects();
    }//switch
}

function showCalendar(lmnt) {
    g_lmnt = lmnt;
    var bodyRect = document.body.getBoundingClientRect(),
        elemRect = lmnt.getBoundingClientRect(),
        offsetTop = elemRect.top;
    offsetLeft = elemRect.left;

    let calendarDiv = document.getElementById('calendar');
    calendarDiv.style.display = 'block';

    calendarDiv.style.position = "absolute";
    calendarDiv.style.top = `${offsetTop}px`;
    calendarDiv.style.left = `${offsetLeft}px`;
}

function handleRadioClick(myRadio) {
    console.log('New value: ' + myRadio.value);

    switch (myRadio.value) {
        case 'PERIOD':
            document.getElementById('searchLastHours').disabled = true;
            document.getElementById('searchBeginPeriod').disabled = false;
            document.getElementById('searchEndPeriod').disabled = false;
            break;
        case 'LASTHOURS':
            document.getElementById('searchLastHours').disabled = false;
            document.getElementById('searchBeginPeriod').disabled = true;
            document.getElementById('searchEndPeriod').disabled = true;
            break;
    }
}

const loadSelects = async ()=>{
    await listOrUploadCall('flow-visualization/list', 'configFileName', false);
    document.getElementById('userFolder').value='templates'
    await listOrUploadCall('flow-visualization/list', 'tmltConfigFileName', false);
    document.getElementById('userFolder').value=''
}

function exposeButtons(){
    document.getElementById('tmpltDelete').disabled = false;
    document.getElementById('tmltFiles').disabled = false;
}

function dialog(){
    let pss = prompt("Please enter password", ""); // passwd is checked on server side
    $("#separator").data("ps", pss); // save
    // var dataPass = $('#separator').data('ps') //get
    pass(pss)
}

function pass(pss) {
    xhr = new XMLHttpRequest();
    xhr.open("POST", 'flow-visualization/pass');
    xhr.onload = passResponse;
    onerror = (event) => {
        console.log(event);
    };

    xhr.send(pss);
}

function passResponse(e) {
    if (this.status === 409) {
        alert("Wrong pasword.");
    }
    if (this.status === 200) {
        exposeButtons();
    }
}