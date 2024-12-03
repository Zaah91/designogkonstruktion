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
          
          <div v-if="isError" class="statusMessage">
            {{ statusMessage }}
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
                  <td>{{ users.user_fullname }}</td>
                  <td>{{ users.user_mail }}</td>
                  <td>{{ users.user_admin == 1 ? 'Admin' : 'User' }}</td>
                  <td>
                    <button class="editButton" @click="openEditDialog(users)">Edit</button>
                    <button class="editButton" @click="removeUser(users.user_id)">Remove</button>
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
                <input id="editName" v-model="editForm.user_fullname" required />
              </div>
              <div>
                <label for="editEmail">Email:</label>
                <input id="editEmail" v-model="editForm.user_mail" type="mail" required />
              </div>
              <div>
                <label for="editRole">Role:</label>
                <select id="editRole" v-model="editForm.user_admin" >
                  <option :value="true">Admin</option>
                  <option :value="false">User</option>
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
import axiosInstance from "@/api/axiosInstance";

export default {
  data() {
    return {
      users: [],
      isLoading: false,
      isError: false,
      statusMessage: "",
      isEditDialogOpen: false,
      editForm: {
        id: null,
        name: "",
        mail: "",
        role: "",
      },
      searchQuery: "",
    };
  },
  computed: {
    // Filtrer brugerlisten baseret på input i søgefeltet
    filteredUsers() {
      return this.users.filter((users) =>
        `${users.user_fullname} ${users.user_mail} ${users.user_admin}`
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    // Hent en liste af brugere fra vores backend.
    // Bemærk: det her er absolut ikke optimalt, fordi vi henter ALLE brugerne ud.
    //         Det kan være meget tungt, hvis der er mange brugere, og bør derfor deles op i "batches" og noget "pagination" af en art..
    async fetchUsers() {
      this.isLoading = true;
      this.isError = false;
      try {
        const response = await axiosInstance.get(this.$apiUrl + "/users");
        this.users = response.data;
      } catch (error) {
        this.isError = true;
        this.statusMessage = error.message || "Kunne ikke indlæse brugere.";
      } finally {
        this.isLoading = false;
      }
    },
    // Metode til at åbne dialogboksen til at editere en bruger
    openEditDialog(user_id) {
      this.isEditDialogOpen = true;
      this.editForm = { ...user_id };
    },
    async fetchUserData(userId) {
      try {
        const response = await axiosInstance.get("/users/" + userId);
        const userData = response.data;
        this.editForm.user_id = userData.user_id;
        this.editForm.user_fullname = userData.user_fullname;
        this.editForm.user_mail = userData.user_mail;
        this.editForm.user_admin = userData.user_admin;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    // Metode til at gemme brugeren
    async saveEdit() {
      try {
        const response = await axiosInstance.patch(this.$apiUrl + `/users/${this.editForm.user_id}`, {
          user_fullname: this.editForm.user_fullname,
          user_mail: this.editForm.user_mail,
          user_admin: this.editForm.user_admin ? 1 : 0,
        });
        const updatedUser = response.data;
        const userIndex = this.users.findIndex((u) => u.user_id === this.editForm.user_id);
        if (userIndex !== -1) {
          this.users[userIndex] = updatedUser;
        }
        this.fetchUsers();
        this.closeEditDialog();
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    },
    closeEditDialog() {
      this.isEditDialogOpen = false;
      this.editForm = { user_id: null, user_fullname: "", user_mail: "", user_admin: "" };
    },
    // Metode til at slette en bruger fra databasen
    async removeUser(userId) {
      try {
        await axiosInstance.delete("/users/" + userId);
        this.fetchUsers();
      } catch (error) {
        console.error("Failed to remove user:", error.message);
      }
    },
  },
  async mounted() {
    await this.fetchUsers(); // Hent en liste af brugere, når vi har mounted appen
  },
};
</script>

  
  <style>
  .table-container {
    height: 660px;
    overflow: hidden; 
    border: black;
    border-style: solid;
    border-radius: 8px;
    margin-top: -20px;
  }
  
  .user-table {
    width: 100%;
    border-collapse: collapse;
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
    background-color: #efefef;
  }

  th,td {
    padding: 8px; 
    text-align: left; 
    padding-left: 14px;
    font-size: 16px;
  }
  
  .table-scroll {
    display: block;
    max-height: 660px;
    overflow-y: auto;
  }
  
  tbody {
    display: block;
    width: 100%;
    overflow-y: auto;
  }
  
  tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  
  td {
    border-top: 1px solid #ccc;
  }
  
  td:nth-child(2) {
    white-space: nowrap;
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
  