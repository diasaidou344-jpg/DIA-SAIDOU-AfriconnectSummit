/* ============================================================
   AfriConnect Summit 2026 - JavaScript principal
   Auteur : [Votre Nom]
   Fichier : js/main.js

   Ce fichier contient toutes les fonctionnalités interactives
   du site. Chaque section est commentée pour faciliter la
   compréhension.
   ============================================================ */


/* ============================================================
   1. DARK MODE / LIGHT MODE
   Sauvegarde le thème choisi dans localStorage pour qu'il
   persiste d'une page à l'autre.
   ============================================================ */

// On récupère le bouton toggle
const boutonTheme = document.getElementById('btn-theme');

// On lit le thème sauvegardé (null si première visite)
const themeSauvegarde = localStorage.getItem('theme');

// Si l'utilisateur avait choisi le dark mode, on l'applique
if (themeSauvegarde === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

// Au clic sur le bouton, on bascule le thème
if (boutonTheme) {
  boutonTheme.addEventListener('click', function () {
    const themeActuel = document.documentElement.getAttribute('data-theme');

    if (themeActuel === 'dark') {
      // Retour au mode clair
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      // Passage au mode sombre
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}


/* ============================================================
   2. NAVBAR DYNAMIQUE
   - Ombre après 80px de défilement
   - Menu hamburger pour mobile
   ============================================================ */

const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const menuLiens = document.getElementById('menu-liens');
const overlayMenu = document.getElementById('overlay-menu');

// Ajoute une ombre à la navbar quand on défile de 80px
window.addEventListener('scroll', function () {
  if (window.scrollY > 80) {
    navbar.classList.add('scrollee');
  } else {
    navbar.classList.remove('scrollee');
  }

  // Aussi utile pour le bouton retour en haut (voir section 7)
  gererBoutonHaut();
});

// Ouvre ou ferme le menu hamburger au clic
if (hamburger) {
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('ouvert');
    menuLiens.classList.toggle('ouverte');

    if (overlayMenu) {
      overlayMenu.classList.toggle('visible');
    }
  });
}

// Ferme le menu si on clique sur l'overlay (fond sombre)
if (overlayMenu) {
  overlayMenu.addEventListener('click', function () {
    hamburger.classList.remove('ouvert');
    menuLiens.classList.remove('ouverte');
    overlayMenu.classList.remove('visible');
  });
}

// Ferme le menu quand on clique sur un lien (navigation)
if (menuLiens) {
  menuLiens.querySelectorAll('a').forEach(function (lien) {
    lien.addEventListener('click', function () {
      hamburger.classList.remove('ouvert');
      menuLiens.classList.remove('ouverte');
      if (overlayMenu) overlayMenu.classList.remove('visible');
    });
  });
}

// Marque le lien actif en comparant l'URL actuelle
function marquerLienActif() {
  const urlActuelle = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.navbar__liens a').forEach(function (lien) {
    const hrefLien = lien.getAttribute('href');
    if (hrefLien === urlActuelle) {
      lien.classList.add('actif');
    }
  });
}

marquerLienActif();


/* ============================================================
   3. ANIMATIONS AU SCROLL
   Utilise IntersectionObserver pour déclencher les animations
   quand les éléments entrent dans la zone visible.
   ============================================================ */

// On crée un observateur qui surveille les éléments ".animer"
const observateur = new IntersectionObserver(
  function (entrees) {
    entrees.forEach(function (entree) {
      // Si l'élément est visible dans le viewport
      if (entree.isIntersecting) {
        entree.target.classList.add('visible');
        // On arrête de surveiller cet élément (animation unique)
        observateur.unobserve(entree.target);
      }
    });
  },
  {
    threshold: 0.1,      // Déclenche quand 10% est visible
    rootMargin: '0px 0px -50px 0px'  // Légèrement avant le bas
  }
);

// On surveille tous les éléments avec la classe .animer
document.querySelectorAll('.animer').forEach(function (element) {
  observateur.observe(element);
});


/* ============================================================
   4. COMPTE À REBOURS (page d'accueil)
   Calcule le temps restant jusqu'à la date fictive de la
   conférence et met à jour l'affichage chaque seconde.
   ============================================================ */

// Date fictive de la conférence - 15 novembre 2026
const dateConference = new Date('2026-11-15T09:00:00');

const elemJours = document.getElementById('cr-jours');
const elemHeures = document.getElementById('cr-heures');
const elemMinutes = document.getElementById('cr-minutes');
const elemSecondes = document.getElementById('cr-secondes');

