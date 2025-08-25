let img = [];
// récupération des travaux 
fetch("http://localhost:5678/api/works") // récuperer les données 
    .then(response => response.json()) // transformer le retour de la requete en json
    .then(data => {



        const gallery = document.querySelector(".gallery"); // récupération de la div qui contient les images du html

        for (i = 0; i < data.length; i++) {
            // créations des éléments HTML
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const figcaption = document.createElement("figcaption");

            gallery.appendChild(figure);

            img.src = data[i].imageUrl; // afficher les images
            figure.appendChild(img); // ajout des images à l'élément figure

            figcaption.innerHTML = data[i].title; // afficher les titres
            figure.appendChild(figcaption); //ajout des titres à l'élément figure

        }
        img = data; // pour récupérer le tableau des images 


    })



// récupération des filtres
fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(filtre => {
        const filtres = document.querySelector(".filtres");
        // création du bouton tous
        const tous = document.createElement("button");
        tous.innerHTML = "Tous";

        tous.addEventListener("click", () => {
            const gallery = document.querySelector(".gallery");
            gallery.innerHTML = ""; // vider la galerie 
            // afficher toutes les images 
            for (let j = 0; j < img.length; j++) {
                const figure = document.createElement("figure");
                const image = document.createElement("img");
                const figcaption = document.createElement("figcaption");

                image.src = img[j].imageUrl;
                figcaption.innerText = img[j].title;

                figure.appendChild(image);
                figure.appendChild(figcaption);
                gallery.appendChild(figure);
            }
        });
        // ajouter le tous aux filtres 
        //tous.classList.add("tous");
        //console.log(filtres);
        filtres.appendChild(tous);
        //console.log(img);

        //creation des filtres
        for (let i = 0; i < filtre.length; i++) {
            const text = document.createElement("button");
            text.innerHTML = filtre[i].name;
            filtres.appendChild(text);
            text.addEventListener("click", () => {
                const gallery = document.querySelector(".gallery");
                gallery.innerHTML = ""; // vider la galerie 

                for (let j = 0; j < img.length; j++) {

                    if (img[j].categoryId === filtre[i].id) {
                        const figurelement = createimage(img[j].imageUrl, img[j].title);
                        gallery.appendChild(figurelement);
                        // const figure = document.createElement("figure");
                        // const image = document.createElement("img")
                        // const figcaption = document.createElement("figcaption");

                        // image.src = img[j].imageUrl;
                        // figcaption.innerText = img[j].title;
                        // figure.appendChild(image);
                        // figure.appendChild(figcaption);
                        // gallery.appendChild(figure);

                    } else if (img[j].categoryId === null) {
                        const figurelement = createimage(img[j].imageUrl, img[j].title);
                        gallery.appendChild(figurelement);
                        // const figure = document.createElement("figure");
                        // const image = document.createElement("img")
                        // const figcaption = document.createElement("figcaption");
                        // image.src = img[j].imageUrl;
                        // figcaption.innerText = img[j].title;
                        // figure.appendChild(image);
                        // figure.appendChild(figcaption);
                        // gallery.appendChild(figure);
                    }
                }
            })
        }

    })

// fonction pour créer les images 
function createimage(imageUrl, title) {
    const figure = document.createElement("figure");
    const image = document.createElement("img")
    const figcaption = document.createElement("figcaption");

    image.src = imageUrl; // afficher les images

    console.log(image);
    figcaption.innerText = title; // afficher les titres
    figure.appendChild(image); // ajout des images à l'élément figure
    figure.appendChild(figcaption); //ajout des titres à l'élément figure

    return figure;
}










const edition = document.querySelector("#edition");
const filtres = document.querySelector(".filtres");
const login = document.querySelector(".login");
const logoute = document.querySelector(".logout");
const modification = document.querySelector(".boutonmodifier");
//console.log(filtres);
//console.log(localStorage.getItem("token"));

if (localStorage.getItem("token") != null) {
    // console.log(edition);
    edition.classList.add("editmodevisible");
    //console.log( edition.classList);
    filtres.classList.add("btnedit");
    login.classList.add("editmodeinvisible");
    logoute.classList.remove("logout");
    modification.classList.remove("boutonmodifier");
}


// deconnexion: function appelée en html 
function logout() {
    localStorage.removeItem("token");
    location.reload();

}

// gerer l'ouverture et la fermeture de la modal 
const modal = document.getElementById("modal1");
const closemodal = document.getElementById("closemodal");
const openmodal = document.getElementById("openmodal");
//ouvrir la modal
openmodal.addEventListener("click", () => {
    modal.setAttribute("aria-hidden", "false");
    fetch("http://localhost:5678/api/works") // récuperer les données 
        .then(response => response.json()) // transformer le retour de la requete en json
        .then(data => {
            const gallery1 = document.querySelector(".gallery1"); // récupération de la div qui contient les images du html
            gallery1.innerHTML = ""; //vider la galerie
            for (let i = 0; i < data.length; i++) {
                // créations des éléments HTML
                const figure1 = document.createElement("figure");
                const img = document.createElement("img");
                const poubelle = document.createElement("button");

                const id = data[i].id;// récuperer l'id de l'image 
                figure1.dataset.id = id; //stocker l'id

                img.src = data[i].imageUrl; // source de l'image
                poubelle.className = "bouton-poubelle";
                poubelle.innerHTML = '<i class="fa-solid fa-trash-can"></i>';//création du bouton poubelle


                console.log(figure1.dataset);
                console.log(id);

                // supprimer les images
                poubelle.addEventListener("click", () => {

                    console.log(figure1);
                    const token = localStorage.getItem("token");

                    fetch(`http://localhost:5678/api/works/${id}`, {   // <-- backticks
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                        .then(response => {
                            console.log("status : ", response.status)

                            if (response.status === 200 || response.status === 204) {
                                figure1.remove();//supprimer du Dom

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
                figure1.appendChild(img); // ajout des images à l'élément figure
                gallery1.appendChild(figure1);
                figure1.appendChild(poubelle);
            }

        })
})
//fermer la modal avec le bouton +
closemodal.addEventListener("click", () => {
    modal.setAttribute("aria-hidden", "true");
})
//fermer la modal au click en dehors de la modal 
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.setAttribute("aria-hidden", "true");
    }
});

// gerer l'ouverture et la fermeture de la modal2

const modal2 = document.getElementById("modal2");
const closemodal2 = document.getElementById("closemodal2");
const openmodal2 = document.getElementById("openmodal2");
//ouvrir la modal
openmodal2.addEventListener("click", () => {
    modal.setAttribute("aria-hidden", "true");
    modal2.setAttribute("aria-hidden", "false");
})
//fermer la modal avec le bouton +
closemodal2.addEventListener("click", () => {
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
    modal.setAttribute("aria-hidden", "false");
})

console.log(localStorage.getItem("token"));