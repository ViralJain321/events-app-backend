const { hash } = require('bcryptjs');
const { v4: generateId } = require('uuid');

const { NotFoundError } = require('../util/errors');


const db = require('../db/db');

async function add(data) {
  const userId = generateId();
  const hashedPw = await hash(data.password, 12);
  const newUser = { id: userId, email: data.email, password: hashedPw, }

  const ref = db.ref('users');
  ref.push(newUser).then(() => {
    console.log('User inserted successfully.');
  });

  return { id: userId, email: data.email };
}



async function getUser(email) {
  const ref = db.ref('users');

  const user = await ref.once('value')
    .then((snapshot) => {
      const users = snapshot.val();
      const usersArr = [];

      for (const key in users) {
        const user = {
          id: key,
          ...users[key]
        };
        usersArr.push(user);
      }

      const user = usersArr.find((ev) => ev.email === email);
      if (!user) {
        throw new NotFoundError('Could not find user for email ' + email);
      }

      return user;
    })

  return user;

}

exports.getUser = getUser;
exports.add = add;

