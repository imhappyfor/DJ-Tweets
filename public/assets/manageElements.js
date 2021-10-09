function reloadButton() {
    let reloadDiv = document.createElement('div');
    reloadDiv.style.display = "flex";
    reloadDiv.style.justifyContent ="center";
    reloadDiv.style.alignItems = "center";

    let reloadButton = document.createElement('button');
    reloadButton.textContent = 'Try again with another user!';
    reloadButton.addEventListener("click",reloadPage);

    reloadDiv.appendChild(reloadButton);
    document.body.appendChild(reloadDiv);
}