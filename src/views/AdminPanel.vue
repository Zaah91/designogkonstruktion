<template>
  <v-main class="mainContent">
    <div class="pa-4 flexWrap">
      <div class="flex-grow-1 flex-shrink-1">
        <v-container>
          <!-- Search Bar -->
          <v-text-field
            :disabled="fullListLoading || isLoading"
            variant="outlined"
            label="Søg efter brugere"
            v-model="searchQuery"
            outlined
            clearable
            @input="filterUsers()"
          ></v-text-field>

          <div class="table-container">
            <v-data-table
              :headers="tableHeaders"
              :items="usersFetcher"
              :loading="fullListLoading"
              class="elevation-1"
            >
              <!-- Kolonne til handlinger -->
              <template v-slot:[`item.actions`]="{ item }">
                <v-row justify="end">
                  <v-col cols="auto">
                    <v-btn
                      size="large"
                      color="btnPrimary"
                      variant="flat"
                      :disabled="isLoading || loggedInUser.userId == item.user_id"
                      @click="openEditDialog(item)"
                      prepend-icon="mdi-human-edit"
                      density="comfortable"
                      >Rediger</v-btn
                    >
                  </v-col>
                  <v-col cols="auto">
                    <v-btn
                      size="large"
                      color="red"
                      variant="flat"
                      :disabled="
                        isLoading || loggedInUser.userId == item.user_id
                      "
                      @click="openRemoveConfirmDialog(item.user_id)"
                      prepend-icon="mdi-delete"
                      density="comfortable"
                      >Slet</v-btn
                    >
                  </v-col>
                </v-row>
              </template>
              <template v-slot:fullListLoading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
              </template>
            </v-data-table>
          </div>
          <v-alert
            class="my-4"
            v-if="statusMessage"
            :text="statusMessage.text"
            density="compact"
            :type="statusMessage.type"
            :icon="'$' + statusMessage.type"
            variant="tonal"
          ></v-alert>
          <v-progress-circular
            class="vflspinner my-4"
            v-if="isLoading"
            :size="100"
            indeterminate
          ></v-progress-circular>
        </v-container>

        <!-- Edit User Dialog -->
        <v-dialog v-model="isEditDialogOpen" max-width="30rem" persistent>
          <v-card prepend-icon="mdi-human-edit" title="Rediger bruger">
            <v-card-text>
              <v-text-field
                variant="outlined"
                :disabled="isLoading"
                append-icon="mdi-pencil"
                label="Navn"
                v-model="editForm.user_fullname"
                outlined
              ></v-text-field>

              <v-text-field
                variant="outlined"
                :disabled="isLoading"
                append-icon="mdi-mail"
                label="E-mail"
                v-model="editForm.user_mail"
                outlined
              ></v-text-field>
              <v-select
                variant="outlined"
                v-model="editForm.user_admin"
                append-icon="mdi-crown-circle"
                :hint="`${roleTitle} er valgt`"
                :items="[
                  { role: 'Admin', value: true },
                  { role: 'Standardbruger', value: false },
                ]"
                item-title="role"
                item-value="value"
                label="Rolle"
                persistent-hint
              ></v-select>
            </v-card-text>
            <template v-slot:actions>
              <v-btn
                size="large"
                color="btnPrimary"
                variant="flat"
                prepend-icon="mdi-content-save"
                density="comfortable"
                @click="saveEdit"
                >Gem</v-btn
              >
              <v-btn
                size="large"
                color="btnPrimary"
                variant="outlined"
                prepend-icon="mdi-close"
                density="comfortable"
                @click="closeEditDialog"
                >Annuler</v-btn
              >
            </template>
          </v-card>
        </v-dialog>

        <!-- Delete User Dialog -->
        <v-dialog v-model="isDeleteDialogOpen" max-width="30rem" persistent>
          <v-card prepend-icon="mdi-delete" title="Bekræft sletning">
            <v-card-text>
              <v-alert
                class="statusMessage"
                text="Brugeren og alt tilhørende data vil blive permanent slettet!"
                density="compact"
                type="warning"
                :icon="warning"
                variant="tonal"
              ></v-alert>
            </v-card-text>
            <template v-slot:actions>
              <v-btn
                size="large"
                color="btnPrimary"
                variant="outlined"
                prepend-icon="mdi-content-save"
                density="comfortable"
                @click="removeUser"
                >Bekræft</v-btn
              >
              <v-btn
                size="large"
                color="btnPrimary"
                variant="flat"
                prepend-icon="mdi-close"
                density="comfortable"
                @click="isDeleteDialogOpen = false"
                >Annuler</v-btn
              >
            </template>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </v-main>
</template>

<script>
import axiosInstance from "@/api/axiosInstance";
import debounce from "lodash/debounce";
import { useLoggedInUserStore } from "../stores/loggedInUser";

