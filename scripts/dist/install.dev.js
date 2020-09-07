'use strict';

var deferredInstallPrompt = null;
var installButton = document.getElementById('butInstall');
installButton.addEventListener('click', installPWA); //event listener for beforeinstallprompt event

window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);
/**
 * Event handler for beforeinstallprompt event.
 *   Saves the event & shows install button.
 *
 * @param {Event} evt
 */

function saveBeforeInstallPromptEvent(evt) {
  //code to save event & show the install button.
  deferredInstallPrompt = evt;
  installButton.removeAttribute('hidden');
}
/**
 * Event handler for butInstall - Does the PWA installation.
 *
 * @param {Event} evt
 */


function installPWA(evt) {
  //code to show install prompt & hide the install button.
  deferredInstallPrompt.prompt(); //Log user response to prompt.

  evt.srcElement.setAttribute('hidden', true);
} //event listener for appinstalled event


window.addEventListener('appinstalled', logAppInstalled);
/**
 * Event handler for appinstalled event.
 *   Log the installation to analytics or save the event somehow.
 *
 * @param {Event} evt
 */

function logAppInstalled(evt) {
  //code to log the event
  deferredInstallPrompt.userChoice.then(function (choice) {
    if (choice.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt', choice);
    } else {
      console.log('User dismissed the A2HS prompt', choice);
    }

    deferredInstallPrompt = null;
  });
  console.log('Weather App was installed.', evt);
}