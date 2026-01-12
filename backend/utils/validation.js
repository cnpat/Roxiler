const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

const validateName = (name) =>
  typeof name === 'string' && name.trim().length >= 20 && name.trim().length <= 60;

const validateAddress = (address) =>
  typeof address === 'string' && address.trim().length > 0 && address.trim().length <= 400;

const validatePassword = (password) => passwordRegex.test(password || '');

const validateEmail = (email) => emailRegex.test((email || '').toLowerCase());

exports.validateSignup = ({ name, email, address, password }) => {
  if (!validateName(name)) return 'Name must be 20-60 characters.';
  if (!validateEmail(email)) return 'Invalid email.';
  if (!validateAddress(address)) return 'Address is required (max 400 chars).';
  if (!validatePassword(password))
    return 'Password must be 8-16 chars with an uppercase and a special character.';
  return null;
};

exports.validateAdminUser = ({ name, email, address, password, role }) => {
  const base = exports.validateSignup({ name, email, address, password });
  if (base) return base;
  if (!['admin', 'user', 'owner'].includes(role)) return 'Invalid role.';
  return null;
};

exports.validateLogin = ({ email, password }) => {
  if (!validateEmail(email)) return 'Invalid email.';
  if (!password) return 'Password is required.';
  return null;
};

exports.validatePasswordChange = ({ oldPassword, newPassword }) => {
  if (!oldPassword) return 'Old password is required.';
  if (!validatePassword(newPassword))
    return 'New password must be 8-16 chars with an uppercase and a special character.';
  return null;
};

const validateStoreName = (name) =>
  typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 60;

exports.validateStore = ({ name, email, address, owner }) => {
  if (!validateStoreName(name)) return 'Store name is required (max 60 chars).';
  if (!validateEmail(email)) return 'Invalid store email.';
  if (!validateAddress(address)) return 'Address is required (max 400 chars).';
  if (!owner) return 'Owner is required.';
  return null;
};
