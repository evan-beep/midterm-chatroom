
document.addEventListener("DOMContentLoaded", e => {

})

var prevScreen = null;

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(
      res => {
        const user = res.user;
        console.log(user);
      }
    )
}

function emailLogin() {
  let email = document.getElementById("emailL").value;
  let password = document.getElementById('passL').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      alert(errorMessage);
    });
}

function emailRegister() {
  let email = document.getElementById("emailR").value;
  let password = document.getElementById('passR').value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      alert(errorMessage);
    });
}

function transition(id1, id2) {
  prevScreen = id1;
  let first = document.getElementById(id1);
  let second = document.getElementById(id2);

  first.style.display = 'none';
  second.style.display = 'flex';
}