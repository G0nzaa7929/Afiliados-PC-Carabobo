// Bloquea la página hasta que el administrador inicie sesión.
if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
(function () {
  var css = document.createElement('style');
  css.textContent =
    '#login-overlay{position:fixed;inset:0;background:#f0f2f5;display:flex;align-items:center;justify-content:center;z-index:9999;font-family:"Segoe UI",Tahoma,sans-serif}' +
    '#login-overlay form{background:#fff;padding:28px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.12);width:min(340px,90vw)}' +
    '#login-overlay h2{margin:0 0 16px;color:#1557b0;font-size:1.15em;text-align:center}' +
    '#login-overlay input{width:100%;box-sizing:border-box;padding:10px;margin-bottom:12px;border:1px solid #ccc;border-radius:4px;font-size:1em}' +
    '#login-overlay button{width:100%;padding:11px;background:#1557b0;color:#fff;border:0;border-radius:4px;font-size:1em;cursor:pointer}' +
    '#login-error{color:#c5221f;font-size:.9em;min-height:1.2em;margin:0 0 10px}' +
    '#btn-logout{position:fixed;top:10px;right:10px;z-index:9000;padding:6px 12px;background:#fff;border:1px solid #1557b0;color:#1557b0;border-radius:4px;cursor:pointer;display:none}';
  document.head.appendChild(css);

  document.addEventListener('DOMContentLoaded', function () {
    var overlay = document.createElement('div');
    overlay.id = 'login-overlay';
    overlay.innerHTML =
      '<form id="login-form"><h2>Acceso del administrador</h2>' +
      '<input type="email" id="login-email" placeholder="Correo" required autocomplete="username">' +
      '<input type="password" id="login-pass" placeholder="Contraseña" required autocomplete="current-password">' +
      '<p id="login-error" role="alert"></p><button type="submit">Iniciar sesión</button></form>';
    document.body.appendChild(overlay);

    var salir = document.createElement('button');
    salir.id = 'btn-logout'; salir.type = 'button'; salir.textContent = 'Cerrar sesión';
    salir.onclick = function () { firebase.auth().signOut(); };
    document.body.appendChild(salir);

    document.getElementById('login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      document.getElementById('login-error').textContent = '';
      firebase.auth().signInWithEmailAndPassword(
        document.getElementById('login-email').value,
        document.getElementById('login-pass').value
      ).catch(function (err) {
        var c = err.code || '';
        var msg = {
          'auth/user-not-found': 'Correo o contraseña incorrectos.',
          'auth/wrong-password': 'Correo o contraseña incorrectos.',
          'auth/invalid-credential': 'Correo o contraseña incorrectos.',
          'auth/invalid-login-credentials': 'Correo o contraseña incorrectos.',
          'auth/invalid-email': 'El correo no tiene un formato válido.',
          'auth/operation-not-allowed': 'En Firebase falta activar el método Correo electrónico/contraseña.',
          'auth/invalid-api-key': 'La apiKey de firebase-config.js no es válida.',
          'auth/api-key-not-valid': 'La apiKey de firebase-config.js no es válida.',
          'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
          'auth/network-request-failed': 'Sin conexión o bloqueo de red.'
        }[c] || 'Error de acceso.';
        document.getElementById('login-error').textContent = msg + ' (' + c + ')';
      });
    });

    firebase.auth().onAuthStateChanged(function (user) {
      overlay.style.display = user ? 'none' : 'flex';
      salir.style.display = user ? 'block' : 'none';
    });
  });
})();
