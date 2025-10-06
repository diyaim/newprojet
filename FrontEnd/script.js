//étape 2: affichage dynamique des traveaux grace a l'appel d'API 

let allWorks = []; // tableau de traveaux 
getWork();         //vharger la galerie a l'ouverture de la page

//étape 3 et 4: filtres dynamiques 

fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(FiltreCategories => {
        const filtersContainer = document.querySelector(".filtres");


        //funtion pour l'état actif des boutons 
        function setActive(btn) {
            const boutons = filtersContainer.querySelectorAll("button");

            for (let i = 0; i < boutons.length; i++) {
                boutons[i].classList.remove("tousActif"); // retirer la classe avtive sur tous les boutons 
            }

            btn.classList.add("tousActif"); // appliquer la classe avtive sur le bouton cliqué 
        }

        //  création du bouton Tous
        const tous = document.createElement("button");
        tous.innerHTML = "Tous";
        tous.dataset.category = ""; // important pour reconnaître "Tous"
        filtersContainer.appendChild(tous);

        tous.addEventListener("click", () => {
            setActive(tous); // activer le bouton tous 
            const gallery = document.querySelector(".gallery");
            gallery.innerHTML = ""; // vider la galerie

            for (let j = 0; j < allWorks.length; j++) {
                gallery.appendChild(createimage(allWorks[j].imageUrl, allWorks[j].title)); // afficher tous les traveaux 
            }
        });

        // création des boutons de catégories
        for (let i = 0; i < FiltreCategories.length; i++) {

            const text = document.createElement("button");
            text.innerHTML = FiltreCategories[i].name;
            text.dataset.category = (FiltreCategories[i].id); // lier le bouton à l'id catégorie
            filtersContainer.appendChild(text);

            text.addEventListener("click", () => {
                setActive(text);
                const gallery = document.querySelector(".gallery");
                gallery.innerHTML = ""; // vider la galerie

                const catId = (FiltreCategories[i].id);
                for (let j = 0; j < allWorks.length; j++) {
                    if ((allWorks[j].categoryId) === catId) {
                        gallery.appendChild(createimage(allWorks[j].imageUrl, allWorks[j].title));
                    }
                }
            });
        }

        //affichage des traveaux
        setActive(tous); // activer le bouton tous 
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        for (let j = 0; j < allWorks.length; j++) {
            gallery.appendChild(createimage(allWorks[j].imageUrl, allWorks[j].title));
        }
    })
    .catch(erreur => {
        console.error(erreur);
    });

//étape 5: connexion 


// passage en mode édition aprés connexion 
const afficherBandeau = document.querySelector("#edition");
const filtersContainer = document.querySelector(".filtres");
const login = document.querySelector(".login");
const logoute = document.querySelector(".logout");
const modificationBtn = document.querySelector(".boutonmodifier");

if (localStorage.getItem("token") != null) { //si connecté
    afficherBandeau.classList.add("editmodevisible"); //affiche bandeau 
    filtersContainer.classList.add("btnedit"); //cache les filtres
    login.classList.add("editmodeinvisible"); //cache login 
    logoute.classList.remove("logout"); //affiche logout
    modificationBtn.classList.remove("boutonmodifier"); //affiche le bouton modifier 
}


// étapes 6 et 7: ajout de la modale, suppression des traveaux 

// gerer l'ouverture et la fermeture de la modale 1
const modal1 = document.getElementById("modal1");
const closemodal1 = document.getElementById("closemodal");
const openmodal1 = document.getElementById("openmodal");

