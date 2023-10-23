// This variable will save the event for later use.
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevents the default mini-infobar or install dialog from appearing on mobile
    e.preventDefault();
    // Save the event because you'll need to trigger it later.
    deferredPrompt = e;
    window.deferredPrompt = e;
});
        

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
 }
 