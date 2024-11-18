<template>
  <div>
    <v-container>
      <v-text-field
        label="Search users"
        v-model="searchQuery"
        outlined
        clearable
      ></v-text-field>
      <div class="table-container">
        <table class="user-table">
          <thead>
            <tr>
              <th>Users ID</th>
              <th>Users Name</th>
              <th>Users Email</th>
              <th>Users Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody class="table-scroll">
            <tr
              v-for="(user, index) in filteredUsers"
              :key="user.id"
              :class="{ 'even-row': index % 2 === 0 }"
            >
              <td>#{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button class="editButton" @click="editUser(user)">Edit</button>
                <button class="editButton" @click="removeUser(user.id)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-container>
    <div v-if="isEditDialogOpen" class="dialog-overlay">
      <div class="dialog-box">
        <h3>Edit User</h3>
        <form @submit.prevent="saveEdit">
          <div>
            <label for="editName">Name:</label>
            <input id="editName" v-model="editForm.name" required />
          </div>
          <div>
            <label for="editEmail">Email:</label>
            <input id="editEmail" v-model="editForm.email" type="email" required />
          </div>
          <div>
            <label for="editRole">Role:</label>
            <select id="editRole" v-model="editForm.role">
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <button class="editButton" type="submit">Save</button>
            <button class="editButton" type="button" @click="closeEditDialog">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      users: [
        { id: 1, name: "Alice Web", email: "alice@example.com", role: "User" },
        { id: 2, name: "Bob Web", email: "bob@example.com", role: "Admin" },
        { id: 3, name: "Charlie Lastter", email: "charlie@example.com", role: "User", },
        { id: 4, name: "Dan Oples", email: "Dan@example.com", role: "User" },
        { id: 5, name: "Charles Thiger", email: "Charles@example.com", role: "User", },
        { id: 6, name: "Tobi Gorige", email: "Tobi@example.com", role: "User" },
        { id: 7, name: "Hedi Gorige", email: "Hedi@example.com", role: "User" },
        { id: 8, name: "Tehter Yolge", email: "Tehter@example.com", role: "User", },
        { id: 9, name: "Tobi Hester", email: "Tobi@example.com", role: "User" },
        { id: 10, name: "Emma Stone", email: "emma.stone@example.com", role: "User", },
        { id: 11, name: "John Doe", email: "john.doe@example.com", role: "Admin", },
        { id: 12, name: "Jane Smith", email: "jane.smith@example.com", role: "User", },
        { id: 13, name: "Michael Johnson", email: "michael.johnson@example.com", role: "User", },
        { id: 14, name: "Sarah Connor", email: "sarah.connor@example.com", role: "User", },
        { id: 15, name: "Peter Parker", email: "peter.parker@example.com", role: "User", },
        { id: 16, name: "Bruce Wayne", email: "bruce.wayne@example.com", role: "Admin", },
        { id: 17, name: "Clark Kent", email: "clark.kent@example.com", role: "User", },
        { id: 18, name: "Diana Prince", email: "diana.prince@example.com", role: "User", },
        { id: 19, name: "Tony Stark", email: "tony.stark@example.com", role: "Admin", },
        { id: 20, name: "Natasha Romanoff", email: "natasha.romanoff@example.com", role: "User", },
        { id: 21, name: "Nata Viker", email: "TonToner@example.com", role: "User", },
        { id: 22, name: "Billy Prince", email: "Princer@example.com", role: "User", },
        { id: 23, name: "Pete Dan", email: "TheDancer@example.com", role: "User", },
      ],
      isEditDialogOpen: false, 
      editForm: {
        id: null,
        name: "",
        email: "",
        role: "",
      },
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) =>
        `${user.name} ${user.email} ${user.role}`
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    editUser(user) {
      // Open the edit dialog and populate the form with user data
      this.isEditDialogOpen = true;
      this.editForm = { ...user };
    },
    saveEdit() {
      // Find the user and update their details
      const userIndex = this.users.findIndex((u) => u.id === this.editForm.id);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.editForm };
      }
      this.closeEditDialog();
    },
    closeEditDialog() {
      // Close the edit dialog and reset the form
      this.isEditDialogOpen = false;
      this.editForm = { id: null, name: "", email: "", role: "" };
    },
    removeUser(userId) {
      // Remove the user by their ID
      this.users = this.users.filter((user) => user.id !== userId);
    },
  },
};
</script>

<style>

.table-container {
  height: 660px; /* Set the height you want for the scrollable area */
  overflow: hidden; /* Hide overflow to prevent scrollbars on the container */
  border: black;
  border-style: solid;
  border-radius: 8px;
  margin-top: -20px; /* Negative margin to compensate for the input details height */
}

.user-table {
  width: 100%; /* Ensure the table takes full width */
  border-collapse: collapse; /* Collapse borders for better alignment */
}

thead {
  position: sticky; 
  top: 0; 
  background-color: #cf6b5f; 
  color: #ffffff;
  z-index: 1; 
  border: black;
  border-style: solid;
}

.even-row {
  background-color: #efefef; /* Change this to your desired color */
}

th,td {
  padding: 8px; /* Add padding for both th and td */
  text-align: left; /* Align text to the left for better readability */
  padding-left: 14px;
}

.table-scroll {
  display: block; /* Allow the body to scroll */
  max-height: 660px; /* Set a fixed height for the scrollable body */
  overflow-y: auto; /* Enable vertical scrolling for the body */
}

tbody {
  display: block; /* Allow the tbody to behave as a block */
  width: 100%; /* Ensure tbody takes full width */
  overflow-y: auto; /* Enable vertical scrolling for the body */
}

tr {
  display: table; /* Ensure rows behave like table rows */
  width: 100%; /* Ensure rows take full width */
  table-layout: fixed; /* Prevent rows from resizing */
}

td {
  border-top: 1px solid #ccc; /* Optional: Add a border to the top of each cell */
}

td:nth-child(2) {
  white-space: nowrap; /* Prevent names from wrapping */
}

.editButton {
    padding: 6px;
    margin: 4px;
    background-color: #ccc;
    border-radius: 10px;
}

.editButton:hover{
    background-color: #c6c1c1;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px;
}

.dialog-box h3 {
  margin-bottom: 16px;
}

.dialog-box form div {
  margin-bottom: 12px;
}

.dialog-box button {
  margin-right: 8px;
}

form div label{
    padding: 4px;
}

form div input{
    border: none;
    border-bottom: 1px solid black; 
    outline: none; 
    padding: 4px; 
    margin: 5px 0; 
}

form div select {
    background-color: #ccc; /* Background color */
    padding: 4px; /* Padding inside the select */
    border: 1px solid #888; /* Border color and width */
    border-radius: 4px; /* Rounded corners */
    font-size: 16px; /* Font size */
    color: #333; /* Text color */
    appearance: none; /* Remove default styling in some browsers */
    cursor: pointer; /* Pointer cursor on hover */
    text-align: center;
}

/* Optional: Add a hover effect */
form div select:hover {
    background-color: #bbb; /* Change background color on hover */
}

</style>