export default {
  data() {
    return {
      tableHeaders: [
        { title: "Navn", value: "user_fullname" },
        { title: "E-mail", value: "user_mail" },
        { title: "Handlinger", value: "actions", sortable: false },
      ],
      users: [],
      filteredUsers: [],
      fullListLoading: false,
      isLoading: false,
      statusType: "info",
      statusMessage: "",
      isEditDialogOpen: false,
      isDeleteDialogOpen: false,
      deleteThisUser: null,
      editForm: {
        id: null,
        name: "",
        mail: "",
        role: false,
      },
      searchQuery: "",
    };
  },
  computed: {
    usersFetcher() {
      if (
        typeof this.searchQuery == "string" &&
        this.searchQuery.length > 0 &&
        this.filteredUsers.length > 0
      ) {
        return this.filteredUsers;
      } else {
        return this.users;
      }
    },
    roleTitle() {
      return this.editForm.user_admin ? "Administrator" : "Standardbruger";
    },
    loggedInUser() {
      // Retuner user-objektet for den bruger, som er logget ind
      return useLoggedInUserStore().user;
    },
  },
  methods: {
    // Hent en liste af brugere fra vores backend.
    // Bemærk: det her er absolut ikke optimalt, fordi vi henter ALLE brugerne ud.
    // Det kan være meget tungt, hvis der er mange brugere, og bør derfor deles op i "batches" og noget "pagination" af en art..
    async fetchUsers() {
      this.fullListLoading = true;
      try {
        const response = await axiosInstance.get(this.$apiUrl + "/users");
        this.users = response.data;
      } catch (error) {
        this.statusMessage = error?.message || "Kunne ikke indlæse brugere.";
      } finally {
        this.fullListLoading = false;
      }
    },
    filterUsers: debounce(function () {
      // Filtrer brugerlisten baseret på input i søgefeltet
      this.filteredUsers = this.users.filter((users) =>
        `${users.user_fullname} ${users.user_mail} ${users.user_admin}`
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    }, 300),
    // Metode til at åbne dialogboksen til at editere en bruger
    openEditDialog(user) {
      this.isEditDialogOpen = true;
      this.editForm = { ...user };
    },
    openRemoveConfirmDialog(userId) {
      this.deleteThisUser = userId;
      this.isDeleteDialogOpen = true;
    },
    // Metode til at gemme brugeren
    async saveEdit() {
      try {
        this.isEditDialogOpen = false;
        this.isLoading = true;
        const unmodifiedUser = this.users.find(
          (user) => user.user_id === this.editForm.user_id
        );

        // Find ud af hvad præcis har ændret sig ved brugeren, og opdater kun det (patch), som har ændret sig
        const updatedFields = {};

        if (this.editForm.user_fullname !== unmodifiedUser.user_fullname) {
          updatedFields.user_fullname = this.editForm.user_fullname;
          unmodifiedUser.user_fullname = this.editForm.user_fullname; // Opdater den originale data uden behov for at kontakte vores backend igen
        }

        if (this.editForm.user_mail !== unmodifiedUser.user_mail) {
          updatedFields.user_mail = this.editForm.user_mail;
          unmodifiedUser.user_mail = this.editForm.user_mail;
        }

        if ((this.editForm.user_admin ? 1 : 0) !== unmodifiedUser.user_admin) {
          updatedFields.user_admin = this.editForm.user_admin ? 1 : 0;
          unmodifiedUser.user_admin = this.editForm.user_admin ? 1 : 0;
        }

        // Send patch anmodningen med de opdaterede data
        const response = await axiosInstance.patch(
          this.$apiUrl + `/users/${this.editForm.user_id}`,
          updatedFields
        );
        this.statusMessage = {
          text:
            response?.data?.message ||
            "Mangler svar fra serveren. Brugeren blev muligvis ikke opdateret korrekt.",
          type: "info",
        };
      } catch (error) {
        this.statusMessage = {
          text: error?.message || "Kunne ikke gemme de opdaterede data.",
          type: "error",
        };
      } finally {
        this.isLoading = false;
      }
    },
    closeEditDialog() {
      this.isEditDialogOpen = false;
      this.editForm = {
        user_id: null,
        user_fullname: "",
        user_mail: "",
        user_admin: "",
      };
    },
    // Metode til at slette en bruger fra databasen
    async removeUser() {
      if (!this.deleteThisUser) {
        return;
      }
      try {
        this.isDeleteDialogOpen = false;
        this.isLoading = true;
        const response = await axiosInstance.delete(
          "/users/" + this.deleteThisUser
        );
        this.statusMessage = {
          text:
            response.data?.message ||
            "Ukendt svar. Brugeren blev muligvis ikke slettet.",
          type: "info",
        };
      } catch (error) {
        this.statusMessage = {
          text: error?.message || "Brugeren blev ikke slettet.",
          type: "error",
        };
      } finally {
        this.users = this.users.filter(
          (user) => user.user_id !== this.deleteThisUser
        );
        this.isLoading = false;
        this.deleteThisUser = null;
      }
    },
  },
  async mounted() {
    await this.fetchUsers(); // Hent en liste af brugere, når vi har mounted appen
  }
};
</script>

<style scoped>
.v-data-table-header__content {
  font-weight: bold;
}
</style>
