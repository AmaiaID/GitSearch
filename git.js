// Save the input in a variable
var data;
// Add event listeners to the search button
document.getElementById("searchB").addEventListener("click", function () {
    getUser();
    refreshSearch();
});
// Search pressing Enter
document.getElementById("searchInput").onkeypress = function (e) {
    if (e.keyCode === 13) {
        document.getElementById("searchB").click();
    }
}

function getUser() {
    var username = document.getElementById("searchInput").value;
    console.log(username);

    fetch("https://api.github.com/users/" + username, {
            method: "GET",
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        }).then(function (json) {
            data = json;
            showUser();
            return fetch("https://api.github.com/users/" + username + "/repos?per_page=100");
        })
        .then(function (response) {
            return response.json();
        }).then(function (secondCall) {
            console.log(secondCall); //2nd request result

            showRepository(secondCall);
        }).catch(function (error) {
            /* In case there are no users/repository the divs containing them must be hidden, otherwise the Main div occupies more space than it should. */
            document.getElementById("showProfile").style.display = "none";
            document.getElementById("showTable").style.display = "none";
            showError();
            console.log("Request failed:" + error.message);
        });
}

function showUser() {
    //Display flex class in the profile, it is hidden by default
    document.getElementById("showProfile").style.display = "flex";
    document.getElementById("tbody").innerHTML = "";

    // Create variables to store the JSON DATA
    var login = data.login;
    var fullName = data.name;
    var picture = data.avatar_url;
    var bio = data.bio;

    //Create elements//
    var avatar = document.createElement("img");
    var userLogin = document.createElement("h6");
    var wholeName = document.createElement("h3");
    var biography = document.createElement("h6");

    // Fill up the variables with the JSON data
    userLogin.textContent = "@" + login;
    wholeName.textContent = fullName;
    biography.textContent = bio;
    avatar.src = picture;
    avatar.classList.add("picture");

    // Get the HTML ELEMENTS BY ID//
    var userPic = document.getElementById("userPic");
    var userDetails = document.getElementById("userDetails");
    userPic.innerHTML = "";
    userDetails.innerHTML = "";

    // Join the created elements to the existing elements
    userPic.appendChild(avatar);
    userDetails.appendChild(userLogin);
    userDetails.appendChild(wholeName);
    userDetails.appendChild(biography);
}

function showRepository(repos) {

    if (repos.length > 0) {
        document.getElementById("showTable").style.display = "flex";
        document.getElementById("tbody").innerHTML = "";
        for (var i = 0; i < repos.length; i++) {

            // Store the repos inside variables//
            console.log(repos[i].name)
            var repositoryName = repos[i].name;
            var starNumber = repos[i].stargazers_count;
            var forkNumber = repos[i].forks_count;
            // Create The elements to store images, add them a class 
            var starIcon = document.createElement("img");
            var forkIcon = document.createElement("img");
            starIcon.classList.add("statsIcon");
            forkIcon.classList.add("statsIcon");
            forkIcon.src = "images/fork.png";
            starIcon.src = "images/star.png"

            // Create tr and tds for the table, add them a class
            var tr = document.createElement("tr");
            var repName = document.createElement("td");
            repName.classList.add("tdRepName");
            var statistics = document.createElement("td");
            statistics.classList.add("tdStatistics");

            // Create the heading content// 
            document.getElementById("th").textContent = "Repositories";

            //Append the content to the trs
            repName.append(repositoryName);
            statistics.append(starIcon);
            statistics.append(starNumber);
            statistics.append(forkIcon);
            statistics.append(forkNumber);

            // Append tds to trs
            tr.append(repName);
            tr.append(statistics);

            //Append trs to tbody
            document.getElementById("tbody").append(tr);
        }
    } else {
        document.getElementById("noRepository").style.display = "flex";
        document.getElementById("showTable").style.display = "none";
    }
}

function showError() {
    var errors = document.getElementById("showError");
    console.log(errors)
    errors.style.display = "block";
}

function refreshSearch() {
    // Avoid showing the error message when making a second search (after first unsuccesful search)
    document.getElementById("showError").style.display = "none";
    // Avoid showing the no repository message when a second search is made(after first unsucessful search)
    document.getElementById("noRepository").style.display = "none";
    //Empty the search box value after the search is made
    document.getElementById("searchInput").value = "";
}
