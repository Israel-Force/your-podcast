/** This object test for various inputs with the regEx rule */
const test = {
  RegEx: {
    firstName: /^[a-z]{2,50}$/i,
    lastName: /^[a-z]{2,50}$/i,
    password: /^[\w]{6,20}$/i,
    email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i,
  },
  testFirstName: (fN) => {
    return test.RegEx.firstName.test(fN);
  },

  testLastName: (lastName) => {
    return test.RegEx.lastName.test(lastName);
  },

  testEmail: (email) => {
    return test.RegEx.email.test(email);
  },

  testPassword: (password) => {
    return test.RegEx.password.test(password);
  },
};

export default test;
