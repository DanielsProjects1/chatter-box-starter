export function renderLoginForm(shadow) {
  const modal = shadow.querySelector('.cb-auth-modal');

  modal.innerHTML = `
    <button class="cb-auth-close">×</button>

    <h3>Log in</h3>

    <input
      id="cb-login-username"
      class="cb-auth-input"
      placeholder="Username"
    />

    <input
      id="cb-login-password"
      class="cb-auth-input"
      type="password"
      placeholder="Password"
    />

    <button class="cb-auth-primary cb-auth-primary-login">
      Log in
    </button>

    <button class="cb-social-btn cb-google-btn">
      Continue with Google
    </button>

    <button class="cb-social-btn">
      Continue with Email
    </button>

    <p class="cb-auth-switch">
      Don't have an account yet?
      <button class="cb-auth-signup">
        Sign up
      </button>
    </p>
    <div class="cb-auth-error" id="cb-auth-error"></div>
  `;
}

export function renderSignupForm(shadow) {
  const modal = shadow.querySelector('.cb-auth-modal');

  modal.innerHTML = `
    <button class="cb-auth-close">×</button>

    <h3>Create account</h3>

    <input
      id="cb-signup-username"
      class="cb-auth-input"
      placeholder="Username"
    />

    <input
      id="cb-signup-email"
      class="cb-auth-input"
      placeholder="Email"
    />

    <input
      id="cb-signup-password"
      class="cb-auth-input"
      type="password"
      placeholder="Password"
    />

    <button class="cb-auth-primary">
      Create account
    </button>

    <p class="cb-auth-switch">
      Already have one?
      <button class="cb-auth-login">
        Log in
      </button>
    </p>
  `;
}