//ouvrir la modal et charger les traveaux 
openmodal1.addEventListener("click", () => {
    modal1.setAttribute("aria-hidden", "false");

    fetch("http://localhost:5678/api/works") // récuperer les données 
        .then(response => response.json()) // transformer le retour de la requete en json
        .then(data => {
            const modalgallery1 = document.querySelector(".gallery1"); // récupération de la div qui contient les images du html
            modalgallery1.innerHTML = ""; //vider la galerie

            for (let i = 0; i < data.length; i++) {
                // créations des éléments HTML
                const figure1 = document.createElement("figure");
                const imageModal1 = document.createElement("img");
                const poubelle = document.createElement("button");

                const id = data[i].id;// récuperer l'id de l'image 
                figure1.dataset.id = id; //stocker l'id

                imageModal1.src = data[i].imageUrl; // source de l'image
                poubelle.className = "bouton-poubelle";
                poubelle.innerHTML = '<i class="fa-solid fa-trash-can"></i>';//création du bouton poubelle

                console.log(figure1.dataset);
                console.log(id);

                // supprimer les images
                poubelle.addEventListener("click", () => {

                    console.log(figure1);
                    const token = localStorage.getItem("token");

                    fetch(`http://localhost:5678/api/works/${id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                        .then(response => {
                            console.log("status : ", response.status)

                            if (response.status === 200 || response.status === 204) {
                                figure1.remove();//supprimer du Dom
                                getWork() //télévharger la nouvelle version des traveaux

                            } else if (response.status === 401) {
                                alert("non autorisé");
                            } else if (response.status === 500) {
                                alert("Erreur serveur (500)");
                            } else {
                                alert("suppression impossible");
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            alert(`Erreur réseau : ${error.message}`);
                        }
                        )
                })
                // ajouter les éléments dans le Dom
                figure1.appendChild(imageModal1); // ajout des images à l'élément figure
                figure1.appendChild(poubelle);
                modalgallery1.appendChild(figure1);
            }

        })
})
//fermer la modal avec le bouton +
closemodal1.addEventListener("click", () => {
    modal1.setAttribute("aria-hidden", "true");
})
//fermer la modal au click en dehors de la modal 
modal1.addEventListener("click", (e) => {
    if (e.target === modal1) {
        modal1.setAttribute("aria-hidden", "true");
    }
});


// étape 8: ajout d'un nouveau projet 

// gerer l'ouverture et la fermeture de la modal2

const modal2 = document.getElementById("modal2");
const closemodal2 = document.getElementById("closemodal2");
const openmodal2 = document.getElementById("openmodal2");
//ouvrir la modal
openmodal2.addEventListener("click", () => {
    modal1.setAttribute("aria-hidden", "true");
    modal2.setAttribute("aria-hidden", "false");

    // récupèrationtous les éléments
    const erreur = document.getElementById("erreur");  // zone du message d'erreur 
    const succes = document.getElementById("succes"); // zone du message de succès 
    const file = document.getElementById("file"); // input file pour choisir la photo
    const titreInput = document.getElementById("titre-photo"); // champ texte du titre
    const catSelect = document.getElementById("category"); // select des catégories
    const imgPreviewContainer = document.getElementById("affiche-image"); // <img> qui affiche la prévisualisation
    const inserer = document.getElementById("inserer-photo"); // bouton + Ajouter photos
    const infoFormat = document.getElementById("info-format"); // petit texte jpg, png : 4mo max
    const validerBtn = document.querySelector(".ajout-photo.valider"); // bouton Valider
    const form = document.querySelector(".champs-photos");


    erreur.style.display = "none"; // cache un ancien message d'erreur
    succes.style.display = "none"; // cache un ancien message de succès

    // vider les champs du formulaire
    file.value = "";  // supprime le fichier sélectionné
    titreInput.value = ""; // efface le titre saisi 
    catSelect.value = "";  // efface la catégorie séléctionnée 

    //  réinitialisation la zone de prévisualisation
    imgPreviewContainer.src = "";   // enlève l'ancienne image de preview
    imgPreviewContainer.style.display = "none";  // cache la balise <img> de preview
    document.querySelector(".zone-photos-icone i").style.display = "block";  // ré-affiche l'icône
    inserer.style.display = "flex"; // ré-affiche le bouton  Ajouter photos
    infoFormat.style.display = "block";  // ré-affiche le texte jpg, png : 4mo max

    //  re-désactive le bouton "Valider" au départ
    validerBtn.disabled = true;  // empêche d'envoyer tant que tout n'est pas rempli
    validerBtn.classList.remove("enabled");

    //afficher l'image
    file.addEventListener("change", () => { //pour charger le fichier
        const imgpreview = file.files[0]

        if (imgpreview) {
            imgPreviewContainer.src = URL.createObjectURL(imgpreview)
            // cacher l'icone
            const icone = document.querySelector(".zone-photos-icone i");
            icone.style.display = "none"
            imgPreviewContainer.style.display = "block"
            inserer.style.display = "none"
            infoFormat.style.display = "none"// cacher le text
        }
        activeBtn();
    })

    //ajout des categorie 
    const categories = document.getElementById("category");
    let alreadyLoaded = false; // pour éviter le rechagement a chauqe fois 

    categories.addEventListener("click", () => {
        if (alreadyLoaded) return;
        alreadyLoaded = true;
        fetch("http://localhost:5678/api/categories")
            .then(response => response.json())
            .then(liste => {
                categories.innerHTML = "";

                // option placeholder
                const placeholder = document.createElement("option");
                placeholder.value = "";
                placeholder.textContent = "";
                placeholder.disabled = true;
                placeholder.selected = true;
                placeholder.hidden = true;
                categories.appendChild(placeholder);
                for (let i = 0; i < liste.length; i++) {
                    const option = document.createElement("option");
                    option.innerHTML = liste[i].name;
                    option.value = liste[i].id;
                    categories.appendChild(option);
                }

                activeBtn();  // met à jour le bouton sans obliger l'utilisateur à re-cliquer le select
            });
    });

    //affichage du message d'erreur 



    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fichier = document.getElementById("file").files[0]; //récuperer l'imagee sélectionnée
        const titre = document.getElementById("titre-photo").value.trim(); //récup le titre saisi sans les espaces
        const categorie = document.getElementById("category").value; //récup la catégorie 


        if (!fichier || !titre || !categorie) {
            erreur.textContent = "Veuillez remplir tous les champs avant de valider.";
            erreur.style.display = "block";
            return;
        }

        //  Envoi à l’API
        // Création de l’objet FormData
        const formData = new FormData();
        formData.append("image", fichier);
        formData.append("title", titre);
        formData.append("category", categorie);

        //  Envoi à l’API
        const token = localStorage.getItem("token");
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            },
            body: formData
        })
            .then(response => {
                console.log("status : ", response.status)

                if (response.status === 201 || response.status === 200) {
                    erreur.style.display = "none";
                    succes.textContent = "Projet ajouté avec succés";
                    succes.style.display = "block";
                    alert("Projet envoyé )");
                    getWork()

                    modal2.setAttribute("aria-hidden", "true"); //fermer modal 
                } else if (response.status === 400) {
                    alert("	Bad Request"); //???????
                } else if (response.status === 401) {
                    alert("non autorisé");
                } else if (response.status === 500) {
                    alert("Erreur serveur (500)");
                } else {
                    alert("envoi impossible");
                }
            })
            .catch(error => {
                console.error(error);
                erreur.textContent = "Erreur réseau. Veuillez réessayer plus tard.";
                erreur.style.display = "block";
            });

    }, { once: true });

    function activeBtn() {
        const ok = file.files[0] && titreInput.value.trim() && catSelect.value;
        validerBtn.disabled = !ok;
        if (ok) {
            validerBtn.classList.add("enabled");
        } else {
            validerBtn.classList.remove("enabled");
        }

    }
    // on vérifie à chaque modification

    titreInput.addEventListener("input", activeBtn);
    catSelect.addEventListener("change", activeBtn); //?????????
    activeBtn();
});


//fermer la modal avec le bouton +
closemodal2.addEventListener("click", () => { // !!!!!!!!!faire une fonction 
    modal2.setAttribute("aria-hidden", "true");
})
//fermer la modal au click en dehors de la modal 
modal2.addEventListener("click", (e) => {
    if (e.target === modal2) {
        modal2.setAttribute("aria-hidden", "true");
    }
});

//retour a modal1
const precedent = document.getElementById("precedent");
precedent.addEventListener("click", () => {
    modal2.setAttribute("aria-hidden", "true");
    modal1.setAttribute("aria-hidden", "false");
})

console.log(localStorage.getItem("token"));



// les functions 
// récupération des travaux 
function getWork() {
    fetch("http://localhost:5678/api/works") // Récupérer les données
        .then(response => response.json()) // Transformer la réponse en JSON
        .then(data => {
            const worksGallery = document.querySelector(".gallery"); // Sélection de la galerie
            worksGallery.innerHTML = ""; // Vider la galerie avant de la remplir

            for (let i = 0; i < data.length; i++) {
                // Création des éléments
                const figure = createimage(data[i].imageUrl, data[i].title);
                worksGallery.appendChild(figure);
            }

            allWorks = data; // Stocker les traveaux
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des travaux :", error);
        });
}

// fonction pour créer les images 
function createimage(imageUrl, title) {
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img")
    const captionElement = document.createElement("figcaption");

    imageElement.src = imageUrl; // afficher les images

    console.log(imageElement);
    captionElement.innerText = title; // afficher les titres
    figureElement.appendChild(imageElement); // ajout des images à l'élément figure
    figureElement.appendChild(captionElement); //ajout des titres à l'élément figure


    return figureElement;
}

// deconnexion: function appelée en html 
function logout() {
    localStorage.removeItem("token");
    location.reload();

}


//étape 3 et 4: affichage dynamique
// récupération des filtres
// fetch("http://localhost:5678/api/categories")
//     .then(response => response.json())
//     .then(filtre => {
//         const filtres = document.querySelector(".filtres");

//         // création du bouton tous

//         const tous = document.createElement("button");
//         tous.innerHTML = "Tous";
//         tous.classList.add("tousActif");
//         tous.dataset.category = "";
//         filtres.appendChild(tous);

//         // tous.addEventListener("click", () => {

//         //     const gallery = document.querySelector(".gallery");
//         //     gallery.innerHTML = ""; // vider la galerie

//         //     // afficher toutes les images
//         //     for (let j = 0; j < allWorks.length; j++) {
//         //         const figure = createimage(allWorks[j].imageUrl, allWorks[j].title); //appel de la function pour afficher les images
//         //         gallery.appendChild(figure);
//         //     }
//         // });

//         //creation des filtres
//         for (let i = 0; i < filtre.length; i++) {
//             const text = document.createElement("button");
//             text.innerHTML = filtre[i].name;

//             text.dataset.category = filtre[i].id;
//             filtres.appendChild(text);
//         }


//         //??????????????????????????????????????????????
//         filtres.childNodes.forEach((element) => {
//             element.addEventListener("click", () => {
//                 filtres.childNodes.forEach((element) => {
//                     element.classList.remove("tousActif");
//                 })
//                 element.classList.add("tousActif")
//                 const gallery = document.querySelector(".gallery");
//                 gallery.innerHTML = ""; // vider la galerie

//                 for (let j = 0; j < allWorks.length; j++) {
//                     console.log(element);
//                     console.log(allWorks[j]);
//                     if (allWorks[j].categoryId == element.dataset.category) {
//                         const figurelement = createimage(allWorks[j].imageUrl, allWorks[j].title); //appel de la function pour afficher les images
//                         gallery.appendChild(figurelement);

//                     } else if (allWorks[j].categoryId === null) {
//                         const figurelement = createimage(allWorks[j].imageUrl, allWorks[j].title); //appel de la function pour afficher les images
//                         gallery.appendChild(figurelement);
//                     }
//                 }
//             });
//         })
//     })


