const isValidPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\.!\-_$@?%#&])[A-Za-z\d\.!\-_$@?%#&]{8,}$/;
  const seqs = [/123/, /abc/, /aaa/, /000/, /987/];
  return regex.test(password) && !seqs.some((seq) => seq.test(password.toLowerCase()));
};

module.exports = { isValidPassword };