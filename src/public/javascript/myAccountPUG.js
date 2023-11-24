function logPasswords() {
    event.preventDefault();  // Verhindert das Standardverhalten des Submit-Buttons

    var neuesPasswort = document.getElementById('neuesPasswort').value;
    var passwortWiederholen = document.getElementById('passwortWiederholen').value;
    console.log('Neues Passwort: ', neuesPasswort);
    console.log('Passwort wiederholen: ', passwortWiederholen);

    fetch('/account/passworteandern', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ neuesPasswort, passwortWiederholen })
    })
    .then(response => response.status)
    .then(status => handleResponse(status))
    .catch(error => console.error('Error:', error));
}



function handleResponse(status) {
    if (status === 200) {
        showSuccessNotification('Passwort geändert');
    } else if (status === 404) {
        showNotification('Falsches Passwort eingegeben');
    }
}

function showNotification(message) {
    var notificationOverlay = document.createElement('div');
    notificationOverlay.className = 'notification-overlay';
    var notificationred = document.createElement('div');
    notificationred.className = 'notificationred';

    var p = document.createElement('p');
    p.textContent = message;

    var closeButton = document.createElement('button');
    closeButton.textContent = 'Schließen';
    closeButton.className = 'btn btn-secondary btn-sm'; // Stile für den Button hinzufügen
    closeButton.addEventListener('click', function() {
        document.body.removeChild(notificationOverlay);
        location.reload(); // Hier die Seite neu laden
    });

    notificationred.appendChild(p);
    notificationred.appendChild(closeButton);
    notificationOverlay.appendChild(notificationred);
    document.body.appendChild(notificationOverlay);
}


function showSuccessNotification(message) {
    var notificationOverlay = document.createElement('div');
    notificationOverlay.className = 'notification-overlay';
    var notificationGreen = document.createElement('div');
    notificationGreen.className = 'notificationgreen';

    var p = document.createElement('p');
    p.textContent = message;

    var closeButton = document.createElement('button');
    closeButton.textContent = 'Schließen';
    closeButton.className = 'btn btn-secondary btn-sm'; // Stile für den Button hinzufügen
    closeButton.addEventListener('click', function() {
        document.body.removeChild(notificationOverlay);
        location.reload(); // Hier die Seite neu laden
    });

    notificationGreen.appendChild(p);
    notificationGreen.appendChild(closeButton);
    notificationOverlay.appendChild(notificationGreen);
    document.body.appendChild(notificationOverlay);
}