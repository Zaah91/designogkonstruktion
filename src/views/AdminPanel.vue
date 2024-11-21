<template>
  <v-main class="mainContent">
    <div class="pa-4 flexWrap">
      <div class="flex-grow-1 flex-shrink-1">
        <v-container>
          <!-- Search Bar -->
          <v-text-field
            label="Search users"
            v-model="searchQuery"
            outlined
            clearable
          ></v-text-field>

          <div v-if="isLoading">Loading users...</div>
          
          <div v-if="isError" class="error-message">
            {{ errorMessage }}
          </div>

          <div v-if="!isLoading && !isError" class="table-container">
            <table class="users-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>User Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody class="table-scroll">
                <tr
                  v-for="(users, index) in filteredUsers"
                  :key="users.id"
                  :class="{ 'even-row': index % 2 === 0 }"
                >
                  <td>#{{ users.user_id }}</td>
                  <td>{{ users.user_name }}</td>
                  <td>{{ users.user_mail }}</td>
                  <td>{{ users.user_admin }}</td>
                  <td>
                    <button class="editButton" @click="editUser(users)">Edit</button>
                    <button class="editButton" @click="removeUser(users.id)">Remove</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </v-container>

        <!-- Edit User Dialog -->
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
                <input id="editEmail" v-model="editForm.mail" type="mail" required />
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
    </div>
  </v-main>
</template>

  
<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: "",
      users: [],
      isLoading: false,
      isError: false,
      errorMessage: "",
      isEditDialogOpen: false,
      editForm: {
        id: null,
        name: "",
        mail: "",
        role: "",
      },
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((users) =>
        `${users.name} ${users.mail} ${users.role}`
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },

  },
  methods: {
    // Fetch users from the API
    async fetchUsers() {
      this.isLoading = true;
      this.isError = false;
      try {
        const response = await axios.get("http://localhost:8081/users");
        this.users = response.data;
        console.log(response.data);
      } catch (error) {
        console.log(error);
        this.isError = true;
        this.errorMessage = error.message || "Failed to load users.";
      } finally {
        this.isLoading = false;
      }
    },
    // Open the edit dialog and populate the form
    editUser(users) {
      this.isEditDialogOpen = true;
      this.editForm = { ...users };
    },
    // Save the edits and update the table
    saveEdit() {
      const userIndex = this.users.findIndex((u) => u.id === this.editForm.id);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.editForm };
      }
      this.closeEditDialog();
    },
    // Close the edit dialog
    closeEditDialog() {
      this.isEditDialogOpen = false;
      this.editForm = { id: null, name: "", mail: "", role: "" };
    },
    // Remove a user
    async removeUser(userId) {
      try {
        await axios.delete(`http://localhost:8081/users/${userId}`);
        this.user = this.user.filter((users) => users.id !== userId);
      } catch (error) {
        console.error("Failed to remove user:", error.message);
      }
    },
  },
  async mounted() {
    await this.fetchUsers(); // Fetch the data when the component is mounted
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
    font-size: 16px;
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
      /*font-size: 16px; /* Font size */
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
  