/* ============================================================
   AfriConnect Summit 2026 - JavaScript principal
   Auteur : [Votre Nom]
   ============================================================ */


/* --- 1. DARK MODE avec localStorage --- */
const boutonTheme = document.getElementById('btn-theme');
const themeSauvegarde = localStorage.getItem('theme');

if (themeSauvegarde === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

if (boutonTheme) {
  boutonTheme.addEventListener('click', function () {
    const themeActuel = document.documentElement.getAttribute('data-theme');
    if (themeActuel === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}


/* --- 2. NAVBAR : ombre au scroll + hamburger --- */
const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const menuLiens = document.getElementById('menu-liens');
const overlayMenu = document.getElementById('overlay-menu');

window.addEventListener('scroll', function () {
  if (window.scrollY > 80) {
    navbar.classList.add('scrollee');
  } else {
    navbar.classList.remove('scrollee');
  }
  gererBoutonHaut();
});

if (hamburger) {
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('ouvert');
    menuLiens.classList.toggle('ouverte');
    if (overlayMenu) overlayMenu.classList.toggle('visible');
  });
}

if (overlayMenu) {
  overlayMenu.addEventListener('click', function () {
    hamburger.classList.remove('ouvert');
    menuLiens.classList.remove('ouverte');
    overlayMenu.classList.remove('visible');
  });
}

// Ferme le menu au clic sur un lien
if (menuLiens) {
  menuLiens.querySelectorAll('a').forEach(function (lien) {
    lien.addEventListener('click', function () {
      hamburger.classList.remove('ouvert');
      menuLiens.classList.remove('ouverte');
      if (overlayMenu) overlayMenu.classList.remove('visible');
    });
  });
}

// Lien actif selon la page courante
const urlActuelle = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navbar__liens a').forEach(function (lien) {
  if (lien.getAttribute('href') === urlActuelle) lien.classList.add('actif');
});


/* --- 3. ANIMATIONS au scroll via IntersectionObserver --- */
const observateur = new IntersectionObserver(
  function (entrees) {
    entrees.forEach(function (entree) {
      if (entree.isIntersecting) {
        entree.target.classList.add('visible');
        observateur.unobserve(entree.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.animer').forEach(function (el) {
  observateur.observe(el);
});


/* --- 4. COMPTE À REBOURS jusqu'au 15 novembre 2026 --- */
const dateConference = new Date('2026-11-15T09:00:00');
const elemJours = document.getElementById('cr-jours');
const elemHeures = document.getElementById('cr-heures');
const elemMinutes = document.getElementById('cr-minutes');
const elemSecondes = document.getElementById('cr-secondes');

function mettreAJourCompteRebours() {
  if (!elemJours) return;
  const diff = dateConference - new Date();
  if (diff <= 0) { elemJours.textContent = elemHeures.textContent = elemMinutes.textContent = elemSecondes.textContent = '00'; return; }
  elemJours.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
  elemHeures.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  elemMinutes.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  elemSecondes.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
mettreAJourCompteRebours();
setInterval(mettreAJourCompteRebours, 1000);


/* --- 5. COMPTEURS ANIMÉS sur les chiffres clés --- */
function animerCompteur(element, valeurCible, duree) {
  const increment = valeurCible / (duree / 16);
  let valeur = 0;
  const timer = setInterval(function () {
    valeur += increment;
    if (valeur >= valeurCible) { valeur = valeurCible; clearInterval(timer); }
    const prefix = element.dataset.prefix || '';
    element.textContent = prefix + Math.floor(valeur).toLocaleString('fr-FR');
  }, 16);
}

const observateurCompteurs = new IntersectionObserver(
  function (entrees) {
    entrees.forEach(function (entree) {
      if (entree.isIntersecting) {
        animerCompteur(entree.target, parseInt(entree.target.dataset.valeur, 10), 1500);
        observateurCompteurs.unobserve(entree.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.chiffres__nombre').forEach(function (el) { observateurCompteurs.observe(el); });


/* --- 6. ONGLETS du programme --- */
const boutonsOnglets = document.querySelectorAll('.onglet-btn');
const contenuOnglets = document.querySelectorAll('.onglet-contenu');

boutonsOnglets.forEach(function (bouton) {
  bouton.addEventListener('click', function () {
    boutonsOnglets.forEach(function (b) { b.classList.remove('actif'); });
    contenuOnglets.forEach(function (c) { c.classList.remove('actif'); });
    bouton.classList.add('actif');
    const cible = document.getElementById('onglet-' + bouton.dataset.onglet);
    if (cible) cible.classList.add('actif');
  });
});


/* --- 7. FILTRAGE des intervenants --- */
const boutonsFiltre = document.querySelectorAll('.filtre-btn');
const cartesIntervenants = document.querySelectorAll('.intervenant__carte[data-categorie]');

boutonsFiltre.forEach(function (bouton) {
  bouton.addEventListener('click', function () {
    boutonsFiltre.forEach(function (b) { b.classList.remove('actif'); });
    bouton.classList.add('actif');
    const filtre = bouton.dataset.filtre;
    cartesIntervenants.forEach(function (carte) {
      if (filtre === 'tous' || carte.dataset.categorie === filtre) {
        carte.classList.remove('cachee');
      } else {
        carte.classList.add('cachee');
      }
    });
  });
});


/* --- 8. VALIDATION du formulaire --- */
const formulaire = document.getElementById('formulaire-inscription');

if (formulaire) {
  formulaire.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validerFormulaire()) {
      document.getElementById('message-succes').classList.add('visible');
      formulaire.reset();
      formulaire.querySelectorAll('.valide, .invalide').forEach(function (c) { c.classList.remove('valide', 'invalide'); });
    }
  });

  formulaire.querySelectorAll('input, select, textarea').forEach(function (champ) {
    champ.addEventListener('blur', function () { validerChamp(champ); });
  });
}

function validerFormulaire() {
  let ok = true;
  formulaire.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (c) {
    if (!validerChamp(c)) ok = false;
  });
  return ok;
}

function validerChamp(champ) {
  const valeur = champ.value.trim();
  const erreur = document.getElementById('erreur-' + champ.id);
  let msg = '';

  if (champ.id === 'email') {
    if (!valeur) msg = "L'email est obligatoire.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur)) msg = "Email invalide.";
  } else if (champ.id === 'telephone') {
    if (!valeur) msg = "Le téléphone est obligatoire.";
    else if (valeur.replace(/[\s\-\+]/g,'').length < 8) msg = "Minimum 8 chiffres.";
  } else if (champ.id === 'message') {
    if (!valeur) msg = "Le message est obligatoire.";
    else if (valeur.length < 20) msg = "Minimum 20 caractères.";
  } else if (champ.required && !valeur) {
    msg = "Ce champ est obligatoire.";
  }

  if (msg) {
    champ.classList.remove('valide'); champ.classList.add('invalide');
    if (erreur) { erreur.textContent = msg; erreur.classList.add('visible'); }
    return false;
  } else {
    champ.classList.remove('invalide'); champ.classList.add('valide');
    if (erreur) erreur.classList.remove('visible');
    return true;
  }
}


/* --- 9. BOUTON RETOUR EN HAUT --- */
const boutonHaut = document.getElementById('btn-haut');

function gererBoutonHaut() {
  if (!boutonHaut) return;
  if (window.scrollY > 300) boutonHaut.classList.add('visible');
  else boutonHaut.classList.remove('visible');
}

if (boutonHaut) {
  boutonHaut.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* --- 10. ANNÉE DYNAMIQUE dans le footer --- */
document.querySelectorAll('.annee-dynamique').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});
