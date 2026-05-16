const ADMIN_AUTH_KEY = 'vnme_admin_authenticated';
const ADMIN_USERNAME = 'tecxmate';
const ADMIN_PASSWORD = 'tecxmate';

export function isAdminAuthenticated() {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function loginAdmin(username, password) {
    const ok = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    if (ok) {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    }
    return ok;
}

export function logoutAdmin() {
    localStorage.removeItem(ADMIN_AUTH_KEY);
}
