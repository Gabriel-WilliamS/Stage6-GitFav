import { GithubUser } from "./GithubSearch.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find(
        (entry) => entry.login.toUpperCase() === username.toUpperCase()
      );
      console.log(userExists);
      if (userExists) {
        throw new Error("Usuário já cadastrado!");
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntreies = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntreies;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.addrow();
  }

  addrow() {
    const addButton = this.root.querySelector(".search button");

    addButton.addEventListener("click", () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);
      this.root.querySelector(".search input").value = "";
    });
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }

  addBackGroundTableEmpty() {
    const empty = this.root.querySelector(".table-empty");

    empty.classList.add("hidden");
  }

  removeBackGroundTableEmpty() {
    const empty = this.root.querySelector(".table-empty");

    empty.classList.remove("hidden");
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;

      row.querySelector(".user div img").alt = `Imagem de ${user.name}`;

      row.querySelector(
        ".user div a"
      ).href = `https://github.com/${user.login}`;

      row.querySelector(".user div p").textContent = user.name;

      row.querySelector(".user div span").textContent = user.login;

      row.querySelector(".repository").textContent = user.public_repos;

      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".action").addEventListener("click", () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha?");

        if (isOk) {
          this.delete(user);
          if (this.entries.length <= 0) {
            this.removeBackGroundTableEmpty();
          }
        }
      });

      if (this.entries.length > 0) {
        this.addBackGroundTableEmpty();
      }

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td class="user">
    <div>
      <img
        src="https://github.com/gabriel-williams.png"
        alt="Imagem de Gabriel William"
      />
      <a href="https://github.com/gabriel-williams" target="_blank">
        <p>Gabriel William</p>
        <span>gabriel-williams</span>
      </a>
    </div>
  </td>
  <td class="repository">123</td>
  <td class="followers">1234</td>
  <td class="action">Remover</td>
    `;

    return tr;
  }
}