function mettreAJourCompteRebours() {
  // Si les éléments n'existent pas (autre page), on arrête
  if (!elemJours) return;

  const maintenant = new Date();
  const difference = dateConference - maintenant;

  if (difference <= 0) {
    // La conférence est passée ou commence
    elemJours.textContent = '00';
    elemHeures.textContent = '00';
    elemMinutes.textContent = '00';
    elemSecondes.textContent = '00';
    return;
  }

  // Calcul du temps restant
  const jours = Math.floor(difference / (1000 * 60 * 60 * 24));
  const heures = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const secondes = Math.floor((difference % (1000 * 60)) / 1000);

  // Formatage avec zéro devant si nécessaire (ex: 05 au lieu de 5)
  elemJours.textContent = String(jours).padStart(2, '0');
  elemHeures.textContent = String(heures).padStart(2, '0');
  elemMinutes.textContent = String(minutes).padStart(2, '0');
  elemSecondes.textContent = String(secondes).padStart(2, '0');
}

// Mise à jour immédiate puis toutes les secondes
mettreAJourCompteRebours();
setInterval(mettreAJourCompteRebours, 1000);


/* ============================================================
   5. COMPTEURS ANIMÉS (section Chiffres Clés)
   Les nombres s'incrémentent progressivement quand la section
   entre dans le viewport (effet de comptage).
   ============================================================ */

// Fonction qui anime un compteur de 0 jusqu'à une valeur cible
function animerCompteur(element, valeurCible, duree) {
  const debut = 0;
  const increment = valeurCible / (duree / 16); // 60fps environ
  let valeurActuelle = debut;

  const timer = setInterval(function () {
    valeurActuelle += increment;

    if (valeurActuelle >= valeurCible) {
      valeurActuelle = valeurCible;
      clearInterval(timer);
    }

    // Formatage avec + et séparateur de milliers
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    element.textContent = prefix + Math.floor(valeurActuelle).toLocaleString('fr-FR') + suffix;
  }, 16);
}

// On observe chaque carte de chiffre clé
const compteurs = document.querySelectorAll('.chiffres__nombre');

const observateurCompteurs = new IntersectionObserver(
  function (entrees) {
    entrees.forEach(function (entree) {
      if (entree.isIntersecting) {
        const element = entree.target;
        const valeur = parseInt(element.dataset.valeur, 10);
        animerCompteur(element, valeur, 1500); // 1.5 secondes
        observateurCompteurs.unobserve(element);
      }
    });
  },
  { threshold: 0.5 }
);

compteurs.forEach(function (compteur) {
  observateurCompteurs.observe(compteur);
});


/* ============================================================
   6. ONGLETS DU PROGRAMME (page programme.html)
   Affiche le contenu du jour sélectionné et cache les autres.
   ============================================================ */

const boutonsOnglets = document.querySelectorAll('.onglet-btn');
const contenuOnglets = document.querySelectorAll('.onglet-contenu');

boutonsOnglets.forEach(function (bouton) {
  bouton.addEventListener('click', function () {
    // Récupère l'identifiant de l'onglet cible
    const cible = bouton.dataset.onglet;

    // Retire la classe active de tous les boutons
    boutonsOnglets.forEach(function (b) {
      b.classList.remove('actif');
    });

    // Cache tous les contenus
    contenuOnglets.forEach(function (contenu) {
      contenu.classList.remove('actif');
    });

    // Active le bouton cliqué
    bouton.classList.add('actif');

    // Affiche le contenu correspondant
    const contenuCible = document.getElementById('onglet-' + cible);
    if (contenuCible) {
      contenuCible.classList.add('actif');
    }
  });
});


/* ============================================================
   7. FILTRAGE DES INTERVENANTS (page intervenants.html)
   Cache ou affiche les cartes selon la thématique choisie.
   ============================================================ */

const boutonsFiltre = document.querySelectorAll('.filtre-btn');
const cartesIntervenants = document.querySelectorAll('.intervenant__carte[data-categorie]');

boutonsFiltre.forEach(function (bouton) {
  bouton.addEventListener('click', function () {
    const filtre = bouton.dataset.filtre;

    // Mise à jour du bouton actif
    boutonsFiltre.forEach(function (b) {
      b.classList.remove('actif');
    });
    bouton.classList.add('actif');

    // Filtrage des cartes
    cartesIntervenants.forEach(function (carte) {
      const categorie = carte.dataset.categorie;

      if (filtre === 'tous' || categorie === filtre) {
        // Affiche la carte
        carte.classList.remove('cachee');
      } else {
        // Cache la carte
        carte.classList.add('cachee');
      }
    });
  });
});


