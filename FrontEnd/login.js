//authentification de l'utilisateur 

const connexion = document.querySelector("#loginForm");
connexion.addEventListener("submit", function (e) {
    e.preventDefault();   // empcher le comportrement par defaut du formulaire  

    const email = document.querySelector("#email").value;
    const motdepasse = document.querySelector("#motdepasse").value;
   
    fetch("http://localhost:5678/api/users/login", {
        method: "post", // définition de la méthode de la requête: envoi de donnée
        headers: {
            "Content-Type": "application/json" //type des données envoyées 
        },
        body: JSON.stringify({ // les données envoyées
            email: email,
            password: motdepasse
        })
    })
        .then(response => {
            console.log("Statut :", response.status) // récuperer le statut de la réponse api
            console.log("Statut :", response.body)
            if (response.status === 200) {
                window.location.href = "index.html"; // redirection vers la page d'accueil
                return response.json(); //retourne la réponse en json
            } else {
                throw new Error("Erreur dans l’identifiant ou le mot de passe");
            }
        })
        .then(response => {
            console.log(response.token)
            localStorage.setItem("token", response.token);
            console.log(localStorage.getItem("token"));
        })
        .catch(error => {
            document.getElementById("messageerreur").textContent = error.message;
            document.getElementById("messageerreur").style.display = "block";
        }
        );
})

