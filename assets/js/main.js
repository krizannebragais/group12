function getUsers() {
  fetch('/getUsers')
      .then(response => response.json())
      .then(data => {
          const users = data.users;
          const usernames = users.map(user => user.username);
          displayUsers(usernames);
      })
      .catch(error => {
          console.log('Error:', error);
      });
}