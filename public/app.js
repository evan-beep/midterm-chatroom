
document.addEventListener("DOMContentLoaded", e => {

})

var prevScreen = null;
var db = firebase.firestore();

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    if (user.displayName !== null) {
      transition('main');
    }
    if (user.displayName === null) {
      document.getElementById('emailContainer').innerHTML = "Email: " + getUserEmail();
      transition('setUserDataScreen');

    }

  } else {
    console.log('wtf');
    transition('loginScreen');
  }
});

function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    alert(errorMessage);
  });
}

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

function emailLogin() {
  let email = document.getElementById("emailL").value;
  let password = document.getElementById('passL').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userData) => {
      let name = userData.user.displayName;
      console.log(name);
      if (name != null) {
        transition('main');
      } else {
        transition('setUserDataScreen');
      }
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
  firebase.auth().createUserWithEmailAndPassword(email, password).then(
    transition('main')
  )
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      alert(errorMessage);
    });
}

function getUserName() {
  return firebase.auth().currentUser.displayName;
}

function getUserEmail() {
  return firebase.auth().currentUser.email;
}

async function userDataChangeButton() {
  let newName = document.getElementById('nameS').value;
  var user = firebase.auth().currentUser;

  user.updateProfile({
    displayName: newName,
  }).then(function () {
    console.log(user.displayName);
  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    alert(errorMessage);
  });

}

function transition(id) {
  let allScreens = document.getElementsByClassName("cardComponent");
  for (let i = 0; i < allScreens.length; i++) {
    allScreens[i].style.display = 'none';
  }
  let show = document.getElementById(id);
  show.style.display = 'flex';
}

async function sendButtonClicked() {
  let text = document.getElementById('msgtxt').value;
  await sendMessage(roomName + '_' + roomPassword, text);
  console.log(text);
}

function htmlEnc(s) {
  return s.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&#34;');
}

function sendMessage(room, messageText) {
  return db.collection('chatrooms').doc(room).collection('messages').add({
    name: getUserName(),
    text: htmlEnc(messageText),
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    id: getUserEmail()
  }).catch(function (error) {
    console.error('Error writing new message to database', error);
  });
}

function loadMessages(room) {
  var roomMsg = db.collection('chatrooms').doc(room).collection(messages).orderBy('timestamp', 'desc').limit(12);

  roomMsg.onSnapshot(function (snapshot) {
    snapshot.docChanges().forEach(function (change) {

      var message = change.doc.data();
      if (message.timestamp !== null) {
        displayMessage(message.timestamp, message.name, message.text);
      }
    });
  });
}

function displayMessage(time, name, text) {
  let msg = document.createElement('div');
  msg.innerHTML = time + name + text;
  document.getElementById('chat').appendChild(msg);
}


var roomName;
var roomPassword;

async function goInRoom() {
  roomName = document.getElementById('roomName').value;
  roomPassword = document.getElementById('roomPassword').value;

  let name = roomName + '_' + roomPassword;
  db.collection('chatrooms').doc(name).get().then(
    doc => {
      if (doc.exists) {
        document.getElementById('chatroomTitle').innerHTML = doc.id.split('_')[0];
        transition('chatroom');
        console.log("Document data:", doc.data());
      } else {
        alert("This room does not exist!")
      }
    }
  ).catch(err => {
    console.log(err);
  })


}