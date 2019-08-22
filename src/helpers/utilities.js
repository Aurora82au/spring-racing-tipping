/********** Helper functions that could be used in multiple places throughout the app. **********/

/* Logout the user and return to the Log In page. */
export function logOut() {
    localStorage.clear();
    window.location.href = '/login';
};


/* Generates a random number of the specified length, ensuring it never starts with 0. */
export function generateId(length) {
    let min = '1';
    let max = '9';
    
    for (let i = 0; i < length - 1; i++) {
        min += '0';
        max += '0';
    }
    
    return Math.floor(parseInt(min) + Math.random() * parseInt(max));
}