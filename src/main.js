import initializeAnimations from './parts/animations';
import initializePopups from './components/popups';
import initializeWizard from './components/wizard.js';


// ---- Init animations ----
// init animation if it's not /404 url page
if(window.location.pathname !== '/404' && window.location.pathname !== '/wizard/cube') {
  initializeAnimations();
  initializePopups();
} else if(window.location.pathname === '/wizard/cube'){
  initializeWizard();
}