/* ============================================================
   8. VALIDATION DU FORMULAIRE (page contact.html)
   Vérifie tous les champs avant soumission avec retour visuel.
   ============================================================ */

const formulaire = document.getElementById('formulaire-inscription');

if (formulaire) {
  formulaire.addEventListener('submit', function (evenement) {
    // On empêche le rechargement de la page
    evenement.preventDefault();

    // On valide tous les champs
    const formulaireValide = validerFormulaire();

    if (formulaireValide) {
      // Affiche le message de succès
      afficherSucces();
      // Réinitialise le formulaire
      formulaire.reset();
      // Supprime les classes de validation
      nettoyerValidation();
    }
  });

  // Validation en temps réel à la perte de focus
  formulaire.querySelectorAll('input, select, textarea').forEach(function (champ) {
    champ.addEventListener('blur', function () {
      validerChamp(champ);
    });
  });
}

// Valide le formulaire complet et retourne vrai si tout est ok
function validerFormulaire() {
  let estValide = true;
  const champs = formulaire.querySelectorAll('input[required], select[required], textarea[required]');

  champs.forEach(function (champ) {
    if (!validerChamp(champ)) {
      estValide = false;
    }
  });

  return estValide;
}

// Valide un champ individuel et affiche un retour visuel
function validerChamp(champ) {
  const valeur = champ.value.trim();
  const messageErreur = document.getElementById('erreur-' + champ.id);
  let erreur = '';

  // Vérifie selon le type de champ
  if (champ.id === 'email') {
    // Regex simple pour valider l'email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!valeur) {
      erreur = 'L\'adresse email est obligatoire.';
    } else if (!regexEmail.test(valeur)) {
      erreur = 'Veuillez entrer une adresse email valide.';
    }

  } else if (champ.id === 'telephone') {
    // Minimum 8 chiffres (on enlève les espaces et tirets)
    const chiffres = valeur.replace(/[\s\-\+]/g, '');
    if (!valeur) {
      erreur = 'Le numéro de téléphone est obligatoire.';
    } else if (chiffres.length < 8) {
      erreur = 'Le numéro doit contenir au moins 8 chiffres.';
    }

  } else if (champ.id === 'message') {
    // Message minimum 20 caractères
    if (!valeur) {
      erreur = 'Le message est obligatoire.';
    } else if (valeur.length < 20) {
      erreur = 'Le message doit contenir au moins 20 caractères.';
    }

  } else if (champ.required && !valeur) {
    // Champ requis vide
    erreur = 'Ce champ est obligatoire.';
  }

  // Applique les styles de validation
  if (erreur) {
    champ.classList.remove('valide');
    champ.classList.add('invalide');
    if (messageErreur) {
      messageErreur.textContent = erreur;
      messageErreur.classList.add('visible');
    }
    return false;
  } else {
    champ.classList.remove('invalide');
    champ.classList.add('valide');
    if (messageErreur) {
      messageErreur.classList.remove('visible');
    }
    return true;
  }
}

// Affiche le message de succès après soumission
function afficherSucces() {
  const messageSucces = document.getElementById('message-succes');
  if (messageSucces) {
    messageSucces.classList.add('visible');

    // On fait défiler jusqu'au message de succès
    messageSucces.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Supprime toutes les classes de validation du formulaire
function nettoyerValidation() {
  formulaire.querySelectorAll('.valide, .invalide').forEach(function (champ) {
    champ.classList.remove('valide', 'invalide');
  });
}


/* ============================================================
   9. BOUTON RETOUR EN HAUT
   Apparaît après 300px de défilement, remonte en douceur.
   ============================================================ */

const boutonHaut = document.getElementById('btn-haut');

function gererBoutonHaut() {
  if (!boutonHaut) return;

  if (window.scrollY > 300) {
    boutonHaut.classList.add('visible');
  } else {
    boutonHaut.classList.remove('visible');
  }
}

if (boutonHaut) {
  boutonHaut.addEventListener('click', function () {
    // Défilement fluide vers le haut
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


/* ============================================================
   10. ANNÉE DYNAMIQUE DANS LE FOOTER
   Injecte automatiquement l'année courante.
   ============================================================ */

const elementsAnnee = document.querySelectorAll('.annee-dynamique');

elementsAnnee.forEach(function (element) {
  element.textContent = new Date().getFullYear();
});